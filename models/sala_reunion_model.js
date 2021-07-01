const mongoose = require('mongoose');
const moment = require('moment-timezone');
const sv_date = moment.tz(Date.now(), "America/El_Salvador");

const salaSchema = new mongoose.Schema({
    solicita: {
        type:String, 
        required:false
    },
    dependencia:{
        type:String, 
        required:false
    },
    fecha_inicio: {
        type:String, 
        required:false
    },
    fecha_fin: {
        type:String, 
        required:false
    },
    hora_inicio: {
        type:String, 
        required:false
    },
    hora_fin: {
        type:String, 
        required:false
    },    
    comentario: {
        type:String, 
        required:false
    },
    created:{type: Date, default: sv_date},
    activo: {
        type:Boolean, 
        default:true
    },
});

module.exports = mongoose.model('Sala', salaSchema);
