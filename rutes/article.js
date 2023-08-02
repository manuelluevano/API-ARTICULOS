const express = require("express");
const multer = require('multer');
const ArticleController = require("../controllers/articleController");

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb)=>{
        //Indicar donde es el destino de subida de archivo
        cb(null, './imagenes/articulos/')
    },
    filename: (res, file, cb)=>{
        cb(null, "articulo" + Date.now() + file.originalname)
    }
})

const subidas = multer({storage: almacenamiento})


//Rutas

router.get("/prueba", ArticleController.prueba);
router.post("/crear", ArticleController.crear);

router.get("/articulos/:ultimos?", ArticleController.listar);
router.get("/articulo/:id", ArticleController.uno);
router.delete("/articulo/:id", ArticleController.borrar);
router.put("/articulo/:id", ArticleController.editar);

//Agregamos el middleware de subidas (multer), antes del controlador
router.post("/subir-imagen/:id",[subidas.single("file0")], ArticleController.subir);
router.get("/imagen/:fichero", ArticleController.imagen);

router.get("/buscar/:busqueda", ArticleController.buscador);

module.exports = router;
