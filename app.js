const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MONGODB_URI = 'mongodb+srv://elmogdadhassan1991:4ETv63eYLQDPxRs@cluster0.arjxo.mongodb.net/to-do-list?retryWrites=true&w=majority&appName=Cluster0'

const app = express();

app.get('/' , (req, res, next) => {
    res.send('<h1>Hello</h1>')
})

// Database Cennection
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('conected');
    app.listen(3000)
}).catch(err => {
    console.log(err)
});
