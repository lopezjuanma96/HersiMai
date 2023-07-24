const express = require("express");

const { newUserHandler } = require("./handlers/new_user.js");
const { listUserHandler } = require("./handlers/list_user.js")

const app = express(); // app contiene nuestro servidor

app.use('/', express.static(__dirname + "/../public"))

app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hola papá")
})

app.get('/api/list_user', listUserHandler)
app.post('/api/new_user', newUserHandler)

PORT=8080
app.listen(PORT, () => console.log("El servidor ya está levantado en http://localhost:" + PORT))