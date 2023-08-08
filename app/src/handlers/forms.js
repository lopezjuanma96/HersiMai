const { readFormFile } = require("./files.js")

const getFormHandler = (req, res) => {
    const formId = req.query.fid;
    const formData = readFormFile(formId);
    
    if (formData === {}) return res.status(404).send({code: 'form-not-found', msg: `El formulario ${formId} no se encontró`})
    
    return res.status(200).send({
        code: 'success',
        data: formData,
        msg: "Se devuelve el detalle del formulario " + formId + " correctamente." 
    })
}

module.exports = { getFormHandler }