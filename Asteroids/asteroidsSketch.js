let keys = [];
let ship;
let shipDim = 30;
let bullets = [];
let astroids;
let difficulty;
let outerThresh = 200;
let score;
let debug = false;
let playing;

// Prevents webpage downscrolling when spacebar is pressed
window.onkeydown = function(e) { 
    return !(e.keyCode == 32);
};

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent("astroids");
    playing = true;
    score = 0;
    difficulty = 0.6;

    // Initialise key press states
    for (let i = 0; i < 4; i++) {
        keys[i] = false;
      }
    // New spaceship
    ship = new Spaceship();
    astroids = [];
}

function draw() {
    background(30);
    checkKeys(); 

    // Manage bullets on screen
    deleteExcessBullets();
    for (let b of bullets) {
        b.update();
        b.display();
    }

    // Manage ship
    ship.wrapEdges(); 
    ship.update();
    if (astroids.length > 0) ship.checkCollisions();  
    ship.display();  

    //Manage astroids
    if (playing) {
        if (random(100) < difficulty) {
        generateAstroid();
        }
    }
    
    destroyedAstroids();
    for (let astroid of astroids) {
        astroid.update();
        astroid.display();
        astroid.checkBullets(bullets);
    }

    // End game and reset
    if (ship.destroyed) {
        gameOver();
    }
    
    difficulty += 0.00005;
    printScore();
}


function deleteExcessBullets() {
    // Bullets that have left the screen
    for(let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].outOfFrame()) {
            bullets.splice(i, 1);
        }
    }
}

function destroyedAstroids() {

    function makeProgeny(i) {
        let spreadVel = createVector(random(-1, 1), random(-1, 1));
        spreadVel.setMag(1);
        if (astroids[i].radius > 4) {
            for (let j = 0; j < 2; j++) {
              let newVel = astroids[i].velocity.copy();
              newVel.add(spreadVel);
              spreadVel.mult(-1); 
              let newloc = astroids[i].location.copy();
              newloc.add(createVector(random(-10, 10), random(-10, 10)));
              astroids.push(new Astroid(newloc, newVel, astroids[i].radius/2, random(0.001, 0.02)));
            }
        }
    }

    let indexToRemove = [];
    for (let i = 0; i < astroids.length; i++) {
        if (astroids[i].health <= 0) {
            score += int(astroids[i].radius / 2);
            indexToRemove.push(i);
            makeProgeny(i); 
        } else if (astroids[i].outOfThreshold()) {
            // Removes astroids that have left the screen 
            indexToRemove.push(i); 
        }
    }
    
    for (let index of indexToRemove) {
        astroids.splice(index, 1);
    }

    
}


function generateAstroid() {
    let outerWidth  = width  + 2 * outerThresh;
    let outerHeight = height + 2 * outerThresh;
    let location = createVector(0, 0); // Dummy
    let a = randomGaussian() * PI / 12.0;
    let angleLimit = PI / 6.0;
    a = constrain(a, -angleLimit, angleLimit);
  
    if (random(1) < 0.5) {
      // Top/Bottom
      let spread = randomGaussian() * outerWidth / 3.0;
      spread = constrain(spread, -outerWidth / 2.0, outerWidth / 2.0);
      if (random(1) < 0.5) {
        // Top
        location = createVector(spread, outerHeight/2);
      } else {
        // Bottom
        location = createVector(spread, -outerHeight/2);
      }
    } else {
      // Left/Right
      let spread = randomGaussian() * outerHeight / 3.0;
      spread = constrain(spread, -outerHeight / 2.0, outerHeight / 2.0);   
      if (random(1) < 0.5) {
        // Left
        location = createVector(-outerWidth/2, spread);
      } else {
        // Right
        location = createVector(outerWidth/2, spread);
      }
    }
  
    let velocity = location.copy().mult(-1);
    location.add(createVector(width/2, height/2));
    velocity.rotate(a);
    velocity.setMag(random(1, 2));
  
    astroids.push(new Astroid(location, velocity, random(10, 20), random(0.001, 0.02)));
}

function printScore() {
    textAlign(LEFT);
    textSize(20);
    stroke(0);
    strokeWeight(2);
    fill(255);
    text("Score: "+score, 10, 22);
}

function gameOver() {
    textAlign(CENTER, CENTER);
    textSize(100);
    stroke(0);
    strokeWeight(2);
    fill(255, 0, 0);
    text("GAME OVER", width/2, height/2);
    playing = false;
    astroids = [];
}

function reset() {
    setup();
}

function checkKeys() {
    if (keys[0]) ship.turnCW();
    if (keys[1]) ship.turnCCW();
    if (keys[2]) ship.boost();
    if (keys[3]) ship.shoot();
}
  
function keyPressed() {
    if (key == ' ')               keys[3] = true;
    if (key == 'd' || key == 'D') keys[0] = true;
    if (key == 'a' || key == 'A') keys[1] = true;
    if (key == 'w' || key == 'W') keys[2] = true;
    if (key == 'r' || key == 'R') reset();
    if (key == 'b' || key == 'B') debug = !debug;
}
  
function keyReleased() {
    if (key == ' ')               keys[3] = false;
    if (key == 'd' || key == 'D') keys[0] = false;
    if (key == 'a' || key == 'A') keys[1] = false;
    if (key == 'w' || key == 'W') keys[2] = false;
}

