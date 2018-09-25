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

    parseIngredients() {

        const units = [
            ['tbsp', ['tablespoons', 'tablespoon']],
            ['tsp', ['teaspoons', 'teaspoon']],
            ['oz', ['ounces', 'ounce']],
            ['lb', ['pounds', 'pound', 'lbs']],
            ['cup', ['cups']],
            ['kg', ['kilograms', 'kilogram']],
            ['g', ['grams', 'gram']]            
        ];

        const newIngredients = this.ingredients.map(el => {
            // Uniform units
            let ingredient = el.toLowerCase();
            units.forEach((unitArray) => {
                unitArray[1].forEach((unit) => {
                    ingredient = ingredient.replace(unit, unitArray[0]);
                });
            });

            // Remove anything in parentheses and trim extra spaces
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ').trim();

            // Parse ingredients into count, unit, and ingredient
            const ingredientArray = ingredient.split(' ');
            // Helper function to loop through a multidimensional array
            const exists = src => units.some(row => row.includes(src)); 
            const unitIndex = ingredientArray.findIndex(el2 => exists(el2));

            let ingredientObject;
            if (unitIndex > -1) {
                // There is a unit
                const countArray = ingredientArray.slice(0, unitIndex); // eg. 4 1/2 cups => [4, 1/2]
                let count;
                if (countArray.length === 1) {
                    count = eval(ingredientArray[0].replace('-', '+'));
                } else {
                    count = eval(ingredientArray.slice(0, unitIndex).join('+'));    // eval('4+1/2') = 4.5
                };
                ingredientObject = {
                    count,
                    unit: ingredientArray[unitIndex],
                    ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(ingredientArray[0], 10)) {
                // There is no unit, but the first element is a number
                ingredientObject = {
                    count: parseInt(ingredientArray[0], 10),
                    unit: '',
                    ingredient: ingredientArray.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is no unit and no number in the first position
                ingredientObject = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            };
            return ingredientObject;
        });

        this.ingredients = newIngredients;
    }
}