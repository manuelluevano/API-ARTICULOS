const { validarArticulo } = require("../helper/validar");
const Article = require("../models/Article");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba",
  });
};

const crear = async (req, res) => {
  //Recoger  los parametros  por postt a guardar
  let parametros = req.body;

  //validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Faltan datos para enviar",
    });
  }
  //crear objeto a guardar
  const articulo = new Article(parametros);

  //Guardar el articulo en la base de datos
  articulo
    .save()
    .then((articuloGuardado) => {
      return res.status(200).json({
        //devolver resultado
        status: "success",
        Articulo: articuloGuardado,
        mensaje: "Articulo creado con exito",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        //devolver error
        status: "error",
        mensaje: "No se ha guardado el articulo: " + error.message,
      });
    });
};

const listar = async (req, res) => {
  //Consulta a DB
  try {
    // obtener todos los articulos
    let articulos = await Article.find({}).sort({
      fecha: 1,
    });

    if (req.params.ultimos) {
      articulos = await Article.find({}).limit(req.params.ultimos);
    }

    if (!articulos.length > 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }

    return res.status(200).send({
      status: "Success",
      parametro: req.params.ultimos,
      contador: articulos.length,
      articulos,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Error datos ",
    });
  }
};

const uno = async (req, res) => {
  //Recoger el id por la url
  const id = req.params.id;

  try {
    //Buscar el articulo
    const articulo = await Article.findById(id);

    //MOSTRAR EL ARTICULO
    return res.status(200).send({
      status: "Success",
      articulo,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje: "No se han encontrado el articulo",
    });
  }
};

const borrar = async (req, res) => {
  //Recoger el id por la url
  const id = req.params.id;

  try {
    //Eliminar el articulo
    const articulo = await Article.findOneAndDelete({ _id: id });

    //MOSTRAR EL ARTICULO
    return res.status(200).send({
      status: "Success",
      mensaje: "Articulo Eliminado Correctamente",
      articulo,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje: "No se han encontrado el articulo",
    });
  }
};

const editar = async (req, res) => {
  //recoger el id
  let id = req.params.id;

  //RECOGER DATOS DEL BODY
  let parametros = req.body;

  //VALIDAR DATOS
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Faltan datos para enviar",
    });
  }
  //BUSCAR Y ACTUALIZAR ARTICULO
  try {
    let articulo = await Article.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    //MOSTRAR EL ARTICULO
    return res.status(200).json({
      status: "Success",
      articulo: articulo,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Error",
      mensaje: "Faltan datos para enviar",
    });
  }
};

const subir = async (req, res) => {
  //Configurar Multer

  //Comprobar si existe un archivo
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "Error",
      mensaje: "Peticion Invalida",
    });
  }
  //Recoger el fichero del archivo

  //Nombre del archivo
  let archivo = req.file.originalname;

  //Extension del archivo
  let archivoSplit = archivo.split(".");
  let extension = archivoSplit[1];

  //Comprobrar extension correcta
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    //Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "Error",
        mensaje: "Imagen invalida",
      });
    });
  } else {
    //si todo va bien, actualizar el articulo
    //recoger el id
    let id = req.params.id;

    //BUSCAR Y ACTUALIZAR ARTICULO
    try {
      let articulo = await Article.findOneAndUpdate(
        { _id: id },
        { imagen: req.file.filename },
        req.body,
        {
          new: true,
        }
      );

      //MOSTRAR EL ARTICULO
      return res.status(200).json({
        status: "Success",
        articulo: articulo,
        fichero: req.file,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Error",
        mensaje: "Faltan datos para enviar",
      });
    }
  }
};

const imagen = async (req, res) => {
  let fichero = req.params.fichero;
  let rutaFisica = "./imagenes/articulos/" + fichero;

  fs.stat(rutaFisica, (err, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(rutaFisica));
    } else {
      return res.status(404).json({
        status: "Error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        rutaFisica,
      });
    }
  });
};

const buscador = async (req, res) => {
  try {
  //Sacar el string de busqueda
  let busqueda = req.params.busqueda;

  //Find OR // OR = SELECT * FROM
  articulos = await Article.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { contenido: { $regex: busqueda, $options: "i" } },
    ],
  }).sort({fecha: -1}) //Orden

  if (!articulos.length > 0) {
    return res.status(404).json({
      status: "error",
      mensaje: "No se han encontrado articulos",
    });
  }

  //Devolver resultado
  return res.status(200).send({
    status: "Success",
    contador: articulos.length,
    articulos,
  });
} 
  catch (error) {
    return res.status(404).json({
      status: "Error",
      mensaje: "Error al buscar",
    });
  }
};

module.exports = {
  prueba,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};
