const flock = []
let attraction = false;
let walls = false;
let skyCol;
let flockSize;
let slider;
let pullActive;
let bound = 50;

let canvas;
function setup() {

    pullActive = true;
    flockSize = 50;

    canvas = createCanvas(640, 380);
    canvas.parent("boids");
    skyCol  = color(179, 255, 255);
    for (let i = 0; i < flockSize; i++) {
    flock.push(new Boid());
    }

    slider = createSlider(3, 100, 50);
    slider.position(90, 5);
    slider.style('width', '100px');
    slider.parent("boids");

    toggleWalls = createButton('repulsion');
    toggleWalls.position(10, 5);
    toggleWalls.mousePressed(toggleWallsFunction);
    toggleWalls.style("height","20px");
    toggleWalls.style("font-size","13px");
    toggleWalls.parent("boids");

    
}




function draw() {
    background(skyCol);
    
    controlPull();
    adjustFlockSize()
    

    for (let boid of flock) {
        if (walls) {
            boid.repelEdges()
            drawBounds(bound);
        } else {
            boid.edges()
        }
        if (attraction && pullActive) {
            boid.attract();
        }
        boid.flocking(flock);
        boid.show();
        boid.update();
    }
}

function adjustFlockSize() {
    flockSize = slider.value();
    diff = flockSize - flock.length
    if (diff != 0) {
        if (diff > 0) {
            // add
            for (let i = 0; i < diff; i++) {
                flock.push(new Boid());
            }

        } else {
            // subtract
            flock.splice(0, -diff);

        }
        
    }

}

function drawCrosshair() {
    fill(skyCol);
    stroke(255,0,0);
    strokeWeight(1);
    push();
    translate(mouseX, mouseY);
    line(-10,0,10,0);
    line(0,-10,0,10);
    ellipse(0, 0, 5, 5);
    pop();
}

function drawBounds(bound) {
    strokeWeight(1);
    stroke(0, 204, 204, 100);
    line(bound, bound, width-bound, bound);
    line(bound, bound, bound, height-bound);
    line(width-bound, height-bound, width-bound, bound);
    line(width-bound, height-bound, bound, height-bound);
}

function controlPull() {
    slider.mouseOver(tglPull);
    slider.mouseOut(tglPull);
    toggleWalls.mouseOver(tglPull);
    toggleWalls.mouseOut(tglPull);
}

function mousePressed() {
    attraction = true;
}
function mouseReleased() {
    attraction = false;
}

function toggleWallsFunction() {
        walls = !walls;
}

function tglPull() {
    pullActive = !pullActive;
}