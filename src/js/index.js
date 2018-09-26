import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as cfg from './config';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView.js';  // Accidentally initially made this file as a .txt and now JavaScript won't recognise it without the .js suffix
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
            searchView.highlightSelected(id, 'results__link');
            searchView.highlightSelected(id, 'likes__link');
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        }
        catch (error) {
            console.log(error);
            alert(cfg.errorMessage('recipe'));
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
    LIST CONTROLLER
**/

const controlList = () => {
    // Create a new list if one does not already exist
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and update DOM
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

// Handling delete and update list item events
elements.shoppingList.addEventListener('click', el => {
    const id = el.target.closest('.shopping__item').dataset.itemid;

    // handle delete button
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state and DOM
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (el.target.matches('.shopping__count-value')) {
        // Update count
        let val = parseFloat(el.target.value);
        const step = parseFloat(el.target.step);
        if (val < step) {
            el.target.value = step;
            val = step;
        };
        state.list.updateCount(id, val);
    };
});

/**
    LIKE CONTROLLER
**/
// TESTING -------------------------//
state.likes = new Likes();    //
likesView.toggleLikesMenu(0); //
// --------------------------------//
const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    };

    const currentID = state.recipe.id;
    
    if (!state.likes.isLiked(currentID)) {
        // User has not liked current recipe
        // Add like to data
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle like button
        likesView.toggleLikeButton(true);

        // Add like to DOM
        likesView.renderLike(newLike);

        // Highlight as current view
        searchView.highlightSelected(currentID, 'likes__link');
    } else {
        // User has liked current recipe
        // Remove like from data
        state.likes.deleteLike(currentID);
        // Toggle like button
        likesView.toggleLikeButton(false);

        // Remove like from DOM
        likesView.deleteLike(currentID);
    };
    likesView.toggleLikesMenu(state.likes.getNumberOfLikes());
};

// Handling recipe button clicks
elements.recipe.addEventListener('click', el => {
    if (el.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        };
    } else if (el.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button
        state.recipe.updateServings('inc');
    } else if (el.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (el.target.matches('.recipe__love, .recipe__love *')) {
        // Add to / remove from like list
        controlLike();
    };
    recipeView.updateServingsIngredients(state.recipe);
})