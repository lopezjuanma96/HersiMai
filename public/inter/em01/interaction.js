////////////////////
// IMPORTS & DOMS //
////////////////////

const canvasBlock = document.getElementById("canvasBlock");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const title = document.getElementById("title");

/////////////
// CLASSES //
/////////////

class measures {
    constructor() {
        this.rightHits = 0;
        this.leftHits = 0;
        this.sweepHits = 0;
        this.sweepMisses = 0;

        this.rightTimes = [];
        this.rightLastTime = 0;
        this.leftTimes = [];
        this.leftLastTime = 0;
        this.sweepTimes = [];
        this.sweepLastTime = 0;

        this.rightHit =  function(){
            this.rightHits++;
            this.rightTimes.push(Date.now() - this.rightLastTime);
            this.rightLastTime = Date.now();
        }

        this.leftHit = function(){
            this.leftHits++;
            this.leftTimes.push(Date.now() - this.leftLastTime);
            this.leftLastTime = Date.now();
        }

        this.sweepHit = function(){
            this.sweepHits++;
            this.sweepTimes.push(Date.now() - this.sweepLastTime);
            this.sweepLastTime = Date.now();
        }

        this.sweepMiss = function(){
            this.sweepMisses++;
        }

        this.getTimeAverages = function(){
            return {
                right: this.rightTimes.reduce((a, b) => a + b, 0) / this.rightTimes.length,
                left: this.leftTimes.reduce((a, b) => a + b, 0) / this.leftTimes.length,
                sweep: this.sweepTimes.reduce((a, b) => a + b, 0) / this.sweepTimes.length
            }
        }

        this.startRightTimer = function(){
            this.rightLastTime = Date.now();
        }

        this.startLeftTimer = function(){
            this.leftLastTime = Date.now();
        }

        this.startSweepTimer = function(){
            this.sweepLastTime = Date.now();
        }

        this.reset = function(){
            this.rightHits = 0;
            this.leftHits = 0;
            this.sweepHits = 0;
            this.sweepMisses = 0;

            this.rightTimes = [];
            this.rightLastTime = 0;
            this.leftTimes = [];
            this.leftLastTime = 0;
            this.sweepTimes = [];
            this.sweepLastTime = 0;
        }
    }
}

///////////////
// FUNCTIONS //
///////////////

const startInteraction = () => {
    /**
     * Called when the user starts interacting with the canvas
    */
    console.log("Starting interaction");
    canvas.width = 0.9*canvasBlock.clientWidth;
    canvas.height = 0.9* canvasBlock.clientHeight;
    canvas.style.backgroundColor = "orange";
    allowClick = true;
    if (STAGE == STAGES[0]) startRightInteraction();
    else if (STAGE == STAGES[1]) startLeftInteraction();
}

const startRightInteraction = () => {
    console.log("Starting right interaction");
    title.innerText = 'Presiona con la mano derecha';
    canvas.addEventListener("click", clickRightListener);
    measure.startRightTimer();
    setTimeout(endInteraction, RIGHT_MILIS);
}

const startLeftInteraction = () => {
    console.log("Starting left interaction");
    title.innerText = 'Presiona con la mano izquierda';
    canvas.addEventListener("click", clickLeftListener);
    measure.startLeftTimer();
    setTimeout(endInteraction, LEFT_MILIS);
}

const restartInteraction = () => {
    /**
     * Called when the interaction is restarted
    */
    STAGE = STAGES[0];
    measure.reset();
    startInteraction();
}

const endInteraction = () => {
    /**
     * Called when the interaction is ended
    */
    canvas.style.backgroundColor = "none";
    allowClick = false;
    if (STAGE == STAGES[0]) endRightInteraction();
    else if (STAGE == STAGES[1]) endLeftInteraction();
}

const endRightInteraction = () => {
    title.innerText = 'Presiona "Continuar" para continuar a la prueba de la mano izquierda';
    canvas.removeEventListener("click", clickRightListener);
    STAGE = STAGES[1];
    middleStage();
}

const endLeftInteraction = () => {
    title.innerText = 'Presiona "Continuar" para continuar a la prueba de barrido';
    canvas.removeEventListener("click", clickLeftListener);
    endGame();
}

///////////////
// LISTENERS //
///////////////

var allowClick = true;

const restartClick = () => {
    allowClick = true;
    canvas.style.backgroundColor = "orange";
    if (STAGE == STAGES[2]) deactivateSweep(); //on sweep, to restart the sweeping process
}

const clickRightListener = (e) => {
    if (allowClick) {
        console.log("Click detected on right test");
        allowClick = false;
        measure.rightHit();
        canvas.style.backgroundColor = "green";
        setTimeout(restartClick, RIGHT_REFRACT_MILIS);
    }
}

const clickLeftListener = (e) => {
    if (allowClick) {
        console.log("Click detected on left test");
        allowClick = false;
        measure.leftHit();
        canvas.style.backgroundColor = "green";
        setTimeout(restartClick, LEFT_REFRACT_MILIS);
    }
}

/////////////
// PROCESS //
/////////////

const STAGES = ["R", "L"] //for Right (Touch), Left (Touch) and Sweep
var STAGE = STAGES[0]

// TIME CONSTANTS
// Duration of the interaction of Right (Touch)
const RIGHT_MILIS = 40000;
// Blocking time after a hit in Right (Touch)
const RIGHT_REFRACT_MILIS = 3000; // 3 seconds
// Duration of the interaction of Left (Touch)
const LEFT_MILIS = 40000;
// Blocking time after a hit in Left (Touch)
const LEFT_REFRACT_MILIS = 3000; // 3 seconds

//console.log(canvas.width, canvas.height, canvasBlock.clientWidth, canvasBlock.clientHeight)
canvas.width = 0.9*canvasBlock.clientWidth;
canvas.height = 0.9* canvasBlock.clientHeight;
//console.log(canvas.width, canvas.height, canvasBlock.clientWidth, canvasBlock.clientHeight)

title.innerText = 'Presiona "Comenzar" para iniciar la prueba';

const measure = new measures();