const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mi_blog");
    // mongodb://127.0.0.1:27017/blog

    console.log("Conectados correctamente a la bd ");

    //Parametros dentro del objeto //solo en caso de aviso

    //useNewUrlParser: true
    //useUnifiedTopology: true
    //useCreateIndex : true
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to db");
  }
};

module.exports = { connectionDB };
