const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id:"ObjectId",
    recordid : "String",
    fields: {
        p_acc_academies: "String",
        p_acc_term: "String",
        prop_tot_f: "String",
        capa_fin: "String",
        acc_academies: "String",
        p_acc_tres_bien: "String",
        session: "String",
        fili: "String",
        cod_uai: "String",
        acc_voe1_f: "String",
        p_acc_boursier: "String",
        fil_lib_voe_acc: "String",
        acad_mies: "String",
        p_acc_assez_bien: "String",
        form_lib_voe_acc: "String",
        lib_reg: "String",
        acc_term: "String",
        voe1: "String",
        p_acc_passable: "String",
        acc_tot_f: "String",
        acc_boursier: "String",
        voe_tot: "String",
        acc_term_f: "String",
        voe1_f: "String",
        p_acc_bien: "String",
        acc_passable: "String",
        lib_dep: "String",
        voe_tot_f: "String",
        dep: "String",
        acc_bien: "String",
        acc_voe1: "String",
        prop_tot: "String",
        acc_tot: "String",
        g_ea_lib_vx: "String",
        rang_der_max: "String",
        acc_tres_bien: "String",
        acc_assez_bien: "String"
    },
    record_timestamp: "String"
});

documentSchema.set('collection', 'data');

module.exports = mongoose.model('Document', documentSchema);
