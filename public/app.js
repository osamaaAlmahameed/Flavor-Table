const ingredientInput = document.getElementById('ingredientInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const resultsSection = document.getElementById('results');
const detailsSection = document.getElementById('details');

searchBtn.addEventListener('click', function () {
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) {
    alert('Please enter some ingredients');
    return;
  }
  fetchRecipes(ingredients);
});

randomBtn.addEventListener('click', function () {
  fetchRandomRecipe();
});

function fetchRecipes(ingredients) {
  detailsSection.innerHTML = '';
  resultsSection.innerHTML = 'Loading...';

  fetch('/recipes/search?ingredients=' + encodeURIComponent(ingredients))
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.error) {
        resultsSection.innerHTML = '<p>Error: ' + data.error + '</p>';
        return;
      }
      displayRecipes(data);
    })
    .catch(function () {
      resultsSection.innerHTML = '<p>Failed to fetch recipes.</p>';
    });
}

function displayRecipes(recipes) {
  resultsSection.innerHTML = '';
  if (recipes.length === 0) {
    resultsSection.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  recipes.forEach(function (recipe) {
    var card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML =
      '<img src="' + recipe.image + '" alt="' + recipe.title + '" />' +
      '<h3>' + recipe.title + '</h3>' +
      '<p>Used: ' + recipe.usedIngredients.join(', ') + '</p>' +
      '<p>Missed: ' + recipe.missedIngredients.join(', ') + '</p>' +
      '<button class="add-fav-btn">Add to Favorites</button>';

    card.querySelector('.add-fav-btn').addEventListener('click', function () {
      addToFavorites(recipe);
    });

    card.addEventListener('click', function (e) {
      // prevent click if the button was clicked
      if (e.target.classList.contains('add-fav-btn')) return;
      fetchRecipeDetails(recipe.id);
    });

    resultsSection.appendChild(card);
  });
}

function fetchRecipeDetails(id) {
  detailsSection.innerHTML = 'Loading details...';
  fetch('/recipes/' + id)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.error) {
        detailsSection.innerHTML = '<p>Error: ' + data.error + '</p>';
        return;
      }
      displayRecipeDetails(data);
    })
    .catch(function () {
      detailsSection.innerHTML = '<p>Failed to load recipe details.</p>';
    });
}

function displayRecipeDetails(recipe) {
  detailsSection.innerHTML =
    '<h2>' + recipe.title + '</h2>' +
    '<img src="' + recipe.image + '" alt="' + recipe.title + '" style="max-width:100%; border-radius:8px;" />' +
    '<p><strong>Ready in:</strong> ' + recipe.readyInMinutes + ' minutes</p>' +
    '<div>' + recipe.summary + '</div>';
}

function fetchRandomRecipe() {
  detailsSection.innerHTML = '';
  resultsSection.innerHTML = 'Loading random recipe...';

  fetch('/recipes/random')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.error) {
        resultsSection.innerHTML = '<p>Error: ' + data.error + '</p>';
        return;
      }
      var recipe = data.recipes && data.recipes[0];
      if (!recipe) {
        resultsSection.innerHTML = '<p>No recipe found.</p>';
        return;
      }
      resultsSection.innerHTML = '';
      displayRecipeDetails(recipe);
    })
    .catch(function () {
      resultsSection.innerHTML = '<p>Failed to fetch random recipe.</p>';
    });
}

function addToFavorites(recipe) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const exists = favorites.some(fav => fav.id === recipe.id);
  if (exists) {
    alert("Already in favorites");
    return;
  }

  favorites.push({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image
  });

  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Added to favorites!");
}
