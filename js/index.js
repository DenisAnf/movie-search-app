const filmNameNode = document.getElementById("filmName");
const filmSearchButton = document.getElementById("filmSearchButton");
const filmErrorNode = document.getElementById("filmError");
const filmsOutputNode = document.getElementById("movies");

const IMAGE_TO_FILM_WITHOUT_POSTER = "./resourses/img/searchMovie.webp";
const LIMIT_LENGTH_FILM_NAME = 130;
const REG_SPACES_PUNСTUATION_MARKS = /[ \t\r\n\p{P}\s]/gu;
const STORAGE_LABEL_MOVIES = "films";
const STORAGE_LABEL_MOVIE = "film";

const apiOmdbLink = "//www.omdbapi.com/";
const apiOmdbKey = "e47d08b8";
const apiTranslateLink =
   "https://translated-mymemory---translation-memory.p.rapidapi.com/get";
const apiTranslateKey = "9ffd4a8b32mshe8145e4c83e463bp1d5e15jsnfaa3c9332f3f";

let films = [];
let film = [];

const getFilms = () => films;

const saveFilmsToLocalStorage = () => {
   const movies = getFilms();
   const moviesString = JSON.stringify(movies);
   localStorage.setItem(STORAGE_LABEL_MOVIES, moviesString);
};

const getFilmsFromLocalStorage = () => {
   const filmsFromLocalStorageString =
      localStorage.getItem(STORAGE_LABEL_MOVIES);
   const filmsFromLocalStorage = JSON.parse(filmsFromLocalStorageString);

   if (Array.isArray(filmsFromLocalStorage)) {
      films = filmsFromLocalStorage;
   }
};

const bildFilmsHtml = (bill) => {
   const billContainer = document.createElement("ul");
   billContainer.className = "movies__list";

   bill.forEach((element) => {
      let filmPosterLink =
         element.Poster === "N/A"
            ? IMAGE_TO_FILM_WITHOUT_POSTER
            : element.Poster;

      const elFilm = document.createElement("li");
      const elFilmImage = document.createElement("img");
      const elFilmDescription = document.createElement("div");
      const elFilmTitle = document.createElement("p");
      const elFilmYear = document.createElement("p");
      const elFilmType = document.createElement("p");

      elFilm.className = "movies__list-item";
      elFilmImage.className = "movie__img";
      elFilmDescription.className = "movie__description";
      elFilmTitle.className = "movie__title";
      elFilmYear.className = "movie__year";
      elFilmType.className = "movie__type";

      elFilm.setAttribute("id", element.imdbID);
      elFilmImage.setAttribute("src", filmPosterLink);
      elFilmImage.setAttribute("alt", "Постер фильма или сериала");

      elFilmTitle.innerText = element.Title;
      elFilmYear.innerText = element.Year;
      elFilmType.innerText = element.Type;

      elFilm.appendChild(elFilmImage);
      elFilm.appendChild(elFilmDescription);
      elFilmDescription.appendChild(elFilmTitle);
      elFilmDescription.appendChild(elFilmYear);
      elFilmDescription.appendChild(elFilmType);

      billContainer.appendChild(elFilm);
   });

   return billContainer;
};

const bildFilmHtml = (film) => {
   const filmContainer = document.createElement("div");
   filmContainer.innerText = film.Title;
   filmContainer.className = "movies__list";
   console.log(film);
   /*bill.forEach((element) => {
      let filmPosterLink =
         element.Poster === "N/A"
            ? IMAGE_TO_FILM_WITHOUT_POSTER
            : element.Poster;

      const elFilm = document.createElement("li");
      const elFilmImage = document.createElement("img");
      const elFilmDescription = document.createElement("div");
      const elFilmTitle = document.createElement("p");
      const elFilmYear = document.createElement("p");
      const elFilmType = document.createElement("p");

      elFilm.className = "movies__list-item";
      elFilmImage.className = "movie__img";
      elFilmDescription.className = "movie__description";
      elFilmTitle.className = "movie__title";
      elFilmYear.className = "movie__year";
      elFilmType.className = "movie__type";

      elFilm.setAttribute("id", element.imdbID);
      elFilmImage.setAttribute("src", filmPosterLink);
      elFilmImage.setAttribute("alt", "Постер фильма или сериала");

      elFilmTitle.innerText = element.Title;
      elFilmYear.innerText = element.Year;
      elFilmType.innerText = element.Type;

      elFilm.appendChild(elFilmImage);
      elFilm.appendChild(elFilmDescription);
      elFilmDescription.appendChild(elFilmTitle);
      elFilmDescription.appendChild(elFilmYear);
      elFilmDescription.appendChild(elFilmType);

      billContainer.appendChild(elFilm);
   });*/

   return filmContainer;
};

const renderFilms = (filmsBill) => {
   if (filmsBill.length === 0) {
      filmsOutputNode.innerText = "Пока ничего не искали...";
      return;
   }

   filmsOutputNode.innerHTML = "";

   const filmsHtml = bildFilmsHtml(filmsBill);

   filmsOutputNode.appendChild(filmsHtml);
};

const renderFilm = (filmInfo) => {
   if (filmInfo.length === 0) {
      filmsOutputNode.innerText = "Данных о фильме нет";
      return;
   }

   filmsOutputNode.innerHTML = "";

   const filmHtml = bildFilmHtml(filmInfo);

   filmsOutputNode.appendChild(filmHtml);
};

const searchFilmsInApi = (name) => {
   const options = {
      method: "GET",
      headers: {
         "Accept-Encoding": "application/json",
      },
   };

   const queryParams = new URLSearchParams({
      s: name,
      apikey: apiOmdbKey,
   });

   fetch(`${apiOmdbLink}?${queryParams}`, options)
      .then((response) => {
         if (!response.ok) {
            filmErrorNode.textContent = `Ошибка загрузки из API: ${response.status}`;
            filmsOutputNode.textContent = "";
            filmSearchButton.disabled = false;
         }
         return response.json();
      })

      .then((data) => {
         films = data.Search;
         saveFilmsToLocalStorage();
         renderFilms(films);
         filmSearchButton.disabled = false;
      })

      .catch((error) => {
         filmErrorNode.textContent = `Нет такого фильма`; //?Ошибка API: ${error}
         filmsOutputNode.textContent = "";
         filmSearchButton.disabled = false;
      });
};

const searchFilmInApiById = (id) => {
   const options = {
      method: "GET",
      headers: {
         "Accept-Encoding": "application/json",
      },
   };

   const queryParams = new URLSearchParams({
      i: id,
      apikey: apiOmdbKey,
   });

   fetch(`${apiOmdbLink}?${queryParams}`, options)
      .then((response) => {
         if (!response.ok) {
            filmErrorNode.textContent = `Ошибка загрузки из API: ${response.status}`;
            filmsOutputNode.textContent = "";
         }
         return response.json();
      })

      .then((data) => {
         film = data;
         renderFilm(film);
      })

      .catch((error) => {
         filmErrorNode.textContent = `Нет такого фильма`; //?Ошибка API: ${error}
         filmsOutputNode.textContent = "";
      });
};

const getTranslation = async (nameFilmToTranslate) => {
   const options = {
      method: "GET",
      headers: {
         //"Accept-Encoding": "application/json",
         "X-RapidAPI-Key": apiTranslateKey,
         "X-RapidAPI-Host":
            "translated-mymemory---translation-memory.p.rapidapi.com",
      },
   };

   const queryParams = new URLSearchParams({
      langpair: "ru|en",
      q: nameFilmToTranslate,
   });

   try {
      const response = await fetch(
         `${apiTranslateLink}?${queryParams}`,
         options
      );

      if (!response.ok) {
         //console.log(`${textToTranslate} Ошибка загрузки перевода из API: ${response.status}`);
         return nameFilmToTranslate;
      }

      const result = await response.json();
      const translatedNameFilm = result.matches[0].translation;
      //console.log(`${textToTranslate} перевод ${translatedText}`);
      return translatedNameFilm;
   } catch (error) {
      //console.log(`${textToTranslate} Ошибка API перевода: ${error}`);
      return nameFilmToTranslate;
   }
};

const searchFilmsInApiWithTranslate = async (filmName) => {
   const filmNameAfterTranslation = await getTranslation(filmName);
   searchFilmsInApi(filmNameAfterTranslation);
};

const clearFilmNode = () => (filmNameNode.value = "");

const validationFilmNameFromUser = () => {
   const filmFromUser = filmNameNode.value;
   const lengthFilmFromUser = filmFromUser.length;
   const filmFromUserWithoutSpace = filmFromUser.replace(
      REG_SPACES_PUNСTUATION_MARKS,
      ""
   );
   const lengthFilmFromUserWithoutSpace = filmFromUserWithoutSpace.length;

   if (!filmFromUser || lengthFilmFromUserWithoutSpace == 0) {
      filmErrorNode.textContent = "Введите название фильма";
      clearFilmNode();
      filmNameNode.focus();
      return true;
   }

   if (lengthFilmFromUser > LIMIT_LENGTH_FILM_NAME) {
      filmErrorNode.textContent = `Не бывает фильмов длинее 130 символов (${lengthFilmFromUser}/${LIMIT_LENGTH_FILM_NAME})`;
      filmNameNode.focus();
      return true;
   }

   filmErrorNode.textContent = "";
   return false;
};

const preload = () => {
   filmsOutputNode.innerHTML = "";
   const loading = document.createElement("div");
   loading.className = "animation-loading";
   loading.innerText = "Загрузка";
   filmsOutputNode.appendChild(loading);
};

const searchFilmHandler = () => {
   if (validationFilmNameFromUser()) return;

   filmSearchButton.disabled = true;

   preload();

   const filmNameFromUser = filmNameNode.value;
   searchFilmsInApiWithTranslate(filmNameFromUser);

   clearFilmNode();
};

const searchFilmByEnter = (event) => {
   if (event.keyCode === 13) {
      event.preventDefault();
      searchFilmHandler();
   }
};

const showFilm = (event) => {
   let idFilmItem;

   if (event.target.classList.contains("movies__list-item")) {
      idFilmItem = event.target.id;
   } else if (event.target.closest(".movies__list-item")) {
      idFilmItem = event.target.closest(".movies__list-item").id;
   }

   searchFilmInApiById(idFilmItem);
};

const init = () => {
   getFilmsFromLocalStorage();
   const movies = getFilms();
   renderFilms(movies);
   filmNameNode.focus();
};
init();

filmSearchButton.addEventListener("click", searchFilmHandler);
filmNameNode.addEventListener("keydown", searchFilmByEnter);
filmsOutputNode.addEventListener("click", showFilm);

//?----------------------- ДРУГИЕ ВАРИАНТЫ КОДА -----------------------

//! вариант с заменой fetch + then на async + fetch
/*async function searchFilmInApi(name) {
   const options = {
      method: "GET",
      headers: {
         "Accept-Encoding": "application/json",
      },
   };

   const queryParams = new URLSearchParams({
      s: name,
      apikey: apiOmdbKey,
   });

   try {
      const response = await fetch(`${apiOmdbLink}?${queryParams}`, options);

      if (!response.ok) {
         filmErrorNode.textContent = `Ошибка загрузки из API: ${response.status}`;
         return;
      }

      const result = await response.json();

      console.log(result);

      await Promise.all(
         //!замена forEach на map + Promise.all
         result.Search.map(async (element) => {
            const filmImdbId = element.imdbID;
            let filmPosterLink =
               element.Poster === "N/A"
                  ? IMAGE_TO_FILM_WITHOUT_POSTER
                  : element.Poster;

            const filmTitle = element.Title;
            const filmYear = element.Year;
            const filmType = element.Type;

            const film = new FilmBanner(
               filmImdbId,
               filmPosterLink,
               filmTitle,
               filmYear,
               filmType
            );

            addFilmToBill(film);
         })
      );

      renderFilms();
   } catch (error) {
      filmErrorNode.textContent = `Нет такого фильма`; //?Ошибка API: ${error}
   }
}

//!замена async + try на fetch
const searchFilmInApiWithTranslate = (textToTranslate) => {
   const options = {
      method: "GET",
      headers: {
         //"Accept-Encoding": "application/json",
         "X-RapidAPI-Key": apiTranslateKey,
         "X-RapidAPI-Host":
            "translated-mymemory---translation-memory.p.rapidapi.com",
      },
   };

   const queryParams = new URLSearchParams({
      langpair: "ru|en",
      q: textToTranslate,
   });

   return fetch(`${apiTranslateLink}?${queryParams}`, options)
      .then((response) => {
         if (!response.ok) {
            //console.log(`${textToTranslate} Ошибка загрузки перевода из API: ${response.status}`);
            searchFilmInApi(textToTranslate);
         }
         return response.json();
      })
      .then((result) => {
         const translatedText = result.matches[0].translation;
         //console.log(`${textToTranslate} перевод ${translatedText}`);
         searchFilmInApi(translatedText);
      })
      .catch((error) => {
         //console.log(`${textToTranslate} Ошибка API перевода: ${error}`);
         searchFilmInApi(textToTranslate);
      });
};

//!Валидация url на 404 не работает из-за cors
/*const validationUrl = async (url, forNotFound) => {
   try {
      const response = await fetch(url, { mode: "no-cors" });

      if (!response.ok) {
         console.log(forNotFound);
         return forNotFound;
      }

      console.log(url);
      return url;
   } catch (error) {
      console.log(error);
      return forNotFound;
   }
};

validationUrl(
   "https://m.media-amazon.com/images/M/MV5BMTQ2ODA5MTI5Nl5BMl5BanBnXkFtZTcwNTAzMjAyMQ@@._V1_SX300.jpg",
   IMAGE_TO_FILM_WITHOUT_POSTER
);*/

//?Старые версии кода
/*function FilmBanner(id, img, title, year, type) {
   this.id = id;
   this.img = img;
   this.title = title;
   this.year = year;
   this.type = type;
}

const addFilmToBill = (films) => films.push(films);

const bildFilmsArray = (database) => {
   database.forEach((element) => {
      const filmImdbId = element.imdbID;
      let filmPosterLink =
         element.Poster === "N/A"
            ? IMAGE_TO_FILM_WITHOUT_POSTER
            : element.Poster;

      const filmTitle = element.Title;
      const filmYear = element.Year;
      const filmType = element.Type;

      const film = new FilmBanner(
         filmImdbId,
         filmPosterLink,
         filmTitle,
         filmYear,
         filmType
      );

      addFilmToBill(film);
   });
};*/
