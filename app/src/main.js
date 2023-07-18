const express = require("express");

const app = express(); // app contiene nuestro servidor

app.use('/', express.static(__dirname + "/../public"))

app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hola papá")
})

app.post('/api/new_user', (req, res) => {
    const new_user = req.body;
    console.log(new_user);
    res.send({code:"created-user", msg:"Se creó un nuevo usuario", data:{code: "AAW125"}});
})

PORT=8080
app.listen(PORT, () => console.log("El servidor ya está levantado en http://localhost:" + PORT))