let justCompleted;
let completed;

let col;
let bgCol;
let bgSlide = 100;
let bgHeight;

let t1 = 100000;
let t2 = 100000;
let slide = 0;
let sliding = false;
let showHint = false;

let score;
let momentum;
let eMomentum; 

let levelIndex; 
let levels = [];
let currentWord;
let currentLevel;

let speech;
let spellings;
let clouds;
function preload() { 
    //spellings = loadStrings("SpellTrain/singleWords.txt");
    spellings = loadStrings("SpellTrain/singleWords.http");
    clouds = loadImage("SpellTrain/background.png");
}

function setup() {
    createCanvas(640, 400);
    canvas = createCanvas(640, 400);
    canvas.parent("spelltrain");

    justCompleted = "";
    completed = [];

    bgCol = color(255,0);
    col = bgCol;
    bgHeight = (width/clouds.width) * clouds.height;

    score = 0;
    momentum = 1;
    eMomentum = 1;

    // Prepare data
    cleanArray();
    suffleArray();
    setUpLevels();
    
    // Initialise first level and word
    levelIndex = 0;
    currentLevel = levels[levelIndex];
    currentWord = random(currentLevel);
    lastWord = "";

    // Prepare button, input and text to speach
    setupInterfaceElements()
}


function draw() {  
    slideBackImage();
    background(col);
    createBlackAreas()
    printTitleAndScore();
    printCompleted();
    manageRedGreenBacking()
    displayMomentum();
    manageHint()
   
}


function test() {  
    let toSay = false;
    // Is the input word correct?
    if (input.value().toLowerCase() == currentWord.spelling) {
        // Yes
        correctAnswer();
        toSay = true;
    } else {
        // No
        incorrectAnswer();
    }
    
    // t1 manages the activity of the red/green background 
    t1 = 0;
    input.value("");

    updateWordValues();
    checkLevelCompletion();
    // Used to show the hint when a miss spelling occurs
    lastWord = currentWord.spelling;
    chooseNextWord();

    // If the guess was correct, say the next word immidiately, otherwidse, the
    // next word will be said after the hint has been shown using the hint function
    if (toSay) {
        say();
    }
}


function correctAnswer() {
    col = color(0, 200, 0, 100);
    justCompleted = currentWord.spelling;
    if (currentWord.toPass == 1) {
        sliding = true;
    }
    currentWord.spelled();
    score += eMomentum;
    momentum += 1;
}


function incorrectAnswer() {
    currentWord.missSpelled();
    col = color(200, 0, 0, 100);
    momentum *=  exp(-0.3);
    t2 = 0;
    showHint = true;

    // Print correct spelling
}


function keyPressed() {
    if (keyCode == ENTER) {
        test();
    }
}


function say() {
    console.log(currentWord.spelling);
    speech.setVoice("Google UK English Male");
    speech.speak(currentWord.spelling);
}


function setupInterfaceElements() {
    // Text to speech funcionality
    speech = new p5.Speech(); 
    speech.setVoice("Google UK English Male");
    // Text input box
    input = createInput();
    input.position(20, 90);
    input.style("height", "30px");
    input.style("font-size", "30px");
    input.attribute("spellcheck", "false");
    input.parent("spelltrain");
    // Say button
    speakWord = createButton("say");
    speakWord.position(403, input.y);
    speakWord.mousePressed(say);
    speakWord.style("height", "36px");
    speakWord.style("font-size", "20px");
    speakWord.parent("spelltrain");
}








