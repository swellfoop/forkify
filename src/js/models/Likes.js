import { persistData as write, readStorage as read } from '../views/base';

export default class Likes {
    constructor() {
        this.likes = [];
    };

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    };

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    };

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    };

    getNumberOfLikes() {
        return this.likes.length;
    };

    persistData() {
        write('likes', this.likes);
    };

    readStorage() {
        this.likes = read('likes');
    }
}