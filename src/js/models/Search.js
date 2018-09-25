import axios from 'axios';
import * as cfg from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`${cfg.apiUrl}search?key=${cfg.key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch (error) {
            console.log(error);
            alert(cfg.errorMessage());
        }
    }
}