
function displayMomentum() {
    // Gradually reduces the momentum
    let A = 3.90865; let B = 1.29154;
    let alpha = 0.003;
    if (!showHint) {
        momentum *=  exp(-alpha / A);
    }
    momentum = constrain(momentum, 1, 10);
    eMomentum = A * log( B * momentum);
    // Print momentum bar
    fill(0, 0, 255);
    strokeWeight(0);
    rect(width - 145, height - 45, 100, -26.11111 * (eMomentum - 1));
    textAlign(CENTER, CENTER);
    fill(0,100,255);
    text(round(eMomentum, 1)+"X", width - 95, height - 162.5);
}


function printCompleted() {
    // Slides the words down gradually MOVE TO A MORE SUITABLE PLACE
    if (sliding) {
        slide++;
        bgSlide += 0.5;
        if (slide == 30) {
            completed.push(justCompleted)
            slide = 0;
            sliding = false;
        }
    }
    // Prints completed words below the text input box
    if (completed.length > 20) {
        completed.shift();
    }
    textAlign(LEFT, CENTER);
    textSize(27);
    fill(255);
    for (let i = 0; i < completed.length; i++) {
        text(completed[i], 20, 115 + (completed.length - i) * 30 + slide);
    }
}


function manageRedGreenBacking() {
    // Resets bacground colour to defult after X frames
    if (t1 < 30) {
        t1++;
    } else {
        col = bgCol;
    }
}


function slideBackImage() {
    // Slides the background image down when a word is spelled correctly
    for (let i = 0; i < 2; i++) {
        image(clouds, 0, bgSlide - i * bgHeight, width, bgHeight);
    }
    if (bgSlide > bgHeight) {
        bgSlide = 0;
    }
}


function createBlackAreas() {
    fill(20);
    noStroke();
    rect(0, 15, width, 60);
    rect(width - 150, height - 285, 110, 245);
    fill(95,166,195);
    rect(width - 145, height - 280, 100, 235);
}


function printTitleAndScore() {
    textSize(40);
    fill(255);
    textFont('Helvetica');
    textAlign(LEFT, CENTER);
    text("Spell Train", 20, 47);
    textAlign(CENTER, CENTER);
    text(round(score), width - 95, 47);
}


function manageHint() {
    // Controls the display of a hint after a word is miss spelled
    if (showHint) {
        printHint();
        if (t2 < 150) {
            t2++;      
        } else {
            showHint = false;
            say()
        }
    }  
}

function printHint() { 
    push();
    textSize(40);
    let word = lastWord;
    let wordWidth = textWidth(word);
    translate(width/2, height/2);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    fill(200, 0, 0, 150);
    rect(0, 0, wordWidth + 20, 50, 10);
    fill(255);
    text(word, 0,  0);
    pop();
}