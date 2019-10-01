// imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Models Import
const Recipes = require('./models/Recipes');

// connection
mongoose.connect('mongodb+srv://recipeuser:Qb6PxvmYzZF1zTOr@cluster0-yajh5.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

// extracts the JSON object from the request
const bodyParser = require('body-parser');

// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Using body parser
app.use(bodyParser.json());

// post recipe
app.post('/api/recipes', (req, res, next) => {
    console.log(req.body);
    const recipes = new Recipes({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
    }).save().then(() => {
        res.status(201).json({
            message: 'Recipe created successfully!'
        });
    }).catch((error) => {
        res.status(400).json({
            error: error,
            message: 'Recipe failed to create'
        });
    });
});

// single recipe
app.get('/api/recipes/:id', (req, res, next) => {
    Recipes.findOne({
        _id: req.params.id
    }).then(
        (recipe) => {
            res.status(200).json(recipe);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

// update recipe
app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipes({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
    });
    Recipes.updateOne({
        _id: req.params.id
    }, recipe).then(() => {
        res.status(201).json({
            message: "Recipe Updated"
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
});

// delete recipe
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipes.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({
            message: "Recipe Deleted"
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
});

// fetch recipes
app.use('/api/recipes', (req, res, next) => {
    Recipes.find().then((recipes) => {
        res.status(200).json(recipes);
    }).catch((error) => {
        res.status(400).json({
            error: error,
            message: 'Failed to fetch recipes, try again'
        });
    });
});

module.exports = app;