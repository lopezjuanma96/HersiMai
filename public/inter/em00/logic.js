const queryParams = window.location.search;
const formId = window.location.pathname.endsWith('/') ? window.location.pathname.split('/').slice(-2, -1)[0] : window.location.pathname.split('/').pop();

const startButton = document.getElementById('startButton');
const submitButton = document.getElementById('submitButton');
const resetButton = document.getElementById('resetButton');

const report = {filled: false};

const canvasDisplay = canvas.style.display.toString();
canvas.style.display = 'none';

const startButtonDisplay = startButton.style.display.toString();
const submitButtonDisplay = submitButton.style.display.toString();
submitButton.style.display = 'none';
const resetButtonDisplay = resetButton.style.display.toString();
resetButton.style.display = 'none';

const startGame = () => {
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    canvas.style.display = canvasDisplay;
    startInteraction();
}

const middleStage = () => {
    canvas.style.display = 'none';
    startButton.innerText = 'Continuar';
    startButton.style.display = startButtonDisplay;
    resetButton.style.display = resetButtonDisplay;
}

const restartGame = () => {
    startButton.style.display = 'none';
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
    const touchHitRateQuestion = "Tasa de aciertos Táctil:";
    const sweepHitRateQuestion = "Tasa de aciertos Barrido:";
    const hitBalanceLeftQuestion = "Balance de toques a la izquierda:";
    const hitBalanceRightQuestion = "Balance de toques a la derecha:";

    const TOUCH_HIT = TOUCH_LEFT_HIT + TOUCH_RIGHT_HIT;
    const SWEEP_HIT = SWEEP_LEFT_HIT + SWEEP_RIGHT_HIT;
    const touchHitRate = `${((TOUCH_HIT) / (TOUCH_HIT + TOUCH_MISS) * 100).toFixed(2)}%`;
    const sweepHitRate = `${((SWEEP_HIT) / (SWEEP_HIT + SWEEP_MISS) * 100).toFixed(2)}%`;
    
    const hitBalanceLeft = `${((TOUCH_LEFT_HIT + SWEEP_LEFT_HIT) / (TOUCH_HIT + SWEEP_HIT) * 100).toFixed(2)}%`;
    const hitBalanceRight = `${((TOUCH_RIGHT_HIT + SWEEP_RIGHT_HIT) / (TOUCH_HIT + SWEEP_HIT) * 100).toFixed(2)}%`;

    report.answers = [
        {question: touchHitRateQuestion, answer: touchHitRate},
        {question: sweepHitRateQuestion, answer: sweepHitRate},
        {question: hitBalanceLeftQuestion, answer: hitBalanceLeft},
        {question: hitBalanceRightQuestion, answer: hitBalanceRight}
    ]

    report.filled = true;
}

const unfillReport = () => {
    report.filled = false;
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', restartGame);

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
