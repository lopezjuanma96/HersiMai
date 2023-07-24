const listUserHandler = (req, res) => {
    res.status(200).send({
        users: [
            {
                name: "Juanma",
                email: "juanma@email.com",
                code: "123456"
            },
            {
                name: "Hersi",
                email: "hersi@email.com",
                code: "456789"
            },
        ],
        code: 'success',
        msg: "Se devuelve la lista de usuarios correctamente."
    })
}

module.exports = { listUserHandler }