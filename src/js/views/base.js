export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingSection: document.querySelector('.shopping'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader',
    inlineButton: 'btn-inline'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};

export const errorMessage = msg => {
    if (msg === 'key') {
        return 'You have likely exceeded your API calls for the day. Try changing the API key in config.js.'
    } else if (msg === 'search') {
        return 'An error occured during the search.'
    } else if (msg === 'recipe') {
        return 'Could not process this recipe :c'
    };
    return 'Oops! Something went wrong! D:';
};

export const persistData = (key, obj) => {
    localStorage.setItem(key, JSON.stringify(obj));
};

export const readStorage = key => {
    const storage = JSON.parse(localStorage.getItem(key));
    // If storage has a value then re-store data from localStorage
    if (storage) return storage;
};