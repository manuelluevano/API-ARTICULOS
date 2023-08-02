const { connectionDB } = require("./db/connectionDB");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });

//Conectar a la base de datos
connectionDB();

//Crear servidor de Node
const app = express();


//Configurar cost - //CORS PERMITE QUE UN CLIENTE SE CONECTE A OTRO SERVIDOR PARA EL INTERCAMBIO DE RECURSOS
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

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 6000;

//Crear servidor y escuchar peticiones http
app.listen(port,host, () => {
  console.log("Servidor corriendo en el pueto", port);
});
