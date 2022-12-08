import * as model from './model';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import getSearchResultsPage from './model';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODEL_CLOSE_SEC } from './config';

// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////////////

//Subscriber
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // 1) Render spinner
    recipeView.renderSpinner();

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering Recipe
     
    recipeView.render(model.state.recipe);

    // 4) Update resultsView and bookmarkView
    resultsView.render(model.getSearchResultsPage());
    bookmarksView.render(model.state.bookmarks)

   


  } catch (error) {
    console.error(`${error} !!!!!!`);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();

    if (!query) return;

    //2. Render spinner in Results View
    resultsView.renderSpinner();

    //3. Load search results
    await model.loadSearchResults(query);

    //4. Render results
    resultsView.render(model.getSearchResultsPage());

    //5. Render pegination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {

  //1. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  //2. Render new pagination buttons
  paginationView.render(model.state.search)
};

const controlServings = function(newServings){
  // Update the recipe servings(in model.state)
model.updateServings(newServings)

  //Update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function(){
  //1) Add bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id)

  //2) Update recipe view
  recipeView.render(model.state.recipe)

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function(newRecipe){
  try {
    //Show loading spinner
    addRecipeView.renderSpinner()

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe )

    //Success message
    addRecipeView.renderMessage();

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}` );

    //Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow()   
    }, MODEL_CLOSE_SEC * 1000);

    //Render bookmark
    bookmarksView.render(model.state.bookmarks)
    
  } catch (error) {
    addRecipeView.renderError(error.message)
  }
};


(function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();


