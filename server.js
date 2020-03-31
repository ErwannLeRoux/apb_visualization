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
       documents = await Document.find({ "fields.dep" :"27"})

    });

    let router = express.Router();

    let app = express()

    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(bodyParser.json())

    app.set('view engine', 'ejs')

    app.use('/assets', express.static('public'))

    // app routing
    router.get('/', (request, response) => {

        response.render("index")
    });


    // app routing
    router.get('/', (request, response) => {

        response.render("index")
    });


    router.get('/department/:dep_id', (request, response) => {
        const id = request.params.id;
        console.log(id)
        response.render("departments")
    });

    router.get('/department_data', async (request, response) => {
        let results = await Document.find()
        let depMap = new Map()

        results.forEach((item) => {
            let acc = parseInt(item.fields.capa_fin)
            if(acc) {
                let exists = depMap.has(item.fields.dep)
                if(!exists) {
                    depMap.set(item.fields.dep, acc);
                } else {
                    depMap.set(item.fields.dep, acc + depMap.get(item.fields.dep));
                }
            }
        });

        let objs = []
        depMap.forEach(function(value, key){
            obj = {}
            key < 10 ? key = "0"+key : key = key
            obj.dep = key
            obj.value = value
            objs.push(obj)
        });
        response.send({result: objs})
    });

    app.use('/', router)

    app.listen(8080)
}

main()
