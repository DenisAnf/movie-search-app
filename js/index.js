const filmNameNode = document.getElementById("filmName");
const filmSearchButton = document.getElementById("filmSearchButton");
const filmErrorNode = document.getElementById("filmError");
const filmsOutputNode = document.getElementById("movies");

const IMAGE_TO_FILM_WITHOUT_POSTER = "./resourses/img/searchMovie.webp";
const LIMIT_LENGTH_FILM_NAME = 130;
const REG_SPACES_PUNСTUATION_MARKS = /[ \t\r\n\p{P}\s]/gu;
//const STORAGE_LABEL_MOVIES = "movies";

let films = [];

const apiOmdbLink = "//www.omdbapi.com/";
const apiKey = "e47d08b8";

function FilmBanner(id, img, title, year, type) {
   this.id = id;
   this.img = img;
   this.title = title;
   this.year = year;
   this.type = type;
}

const addFilmToBill = (film) => films.push(film);

const getFilms = () => films;

const renderFilms = () => {
   filmsOutputNode.innerHTML = "";

   const billContainer = document.createElement("ul");
   billContainer.className = "movies__list";

   const bill = getFilms();
   bill.forEach((element) => {
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

      elFilm.setAttribute("id", element.id);
      elFilmImage.setAttribute("src", element.img);
      elFilmImage.setAttribute("alt", "Постер фильма или сериала");

      elFilmTitle.innerText = element.title;
      elFilmYear.innerText = element.year;
      elFilmType.innerText = element.type;

      elFilm.appendChild(elFilmImage);
      elFilm.appendChild(elFilmDescription);
      elFilmDescription.appendChild(elFilmTitle);
      elFilmDescription.appendChild(elFilmYear);
      elFilmDescription.appendChild(elFilmType);

      billContainer.appendChild(elFilm);
   });

   filmsOutputNode.appendChild(billContainer);
};

const searchFilmInApi = (name) => {
   const options = {
      method: "GET",
      headers: {
         "Accept-Encoding": "application/json",
      },
   };

   const queryParams = new URLSearchParams({
      s: name,
      apikey: apiKey,
   });

   fetch(`${apiOmdbLink}?${queryParams}`, options)
      .then((response) => {
         if (!response.ok) {
            filmErrorNode.textContent = `Ошибка загрузки из API: ${response.status}`;
         }
         return response.json();
      })

      .then((data) => {
         data.Search.forEach((element) => {
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
         renderFilms();
      })

      .catch((error) => {
         filmErrorNode.textContent = `Нет такого фильма`; //?Ошибка API: ${error}
      });
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

const searchFilmHandler = () => {
   if (validationFilmNameFromUser()) return;

   films = [];
   filmErrorNode.textContent = "";

   const filmFromUser = filmNameNode.value;

   searchFilmInApi(filmFromUser);
   clearFilmNode();
};

const searchFilmByEnter = (event) => {
   if (event.keyCode === 13) {
      event.preventDefault();
      searchFilmHandler();
      filmNameNode.focus();
   }
};

const init = () => {
   //getFilmsFromLocalStorage();
   //renderFilms();
   filmNameNode.focus();
};
init();

//saveFilmsToLocalStorage();

//?СТАРОЕ
/*const saveFilmsToLocalStorage = () => {
   const filmsString = JSON.stringify(films);
   localStorage.setItem(STORAGE_LABEL_MOVIES, filmsString);
};

const getFilmsFromLocalStorage = () => {
   const filmsFromLocalStorageString =
      localStorage.getItem(STORAGE_LABEL_MOVIES);
   const filmsFromLocalStorage = JSON.parse(filmsFromLocalStorageString);

   if (Array.isArray(filmsFromLocalStorage)) {
      films = filmsFromLocalStorage;
   }
};*/

filmSearchButton.addEventListener("click", searchFilmHandler);
filmNameNode.addEventListener("keydown", searchFilmByEnter);

//! вариант с замена fetch + then на async + fetch
/*async function searchFilmInApi(name) {
   const options = {
      method: "GET",
      headers: {
         "Accept-Encoding": "application/json",
      },
   };

   const queryParams = new URLSearchParams({
      s: name,
      apikey: apiKey,
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
      filmErrorNode.textContent = `Ошибка API: ${error}`;
   }
}*/

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
