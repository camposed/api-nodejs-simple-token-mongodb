const express = require('express');
const Sala = require('../models/sala_reunion_model');
const ruta = express.Router();
const Joi = require('joi')
    .extend(require('@joi/date'));

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
    console.log(req.body);
    if(req.body.fecha_inicio > req.body.fecha_fin){
        res.status(404).send('La fecha de inicio no puede ser mayor a la de final');
        return;        
    }

    const {error, value} = validarRegistroSala(req.body);

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

    let resultado = desactivarReserva(req.params.id);
    
    resultado.then(salas => {
        res.json(salas);
    }).catch(err => {
        res.status(400).json(err);
    })
});

ruta.put('/:id',passport.authenticate('bearer', { session: false }),(req,res)=>{

    if(req.body.fecha_inicio > req.body.fecha_fin){
        res.status(404).send('La fecha de inicio no puede ser mayor a la de final');
        return;        
    }

    const {error, value} = validarRegistroSala(req.body);

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
        solicita : body.solicita,
        depenencia : body.depenencia,
        fecha_inicio: body.fecha_inicio,
        fecha_fin: body.fecha_fin,
        hora_inicio: body.hora_inicio,
        hora_fin: body.hora_fin,
        comentario: body.comentario,
    });

    return await sala.save();
}

async function actualizarReserva(id, body){
    let sala = await Sala.findByIdAndUpdate(id,{
        $set: {
        solicita : body.solicita,
        depenencia : body.depenencia,
        fecha_inicio: body.fecha_inicio,
        fecha_fin: body.fecha_fin,
        hora_inicio: body.hora_inicio,
        hora_fin: body.hora_fin,        
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

function validarRegistroSala(body){
    const schema = Joi.object({
        solicita: Joi.string().min(3).required(),
        depenencia: Joi.string().min(3).required(),
        fecha_inicio : Joi.date().required().format('DD/MM/YYY').utc(),
        fecha_fin : Joi.date().required().format('DD/MM/YYYY').utc(),
        hora_inicio: Joi.string().required(),
        hora_fin : Joi.string().required(),
    });
    return (schema.validate({ solicita: body.solicita, 
                                depenencia: body.depenencia,
                                fecha_inicio: body.fecha_inicio,
                                fecha_fin: body.fecha_fin,
                                hora_inicio: body.hora_inicio,
                                hora_fin: body.hora_fin
                            }));
}


module.exports = ruta;