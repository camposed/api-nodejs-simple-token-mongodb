//importando las rutas
const usuarios = require('./routes/usuarios');
const sala = require('./routes/sala');

//impotando express y mongoose
const express = require('express');
const mongoose = require('mongoose');

//Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/sala_reuniones', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=> console.log('Connectado a MongoDB'))
        .catch(()=> console.log('No se pudo conectar con MongoDB', err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('static'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
  });

app.use('/api/sala', sala);

const port = process.env.PORT || 3001;

app.listen(port,() =>{
    console.log("Api para reserva de sala de reuniones.")
})