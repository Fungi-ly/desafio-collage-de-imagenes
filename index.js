
const express = require('express');
const app = express();
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs')
const PORT = 3000;
// Servidor inicializado en puerto 3000
app.listen(PORT, () => console.log(`Servidor inicializado en puerto ${PORT}`))


app.use(expressFileUpload({
    limits: { fileSize: 5000000 }, 
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo que deseas subir intensa subir, supera el limite permitido',
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
})

app.post('/imagen', (req, res) => {
    console.log(req.body)
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/img/imagen-${posicion}.jpg`, (err) => {
        res.redirect('/collage');
    });
});


app.get("/collage", (req, res) => {
    res.sendFile(__dirname + '/collage.html')

})

app.delete("/imagen/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imagenes/${nombre}.jpg`, (err) => {
        res.send(`Imagen ${nombre} fue eliminada con éxito`);
    });
});

app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/img/${nombre}`, (err) => {
        res.redirect("/collage")
    });
});


app.get('*', (req, res) => {
    res.send(`<br><center><h1>Pagina no encontrada 404</h1></center>`)
})
