//importando las rutas
const sala = require('./routes/sala');

//impotando express y mongoose
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();


const USER = process.env.DB_USER;
const PASSWORD= process.env.DB_PASS;
const DATA_BASE= process.env.DB_DATANAME;

//Conectar a la base de datos
//mongoose.connect('mongodb://localhost:27017/sala_reuniones', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@cluster0.ocdqj.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=> console.log('Connectado a MongoDB'))
        .catch(()=> console.log('No se pudo conectar con MongoDB'));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('static'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
  });

app.use('/api/sala', sala);

const port = process.env.PORT || 3002;

app.listen(port,() =>{
    console.log("Api para reserva de sala de reuniones.")
})