import { elements } from './base';
import { truncateString } from './searchView';

export const toggleLikeButton = isLiked => {
    //icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikesMenu = numberOfLikes => {
    // Used custom CSS classes to allow for a fade effect rather than the menu popping in and out
    if (numberOfLikes > 0) {
        elements.likesMenu.classList.add('likes__field--active');
    } else {
        elements.likesMenu.classList.remove('likes__field--active');
    };
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${truncateString(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}