const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectionDB = async () => {


//CONECTAR MONGOSEE
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.MONGO_DB_URL || process.env.DB_URL)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.log(error));

  // try {
  //   await mongoose.connect("mongodb://localhost:27017/mi_blog");
  //   // mongodb://127.0.0.1:27017/blog

  //   console.log("Conectados correctamente a la bd ");

  //   //Parametros dentro del objeto //solo en caso de aviso

  //   //useNewUrlParser: true
  //   //useUnifiedTopology: true
  //   //useCreateIndex : true
  // } catch (error) {
  //   console.log(error);
  //   throw new Error("Error connecting to db");
  // }
};

module.exports = { connectionDB };

