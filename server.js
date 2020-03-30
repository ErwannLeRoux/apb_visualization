const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Document = require('./models/document.js')

async function main() {
    let db = mongoose.connection;
    let documents = []

    mongoose.connect('mongodb://127.0.0.1:27017/apb', {useNewUrlParser: true, useUnifiedTopology: true});

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', async function() {
       documents = await Document.find({ "fields.capa_fin" :"Métiers du géomètre-topographe et de la modélisation numérique"})
    });

    let router = express.Router();

    let app = express()

    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(bodyParser.json())

    app.set('view engine', 'ejs')

    app.use('/assets', express.static('public'))

    // app routing
    router.get('/', (request, response) => {
        console.log(documents)
        response.render("index")
    });

    app.use('/', router)

    app.listen(8080)
}

main()
