const express = require("express");

const app = express(); // app contiene nuestro servidor

PORT=8080
app.listen(PORT, () => console.log("El servidor ya está levantado"))