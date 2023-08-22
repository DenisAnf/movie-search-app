const filmNameNode = document.querySelector('#filmName');
const filmAddButton = document.querySelector('#filmAddButton');
const filmErrorNode = document.querySelector('#filmError');
const filmsOutputNode = document.querySelector('#movies');

const LIMIT_LENGTH_FILM_NAME = 130;
const REG_SPACES_PUNСTUATION_MARKS = /[ \t\r\n\p{P}\s]/gu;
const STORAGE_LABEL_MOVIES = 'movies';

let films = [];

const saveFilmsToLocalStorage = () => {
	const filmsString = JSON.stringify(films);
	localStorage.setItem(STORAGE_LABEL_MOVIES, filmsString);
}

const getFilmsFromLocalStorage = () => {
	const filmsFromLocalStorageString = localStorage.getItem(STORAGE_LABEL_MOVIES);
	const filmsFromLocalStorage = JSON.parse(filmsFromLocalStorageString);

	if (Array.isArray(filmsFromLocalStorage)) {
		films = filmsFromLocalStorage;
		
	}
}

function Film(name) {
	this.name = name;
	this.check = 'unchecked';
};

const getFilmFromUser = () => {
	const filmFromUser = filmNameNode.value;
	
	const film = new Film(filmFromUser);
	return film;
};

const addFilmToCatalog = (film) => films.push(film);

const getfilms = () => films;

const renderFilms = () => {
	filmsOutputNode.innerHTML = '';

	const catalogContainer = document.createElement('ul');
	catalogContainer.className = 'movies__list';

	const catalog = getfilms();

	catalog.forEach((element, index) => {
		const catalogEl = document.createElement('li');
		const catalogElLabel = document.createElement('label');
		const catalogElCheckbox = document.createElement('input');
		const catalogElFakecheckbox = document.createElement('div');
		const catalogElTitle = document.createElement('span');
		const catalogElDeleteBtn = document.createElement('button');
		
		catalogEl.className = 'movies__list-item';
		catalogElLabel.className = 'movie';
		catalogElCheckbox.className = 'movie__checkbox';
		catalogElFakecheckbox.className = 'movie__fakecheckbox';
		catalogElTitle.className = 'movie__title';
		catalogElDeleteBtn.className = 'movie__deleteBtn';

		catalogEl.setAttribute('id', index);
		catalogElCheckbox.setAttribute('type', 'checkbox');
		catalogElCheckbox.setAttribute(element.check, '');
		catalogElDeleteBtn.setAttribute('id', index);

		catalogElTitle.innerText = element.name;

		catalogEl.appendChild(catalogElLabel);
		catalogElLabel.appendChild(catalogElCheckbox);
		catalogElLabel.appendChild(catalogElFakecheckbox);
		catalogElLabel.appendChild(catalogElTitle);
		catalogElLabel.appendChild(catalogElDeleteBtn);

		catalogContainer.appendChild(catalogEl);

		catalogElCheckbox.addEventListener('click', () => {
			if (element.check === 'unchecked') {
				element.check = 'checked';
			} else {
				element.check = 'unchecked';
			}
			saveFilmsToLocalStorage();
		});

		catalogElDeleteBtn.addEventListener('click', () => {
			films.splice(index, 1);
			saveFilmsToLocalStorage();
			renderFilms();
		});
	});

	filmsOutputNode.appendChild(catalogContainer);
};

const clearFilmNode = () => filmNameNode.value = '';

const validationFilmNameFromUser = () => {
	const filmFromUser = filmNameNode.value;
	const lengthFilmFromUser = filmFromUser.length;
	const filmFromUserWithoutSpace = filmFromUser.replace(REG_SPACES_PUNСTUATION_MARKS, '');
	const lengthFilmFromUserWithoutSpace = filmFromUserWithoutSpace.length;

	if (!filmFromUser || lengthFilmFromUserWithoutSpace == 0) {
		filmErrorNode.textContent = 'Введите название фильма';
		clearFilmNode();
		filmNameNode.focus();
		return true;
	};

	if (lengthFilmFromUser > LIMIT_LENGTH_FILM_NAME) {
		filmErrorNode.textContent = `Не бывает фильмов длинее 130 символов (${lengthFilmFromUser}/${LIMIT_LENGTH_FILM_NAME})`;
		filmNameNode.focus();
		return true;
	};

	filmErrorNode.textContent = '';
	return false;
};

const addMovieHandler = () => {
	if (validationFilmNameFromUser()) return;

	const movie = getFilmFromUser();

	addFilmToCatalog(movie);
	saveFilmsToLocalStorage();
	renderFilms();
	clearFilmNode();
};

const addMovieByEnter = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		addMovieHandler();
		filmNameNode.focus();
	};
};

const init = () => {
	getFilmsFromLocalStorage();
	renderFilms();
	filmNameNode.focus();
};
init();

filmAddButton.addEventListener('click', addMovieHandler);
filmNameNode.addEventListener('keydown', addMovieByEnter);













