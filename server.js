require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const homeRoute = require("./routes/home");
const recipeRoutes = require("./routes/recipes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRoute);
app.use("/recipes", recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
