const canvasBlock = document.getElementById("canvasBlock");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CIRCLE_RADIUS = 100;
const NUM_CIRCLES = 10;
const CIRCLE_TIMEOUT_MILIS = 2000;

class circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.hitted = false; //i know the participle is "hit" but that is already the method name below
        this.hitAttempts = 0;

        this.draw = function () {
            /**
             * Draws the circle on the canvas
            */
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        this.isInside = function (x, y) {
            /**
             * Checks if the given coordinates are inside the circle
             * 
             * @param {number} x The x coordinate
             * @param {number} y The y coordinate
             * 
             * @returns {boolean} True if the coordinates are inside the circle, false otherwise
            */
            return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) < this.radius;
        }

        this.mouseOver = function (mouseX, mouseY) {
            /**
             * Checks if the mouse is over the circle
             * 
             * @returns {boolean} True if the mouse is over the circle, false otherwise
            */
            return this.isInside(mouseX, mouseY);
        }

        this.hit = function () {
            /**
             * Called when the circle is hit
            */
            this.hitted = true;
        }

        this.attempt = function (mouseX, mouseY) {
            /**
             * Called when the user attempts to hit the circle
             * 
             * @param {number} mouseX The x coordinate of the mouse
             * @param {number} mouseY The y coordinate of the mouse
             * 
             * @returns {boolean} True if the circle was hit, false otherwise
             */

            this.hitAttempts++;
            if (this.mouseOver(mouseX, mouseY)) {
                this.hit();
                this.color = "green";
                this.draw();
                return true;
            }
            this.color = "red";
            this.draw();
            return false;
        }
    }
}

//console.log(canvas.width, canvas.height, canvasBlock.clientWidth, canvasBlock.clientHeight)
canvas.width = 0.9*canvasBlock.clientWidth;
canvas.height = 0.9* canvasBlock.clientHeight;
//console.log(canvas.width, canvas.height, canvasBlock.clientWidth, canvasBlock.clientHeight)

const circles = []

const getCircleX = () => {
    /**
     * Gets a random X position for a new circle, considering the circle radius
     * so that the circle is fully visible
    */

    return Math.random() * (canvas.width - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS;
}

const getCircleY = () => {
    /**
     * Gets a random Y position for a new circle, considering the circle radius
     * so that the circle is fully visible
    */

    return Math.random() * (canvas.height - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS;
}

const startInteraction = () => {
    /**
     * Called when the user starts interacting with the canvas
    */
    console.log("Started interaction");
    circleTimeout();
}

const restartInteraction = () => {
    /**
     * Called when the interaction is restarted
    */
    console.log("Restarted interaction");
    circles.length = 0;
    startInteraction();
}

const endInteraction = () => {
    /**
     * Called when the interaction is ended
    */
    console.log("Ended interaction");
    endGame();
}

const circleTimeout = () => {
    /**
     * Called when the circle timeout is over
     * If NUM_CIRCLES circles have been drawn, the interaction is ended
     * Otherwise, a new circle is drawn and the timeout is reset
    */

    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (circles.length >= NUM_CIRCLES) {
        endInteraction();
    } else {
        circles.push(new circle(getCircleX(), getCircleY(), CIRCLE_RADIUS, "white"));
        circles[circles.length - 1].draw();
        setTimeout(circleTimeout, CIRCLE_TIMEOUT_MILIS);
    }
}

canvas.addEventListener("click", e => {
    /**
     * Called when the canvas is clicked
    */
    //console.log(e.offsetX, e.offsetY);

    circles[circles.length - 1].attempt(e.offsetX, e.offsetY);
});
