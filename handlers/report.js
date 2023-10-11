const { reportAgent } = require('./agents');

const getReportHandler = (req, res) => {
    const code = req.query.code;
    const report = {};

    return res.status(200).send(reportAgent.apply("GET", code, report, {
        code: 'success',
        data: report,
        msg: "Se devuelve el reporte del usuario " + code + " correctamente."
    }))
}

module.exports = {
    getReportHandler
}