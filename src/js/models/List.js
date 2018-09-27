import uniqid from 'uniqid';
import { persistData as write, readStorage as read } from '../views/base';

export default class List {
    constructor() {
        this.items = [];
    };

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        this.persistData();
        return item;
    };

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
        this.persistData();
    };

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        this.persistData();
    };

    deleteAll() {
        this.items = [];
        this.persistData();
    };

    persistData() {
        write('list', this.items);
    };

    readStorage() {
        this.items = read('list');
    }
}