////////////////////
// IMPORTS & DOMS //
////////////////////

const canvasBlock = document.getElementById("canvasBlock");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const title = document.getElementById('title');

/////////////
// CLASSES //
/////////////

class rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.color = color;

        this.active = false;

        this.draw = function () {
            /**
             * Draws the rectangle on the canvas
            */
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.isInside = function (x, y) {
            /**
             * Checks if the given coordinates are inside the rectangle
             * 
             * @param {number} x The x coordinate
             * @param {number} y The y coordinate
             * 
             * @returns {boolean} True if the coordinates are inside the rectangle, false otherwise
            */
            return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        }

        this.mouseOver = function (mouseX, mouseY) {
            /**
             * Checks if the mouse is over the rectangle
             * 
             * @returns {boolean} True if the mouse is over the rectangle, false otherwise
            */
            return this.isInside(mouseX, mouseY);
        }

        this.reset = function () {
            /**
             * Resets the rectangle to its initial state
            */
            this.color = "white";
            this.draw();
        }

        this.attempt = function (mouseX, mouseY) {
            /**
             * Called when the user attempts to hit the rectangle
             * 
             * @param {number} mouseX The x coordinate of the mouse
             * @param {number} mouseY The y coordinate of the mouse
             * 
             * @returns {boolean} True if the rectangle was hit, false otherwise
             */

            if (this.mouseOver(mouseX, mouseY)) {
                this.color = "green";
                this.draw();
                return true;
            }
            this.color = "white";
            this.draw();
            return false;
        }

        this.isActive = function () {
            /**
             * @returns {boolean} True if the rectangle is active, false otherwise
            */
            return this.active;
        }

        this.activate = function () {
            /**
             * Activates the rectangle
            */
            this.active = true;
            this.color = "yellow";
            this.draw();
        }

        this.deactivate = function () {
            /**
             * Deactivates the rectangle
            */
            this.active = false;
            this.color = "white";
            this.draw();
        }
    }
}

///////////////
// FUNCTIONS //
///////////////

const getRectangleOffset = () => {
    /**
     * @returns {number} The offset of the rectangle from the canvas border both horizontally and vertically
    */
    return Math.min(MAX_RECT_OFFSET, Math.max(MIN_RECT_OFFSET, Math.min(canvas.width / 10, canvas.height / 10)));
}

const getRectangleWidth = () => {
    /**
     * @returns {number} The width of the rectangle scaled to the canvas size
    */
    return Math.min(Math.max(canvas.width / 4, MIN_RECT_WIDTH), MAX_RECT_WIDTH);
}

const getRectangleHeight = () => {
    /**
     * @returns {number} The height of the rectangle scaled to the canvas size
    */
    return Math.min(Math.max(3 * canvas.height / 4, MIN_RECT_HEIGHT), MAX_RECT_HEIGHT);
}

const startInteraction = () => {
    /**
     * Called when the user starts interacting with the canvas
    */
    canvas.width = 0.9*canvasBlock.clientWidth;
    canvas.height = 0.9* canvasBlock.clientHeight;
    RECT_WIDTH = getRectangleWidth();
    RECT_HEIGHT = getRectangleHeight();
    if (STAGE == STAGES[0]) startTouchInteraction();
    else if (STAGE == STAGES[1]) startSweepInteraction();
}

const startTouchInteraction = () => {
    /**
     * Called when the Touch stage starts.
     * On the Touch stage the user has to click on any rectangle at any time.
     * If the user clicks the square it is counted as a TOUCH_HIT, if they don't it is counted as a TOUCH_MISS.
     * Except for hits in the TOUCH_REFRACT_MILIS miliseconds after a hit, which are not counted.
     * The Touch stage lasts for TOUCH_MILIS miliseconds.
     */
    console.log("Started Touch interaction");
    title.innerText = 'Prueba Táctil: Presiona los cuadrados';
    drawRectangles();
    setTimeout(endTouchInteraction, TOUCH_MILIS);
}

const startSweepInteraction = () => {
    console.log("Started Sweep interaction");
    title.innerText = 'Prueba de Barrido: Presiona los cuadrados cuando se iluminen';
    drawRectangles();
    sweep();
}

const restartInteraction = () => {
    /**
     * Called when the interaction is restarted
    */
    console.log("Restarted interaction");
    STAGE = STAGES[0];
    TOUCH_LEFT_HIT = 0;
    TOUCH_RIGHT_HIT = 0;
    TOUCH_MISS = 0;
    SWEEP_LEFT_HIT = 0;
    SWEEP_RIGHT_HIT = 0;
    SWEEP_MISS = 0;
    SWEEP_COUNTER = 0;
    startInteraction();
}

const endInteraction = () => {
    /**
     * Called when the interaction is ended
    */
    console.log("Ended interaction");
    endGame();
}

const endTouchInteraction = () => {
    /**
     * Called when the Touch stage ends.
     */
    console.log("Ended Touch interaction");
    title.innerText = 'Presiona "Continuar" para continuar con la prueba de Barrido';
    STAGE = STAGES[1];
    middleStage();
}

const endSweepInteraction = () => {
    /**
     * Called when the Sweep stage ends.
     */
    console.log("Ended Sweep interaction");
    title.innerText = 'Presiona "Enviar" para enviar los resultados';
    endInteraction();
}

const drawRectangles = () => {
    /**
     * Gets the rectangles ready to be drawn (sets width, height and offsets)
     * and draws the rectangles on the canvas
    */
    RECT_WIDTH = getRectangleWidth();
    RECT_HEIGHT = getRectangleHeight();
    RECT_OFFSET = getRectangleOffset();

    figures[0].width = RECT_WIDTH;
    figures[0].height = RECT_HEIGHT;
    figures[0].x = RECT_OFFSET;
    figures[0].y = RECT_OFFSET;
    figures[0].draw();

    figures[1].width = RECT_WIDTH;
    figures[1].height = RECT_HEIGHT;
    figures[1].x = canvas.width - RECT_WIDTH - RECT_OFFSET;
    figures[1].y = RECT_OFFSET;
    figures[1].draw();
}

///////////////
// LISTENERS //
///////////////

allowClick = true;

const resetRectangles = () => {
    /**
     * Resets the rectangles to their initial state
    */
    console.log("Resetting rectangles");
    figures[0].reset();
    figures[1].reset();
    if (figures[0].isActive()) figures[0].deactivate();
    else if (figures[1].isActive()) figures[1].deactivate();
    allowClick = true;
    if (STAGE === STAGES[1]) finishSweep();
}

const touchClickListener = e => {
    /**
     * Called on canvas click for Touch stage
    */
    if (figures[0].attempt(e.offsetX, e.offsetY)) {
        // The rectangle was hit
        console.log("Hit");
        TOUCH_LEFT_HIT++;
        allowClick = false;
        setTimeout(resetRectangles, TOUCH_REFRACT_MILIS)
    } else if (figures[1].attempt(e.offsetX, e.offsetY)) {
        // The rectangle was hit
        console.log("Hit");
        TOUCH_RIGHT_HIT++;
        allowClick = false;
        setTimeout(resetRectangles, TOUCH_REFRACT_MILIS)
    } else {
        // The rectangle was not hit
        console.log("Miss");
        TOUCH_MISS++;
    }
}

const sweepClickListener = e => {
    /**
     * Called on canvas click for Sweep stage
     */
    if (figures[0].isActive() && figures[0].attempt(e.offsetX, e.offsetY)) {
        // The rectangle was hit
        console.log("Hit");
        SWEEP_LEFT_HIT++;
        allowClick = false;
        clearTimeout(FINISH_SWEEP_TIMEOUT); // if the rectangle was hit do not wait for sweep to finish
        setTimeout(resetRectangles, SWEEP_REFRACT_MILIS);
    } else if (figures[1].isActive() && figures[1].attempt(e.offsetX, e.offsetY)) {
        // The rectangle was hit
        console.log("Hit");
        SWEEP_RIGHT_HIT++;
        allowClick = false;
        clearTimeout(FINISH_SWEEP_TIMEOUT); // if the rectangle was hit do not wait for sweep to finish
        setTimeout(resetRectangles, SWEEP_REFRACT_MILIS);
    } else {
        // The rectangle was not hit
        console.log("Miss");
        SWEEP_MISS++;
    }
}

const sweep = () => {
    /**
     * Called to act on the Sweep stage
     * Turns on the next rectangle and turns off the previous one
     * If the Sweep stage is over, ends the Sweep stage
     */
    if (SWEEP_COUNTER == SWEEP_AMT) {
        endSweepInteraction();
        return;
    } 
    const NEXT_RECT = SWEEP_COUNTER % figures.length;
    figures[NEXT_RECT].activate();
    FINISH_SWEEP_TIMEOUT = setTimeout(finishSweep, SWEEP_EACH_MILIS);
}

const finishSweep = () => {
    /**
     * Called to finish each sweep pposition on the Sweep Stage
     */
    const PREV_RECT = SWEEP_COUNTER % figures.length;
    figures[PREV_RECT].deactivate();
    SWEEP_COUNTER++;
    setTimeout(sweep, SWEEP_REFRACT_MILIS);
}

const clickListener = e => {
    /**
     * Called on canvas click for basic mode
    */
    if (!allowClick) return;
    else if (STAGE == STAGES[0]) touchClickListener(e);
    else if (STAGE == STAGES[1]) sweepClickListener(e);
}

canvas.addEventListener("click", clickListener);

/////////////
// PROCESS //
/////////////

const MIN_RECT_WIDTH = 25;
const MAX_RECT_WIDTH = 400;
const MIN_RECT_HEIGHT = 50;
const MAX_RECT_HEIGHT = 800;
const MIN_RECT_OFFSET = 10;
const MAX_RECT_OFFSET = 25;
var RECT_WIDTH = getRectangleWidth();
var RECT_HEIGHT = getRectangleHeight();

const STAGES = ["T", "S"] // Touch, Sweep
var STAGE = STAGES[0];

// TIME CONSTANTS
// Duration of the whole Touch stage
const TOUCH_MILIS = 20000; // 20 seconds
// Blocking time after a hit in Touch stage
const TOUCH_REFRACT_MILIS = 3000; // 3 seconds
// Duration of the whole Sweep stage (in number of times the rectangles are swept). If no hit, whole Sweep stage will be SWEEP_COUNT * SWEEP_EACH_MILIS.
const SWEEP_AMT = 6;
var SWEEP_COUNTER = 0;
// Duration of each rectangle blink in Sweep stage if no hit is detected (on hit the sweep continues)
const SWEEP_EACH_MILIS = 10000; // 10 seconds
var FINISH_SWEEP_TIMEOUT;
// Blocking time after a hit in Sweep stage
const SWEEP_REFRACT_MILIS = 3000; // 3 seconds

// SCORES
var TOUCH_LEFT_HIT = 0;
var TOUCH_RIGHT_HIT = 0;
var TOUCH_MISS = 0;
var SWEEP_LEFT_HIT = 0;
var SWEEP_RIGHT_HIT = 0;
var SWEEP_MISS = 0;

canvas.width = 0.9*canvasBlock.clientWidth;
canvas.height = 0.9* canvasBlock.clientHeight;

title.innerText = 'Presiona "Comenzar" para iniciar la prueba Táctil';

const figures = [
    new rectangle(10, 10, RECT_WIDTH, RECT_HEIGHT, "white"),
    new rectangle(canvas.width - RECT_WIDTH - 10, 10, RECT_WIDTH, RECT_HEIGHT, "white")
]
