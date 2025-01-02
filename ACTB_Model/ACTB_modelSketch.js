let P = 30; // # of pro arguments
let C = 30; // # of con arguments
let L = P + C; // total # of arguments
let N = 100; // # of agents
let s = 10; // number of arguments held in memory

let a = []; // argument vector
let agents = []; // array of agents

let i; // interacting agents
let j;

let running = true;
let y; // printing height
let t; // itteration number

let h = 10; // homophily parameter

function setup() {
    canvas = createCanvas(350, 550);
    canvas.parent("actbmodel");
    background(51);
    y = height;
    t = 0;

    // fill argument vector a
    for (let k = 0; k < L; k++) {
        if (k < P) {
            a[k] = 1;
        } else {
            a[k] = -1;
        }
    }

    // initialize agents
    for (let k = 0; k < N; k++) {
        agents[k] = new Agent();
    }

    // buttons
    pauseButton = createButton("pause");
    pauseButton.position(360, height/2 - 40);
    pauseButton.mousePressed(pause);
    pauseButton.style("height","30px");
    pauseButton.style("font-size","20px");
    pauseButton.parent("actbmodel");

    resetButton = createButton("reset");
    resetButton.position(360, height/2);
    resetButton.mousePressed(reset);
    resetButton.style("height","30px");
    resetButton.style("font-size","20px");
    resetButton.parent("actbmodel");
    
}


function draw() {
    if (running) {
        for (let k = 0; k < 5; k++) {
            displayOpinions();
            for (let m = 0; m < 10; m++) {
                selectPair();
                interact();
                t++;
            }
            displayIter(); // prints itteration number
            y--;
        }
    }
}


function displayOpinions() {
    translate(width/2, 0);
    let opinions = [];
    // Cycles the plot back to the bottom when it leaves the window
    if (y == 0) {
        background(50);
        y = height;
    }
    // fills active opinion array
    for (let agent of agents) {
        let placed = false;
        for (let k = 0; k < opinions.length; k++) {
            if (opinions[k] == agent.o) {
                placed = true;
            }
        }
        if (!placed) {
            opinions.push(agent.o);
        }
    }
    // fills frequency array
    let opinionFrequency = new Array(opinions.length).fill(0);
    for (let agent of agents) {
        for (let k = 0; k < opinions.length; k++) {
            if (opinions[k] == agent.o) {
                opinionFrequency[k] += 1;
            }
        }
    }
    // prints rectangles
    for (let k = 0; k < opinions.length; k++) {
        let opinion = opinions[k];
        let frequency = opinionFrequency[k];
        
        let f = map(frequency, 0, N/5, 0, 1);
        fill(f * 255, 0, (1 - f) * 255);
        rectMode(CENTER);
        rect(opinion * (width - 32)/2, y, 25, 1);
    }
}


function displayIter() {
    noStroke();
    translate(-width/2, 0);
    fill(70);
    rectMode(CORNER);
    let string = "iterations: " + t;
    rect(10, 5, textWidth(string) + 19, 40);
    textSize(20);
    fill(255);
    text(string, 20, 30);
}

function pause() {
    running = !running;
}

function reset() {
    setup();
}
