const express = require('express');
const Sala = require('../models/sala_reunion_model');
const ruta = express.Router();
const Joi = require('joi');

const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const db = require('../db');

passport.use(new Strategy(
    function(token, cb) {
      db.users.findByToken(token, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        return cb(null, user);
      });
    }));


ruta.get('/',passport.authenticate('bearer', { session: false }),(req,res) => {
    let resultado = listarReservaActivos();
    resultado.then(salas => {
        res.json(salas);
    }).catch(err => {
        res.status(400).json( err);
    })
});

ruta.get('/:id',passport.authenticate('bearer', { session: false }),(req,res) => {
    let resultado = listarReservaActivosId(req.params.id);
    resultado.then(salas => {
        res.json(salas);
    }).catch(err => {
        res.status(400).json(err );
    })
});

ruta.post('/',passport.authenticate('bearer', { session: false }),(req,res) => {

    const {error, value} = validarUsuario(req.body);

    if(!error){
        let resultado = crearReservaSala(req.body);

        resultado.then(sala => {
            res.json({
                sala
            })
        }).catch(err => {
            res.status(400).json(err)
        })       
     }else{
        const mensage = error.details[0].message;

        res.status(400).send(mensage);
    }

    
});

ruta.delete('/:id',passport.authenticate('bearer', { session: false }),(req,res) => {
    console.log(req.params.id);
    let resultado = desactivarReserva(req.params.id);
    
    resultado.then(salas => {
        res.json(salas);
    }).catch(err => {
        res.status(400).json(err);
    })
});

ruta.put('/:id',passport.authenticate('bearer', { session: false }),(req,res)=>{

    const {error, value} = validarUsuario(req.body);

    if(!error){
        let resultado = actualizarReserva(req.params.id, req.body);

        resultado.then(sala => {
            res.json(sala)
        }).catch(err => {
            res.status(400).json(err)
        })
    }else{
        const mensage = error.details[0].message;

        res.status(400).send(mensage);
    }
});

async function listarReservaActivos(){
    let sala = await Sala.find({"activo":true});
    return sala;
}

async function listarReservaActivosId(id){
    let sala = await Sala.find({"_id":id,"activo":true});
    return sala;
}

async function crearReservaSala(body) {
    let sala = new Sala({
        usuario : body.usuario,
        depenencia : body.depenencia,
        fecha_inicio: body.fecha_inicio,
        fecha_fin: body.fecha_fin,
        comentario: body.comentario,
    });

    return await sala.save();
}

async function actualizarReserva(id, body){
    let sala = await Sala.findByIdAndUpdate(id,{
        $set: {
        usuario : body.usuario,
        depenencia : body.depenencia,
        fecha_inicio: body.fecha_inicio,
        fecha_fin: body.fecha_fin,
        comentario: body.comentario,
        }
    },{new: true});

    return sala;

}


async function desactivarReserva(id){
    let sala = await Sala.findByIdAndUpdate(id,{
        $set: {
            activo: false
        }
    },{new: true});

    return sala;
}

function validarRegistroSala(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
        depenencia: Joi.string().required(),
        fecha_inicio : Joi.string().required().date(),
        fecha_fin : Joi.string().required().date(),
    });
    return (schema.validate({ nombre: nom }));
}

module.exports = ruta;