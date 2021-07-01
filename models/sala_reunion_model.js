const mongoose = require('mongoose');

const salaSchema = new mongoose.Schema({
    usuario: {
        type:String, 
        required:false
    },
    depenencia:{
        type:String, 
        required:false
    },
    fecha_inicio: {
        type:Date, 
        required:false
    },
    fecha_fin: {
        type:Date, 
        required:false
    },
    comentario: {
        type:String, 
        required:false
    },
    created:{
        type:Date, 
        default: Date.now
    },
    activo: {
        type:Boolean, 
        default:true
    },
});

module.exports = mongoose.model('Sala', salaSchema);
