import axios from 'axios';
import * as cfg from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${cfg.apiUrl}get?key=${cfg.key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch (error) {
            console.log(error);
            alert(cfg.errorMessage);
        }
    }

    calcTime() {
        // Assuming that we need 15 minutes per 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}