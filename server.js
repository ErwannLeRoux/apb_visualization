const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Document = require('./models/document.js')

async function main() {
    let db = mongoose.connection;
    let documents = []
    let mapObjs = []
    let allDocumentsCache = []

    mongoose.connect('mongodb://127.0.0.1:27017/apb', {useNewUrlParser: true, useUnifiedTopology: true});

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', async function() {
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

        depMap.forEach(function(value, key){
            obj = {}
            key < 10 ? key = "0"+key : key = key
            obj.dep = key
            obj.value = value
            mapObjs.push(obj)
        });
        console.log("Map data loaded")
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
    router.get('/departments', (request, response) => {
        response.render("departments")
    });

    router.get('/formations', async (request, response) => {
        let formations = []
        if(allDocumentsCache.length === 0) {
            formations = await Document.find({})
            allDocumentsCache = formations
        } else {
            formations = allDocumentsCache
            console.log("Loading from cache")
        }

        let filter = formations.filter((item)=>{
            return item.fields.session === "2017"
        })

        response.render("formations", {"datas" : filter, bool_dep: true})
    })

    router.get('/schools', async (request, response) => {
        let datas = await Document.aggregate(
            [{
                "$group": {
                    "_id": {
                        cod_uai : "$fields.cod_uai",
                        name : "$fields.g_ea_lib_vx",
                        lib_dep : "$fields.lib_dep",
                        lib_reg : "$fields.lib_reg",
                        dep : "$fields.dep",
                        annee : "$fields.session",
                    }
                }
            }]
        );


        let filter = datas.filter((item)=>{
            return item._id.annee === "2017"
        })

        response.render("schools", {"datas" : filter, bool_dep: false})
    });

    router.get('/formation_data/:recordId', async (request, response) => {
        let recordId = request.params.recordId;
        let formation = await Document.find({"recordid": recordId, "fields.session" : "2017"})

        response.send({result: formation[0]})
    });

    router.get('/departments/:dep_id', async (request, response) => {
        const id = request.params.dep_id;
        let datas = await Document.aggregate(
            [{
                "$group": {
                    "_id": {
                        cod_uai : "$fields.cod_uai",
                        name : "$fields.g_ea_lib_vx",
                        lib_dep : "$fields.lib_dep",
                        lib_reg : "$fields.lib_reg",
                        dep : "$fields.dep",
                        annee : "$fields.session",
                    }
                }
            }]
        );


        let filter = datas.filter((item)=>{
            return item._id.annee === "2017" && item._id.dep === id
        })

        response.render("schools", {"datas" : filter, bool_dep: true})
    });

    router.get('/schools/:uai', async (request, response) => {
       let  code_uai = request.params.uai;
       let formations = await Document.find({"fields.cod_uai":code_uai, "fields.session" : "2017"})
       let total_cap = 0
       let formations_cap = []
       formations.forEach((formation)=>{
           let cap = formation.fields.capa_fin
           if(cap != "inconnu" ){
               total_cap += parseInt(cap)
               formations_cap[formation.recordid] = parseInt(cap)
           }else{
               formations_cap[formation.recordid] = cap
           }
       });
       response.render("school", {"formations" : formations, "total_cap": total_cap, "formations_cap": formations_cap})
   });

    router.get('/schools/:uai/:recordid', async (request, response) => {
        let code_uai = request.params.uai;
        let recordId = request.params.recordid

        let formation2017 = await Document.find({ "recordid": recordId })
        let formation_lib = formation2017[0].fields.fil_lib_voe_acc
        let formation2016 = await Document.find({"fields.cod_uai":code_uai, "fields.session" : "2016", "fields.fil_lib_voe_acc" : formation_lib})

        response.render("formation", {"formation2016" : formation2016[0], "formation2017": formation2017[0]})
    });

    router.get('/department_data', async (request, response) => {
        response.send({result: mapObjs})
    });

    app.use('/', router)

    app.listen(8080)
}

main()
