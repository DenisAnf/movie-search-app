const filmNameNode = document.getElementById("filmName");
const filmSearchButton = document.getElementById("filmSearchButton");
const filmErrorNode = document.getElementById("filmError");
const filmsOutputNode = document.getElementById("movies");

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

//!замена fetch + then
async function searchFilmInApi(name) {
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

      await Promise.all(
         //!замена forEach без Promise.all
         result.Search.map(async (element) => {
            const filmImdbId = element.imdbID;
            const filmPosterLink = element.Poster;
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
}

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

      await Promise.all(
         //!вариант с заменой forEach на map + Promise.all
         result.Search.map(async (element) => {
            const filmImdbId = element.imdbID;
            const filmPosterLink = element.Poster;
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

const clearFilmNode = () => (filmNameNode.value = "");

const searchFilmHandler = () => {
   const filmFromUser = filmNameNode.value;

   searchFilmInApi(filmFromUser);
   clearFilmNode();
};

filmSearchButton.addEventListener("click", searchFilmHandler);

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

/*
const getFilmFromUser = () => {
   const filmFromUser = filmNameNode.value;

   const film = new Film(filmFromUser);
   return film;
};*/

/*const validationFilmNameFromUser = () => {
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

const addMovieHandler = () => {
   if (validationFilmNameFromUser()) return;

   const movie = getFilmFromUser();

   addFilmTobill(movie);
   saveFilmsToLocalStorage();
   renderFilms();
   clearFilmNode();
};

const addMovieByEnter = (event) => {
   if (event.keyCode === 13) {
      event.preventDefault();
      addMovieHandler();
      filmNameNode.focus();
   }
};

const init = () => {
   getFilmsFromLocalStorage();
   renderFilms();
   filmNameNode.focus();
};
init();

filmAddButton.addEventListener("click", addMovieHandler);
filmNameNode.addEventListener("keydown", addMovieByEnter);*/
