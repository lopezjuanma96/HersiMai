const queryParams = window.location.search;
const formId = window.location.pathname.endsWith('/') ? window.location.pathname.split('/').slice(-2, -1)[0] : window.location.pathname.split('/').pop();

const startButton = document.getElementById('startButton');
const submitButton = document.getElementById('submitButton');
const resetButton = document.getElementById('resetButton');

const report = {filled: false};

const canvasDisplay = canvas.style.display.toString();
canvas.style.display = 'none';

const submitButtonDisplay = submitButton.style.display.toString();
submitButton.style.display = 'none';
const resetButtonDisplay = resetButton.style.display.toString();
resetButton.style.display = 'none';

const startGame = () => {
    startButton.style.display = 'none';
    canvas.style.display = canvasDisplay;
    startInteraction();
}

const restartGame = () => {
    submitButton.style.display = 'none';
    resetButton.style.display = 'none';
    canvas.style.display = canvasDisplay;
    unfillReport();
    restartInteraction();
}

const endGame = () => {
    canvas.style.display = 'none';
    startButton.style.display = 'none'; // should already be none but just in case
    submitButton.style.display = submitButtonDisplay;
    resetButton.style.display = resetButtonDisplay;
    fillReport();
    console.log(report);
}

const fillReport = () => {
    var hitCount = 0, attemptCount = 0;
    const hitRateQuestion = "Tasa de aciertos:";
    const attemptAvgQuestion = "Promedio de intentos:";

    for (var c of figures){
        if (c.hitted){
            hitCount++;
            attemptCount += c.hitAttempts; // only count attempts if the circle was hit
        }
    }

    // Express hitRate as a percentage rounded to 2 decimals
    const hitRate = `${(hitCount / figures.length * 100).toFixed(2)}%`
    // Express attemptAvg as a decimal rounded to 2 decimals, if hitCount is 0 set to invalid
    const attemptAvg = hitCount > 0 ? (attemptCount / hitCount).toFixed(2) : 'inválido';

    report.answers = [
        {question: hitRateQuestion, answer: hitRate},
        {question: attemptAvgQuestion, answer: attemptAvg}
    ]
    //report.filled = true;
}

const unfillReport = () => {
    report.filled = false;
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', restartGame);

/* 
submitButton.addEventListener('click', () => {
    if (report.filled){
        resetButton.disabled = true;
        submitButton.disabled = true;
        fetch(`/api/form/answer${queryParams}&fid=${formId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({answers: report.answers})
        }).then(res => 
            res.json()
        ).then(resJson => {

            resetButton.disabled = false;
            submitButton.disabled = false;
            
            if (resJson.code !== 'success'){
                console.log(resJson.code, resJson.msg);
                return alert(resJson.msg);
            } else {
                return alert('Respuestas enviadas con éxito');
            }
        }).catch(err => {
            console.log(err);
            resetButton.disabled = false;
            submitButton.disabled = false;
            return alert('Error al enviar respuestas');
        })
    } else {
        return alert('No hay respuestas para enviar. Reintente la prueba.');
    }
});
 */