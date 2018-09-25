import Search from './models/Search';
import Recipe from './models/Recipe';
import * as cfg from './config';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, elementStrings, renderLoader, clearLoader } from './views/base';

/*
Global state of the App:
- Search object
- Current recipe object
- Shopping list objects
- Liked recipes
*/
const state = {};

/**
    SEARCH CONTROLLER
**/
const controlSearch = async () => {

    // Get query from view
    const query = searchView.getInput();

    if (query) {
        // New Search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            // Search for recipes
            await state.search.getResults();

            // Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);  
        }
        catch (error) {
            console.log(error);
            alert(cfg.errorMessage('search'));
            clearLoader();
        }  
    }
}

elements.searchForm.addEventListener('submit', el => {
    el.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', el => {
    const button = el.target.closest(`.${elementStrings.inlineButton}`);
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    };
});

/**
    RECIPE CONTROLLER
**/
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        };

        // Create new recipe object
        state.recipe = new Recipe(id);
        
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // Calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }
        catch (error) {
            console.log(error);
            alert(cfg.errorMessage('recipe'));
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', el => {
    if (el.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        };
    } else if (el.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
    };
    recipeView.updateServingsIngredients(state.recipe);
})