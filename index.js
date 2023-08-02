const { connectionDB } = require("./db/connectionDB");
const express = require("express");
const cors = require("cors");

//Conectar a la base de datos
connectionDB();

//Crear servidor de Node
const app = express();
const port = 3900;

//Configurar cost
app.use(cors());

//Convertir body a objeto js
app.use(express.json()); //Recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); //Recinir los datos form-urlencode

//RUTAS
const rutasArticle = require("./rutes/article");

///CARGA LA RUTAS
app.use("/api", rutasArticle);

//Crear ruta de prueba hardcodeada
// app.get("/probando", (req, res) => {
//   console.log("Se ha ejecutado el endpoint 'probando'");

//   return res.status(200).send(
//     `
//     <div>
//         <h1>Probando Api</h1>
//     </div>
//     `
//   );
// });

//Crear servidor y escuchar peticiones http
app.listen(port, () => {
  console.log("Servidor corriendo en el pueto", port);
});
