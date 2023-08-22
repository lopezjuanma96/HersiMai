const express = require("express");

const { newUserHandler } = require("./handlers/new_user.js");
const { listUserHandler, exportUserListHandler } = require("./handlers/list_user.js");
const { userDetailHandler } = require("./handlers/user_detail.js");

const { listFormsHandler, getFormHandler, newFormHandler, getAnswerFormHandler, newAnswerFormHandler } = require("./handlers/forms.js");


const app = express(); // app contiene nuestro servidor

app.use('/', express.static(__dirname + "/public"))

app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.redirect("/list_user")
})

app.get('/api/list_user', listUserHandler)
app.get('/api/list_user/export', exportUserListHandler)
app.get('/api/user_detail', userDetailHandler)
app.post('/api/new_user', newUserHandler)

app.get('/api/form/list', listFormsHandler)
app.get('/api/form', getFormHandler)
app.post('/api/form', newFormHandler)

app.get('/api/form/answer', getAnswerFormHandler)
app.post('/api/form/answer', newAnswerFormHandler)

PORT=8080
app.listen(PORT, () => console.log("El servidor ya está levantado en http://localhost:" + PORT))