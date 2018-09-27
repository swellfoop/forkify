import { elements } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};

export const deleteAll = () => {
    elements.shoppingList.innerHTML = '';
    deleteDeleteAllButton();
};

export const renderDeleteAllButton = () => {
    const markup = `
        <button class="shopping__delete-all btn-small">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
            Delete all
        </button>
    `;
    const exists = document.querySelector('.shopping__delete-all');
    if (!exists) elements.shoppingList.insertAdjacentHTML('afterend', markup);
}

export const deleteDeleteAllButton = () => {
    const item = document.querySelector('.shopping__delete-all');
    if (item) item.parentElement.removeChild(item);
}