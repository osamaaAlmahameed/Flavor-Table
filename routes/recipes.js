const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

router.get("/search", async (req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

  try {
    const response = await axios.get(`${BASE_URL}/findByIngredients`, {
      params: {
        apiKey: API_KEY,
        ingredients,
        number: 10,
      },
    });

    const results = response.data.map(item => ({
      title: item.title,
      image: item.image,
      usedIngredients: item.usedIngredients.map(i => i.name),
      missedIngredients: item.missedIngredients.map(i => i.name),
      id: item.id,
    }));

    res.json(results);
  } catch (error) {
    console.error("Error fetching recipes:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

router.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/random`, {
      params: {
        apiKey: API_KEY,
        number: 1,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching random recipe:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch random recipe" });
  }
});


module.exports = router;
