let N = 10;
let K = 3;
let elements;
let permutations;


function setup() {
    canvas = createCanvas(300,400);
    canvas.parent("BoolNet");
    initialiseElements();
    generatePermutations();


    let x = 0;
    let y = 0;
    update_button = createButton("Update");
    update_button.position(15+x, 330+y);
    update_button.parent("BoolNet");

    reset_button = createButton("Reshuffle");
    reset_button.position(15+x, 360+y);
    reset_button.parent("BoolNet");

    setN = createInput(10);
    setN.position(250+x,330+y)
    setN.size(25);
    setN.parent("BoolNet");

    setK = createInput(3);
    setK.position(250+x,360+y)
    setK.size(25);
    setK.parent("BoolNet");

    txtN = createElement('h1',['N']);
    txtN.position(230+x,311+y)
    txtN.parent("BoolNet");

    txtK = createElement('h1',['K']);
    txtK.position(230+x,342+y)
    txtK.parent("BoolNet");
    
    
    
    reset_button.mouseClicked(reset);
    update_button.mouseClicked(update);
    
    
}

function draw() {
    background(51,153,255)
    


    for (let i = 0; i < elements.length; i++) {

        let e = elements[i];

        // draws connections
        let inputs = e.inputIndices
        for (let index of inputs) {       
            drawTriangle(index, e)         
        }
    }

    for (let i = 0; i < elements.length; i++) {
        let e = elements[i];
        e.display();    // prints element objects to canvas as circles
        
    }
}

function drawTriangle(index, element){
    // used to draw the connections
    let x1 = elements[index].location;
    let x2 = element.location;
    let o = 5; // triangle offset
    let d = dist(x1.x,x1.y,x2.x,x2.y);
    push() //start new drawing state
    let angle = atan2(x1.y - x2.y, x1.x - x2.x); //gets the angle of the line
    translate(x1.x, x1.y); //translates to the destination vertex
    rotate(angle-HALF_PI); //rotates the arrow point
    fill(255,0,0,100);
    stroke(150,0,0,170);
    triangle(-o,0,o,0,0,-d);
    pop();
}


function update(){ 
    let previousStates = []
    for (let i = 0; i < elements.length; i++){
        previousStates.push(elements[i].state);
    }

    for (let e of elements){
        e.boolFunction(previousStates);

    }
}


function initialiseElements(){
    elements = [];
    for (let i=0; i<N; i++){
        let theta = -i*2*PI/N
        let r = 120;
        let x = width/2 + r * cos(theta);
        let y = width/2 + r * sin(theta);
        // choosing the connections at random
        let connections = []
        let options = []
        // list of potential connection indices
        for (let j = 0; j < N; j++){
            options.push(j);     
        }
        // select at randon from the list
        for (let j = 0; j < K; j++){
            let choiceIndex = int(random(0, options.length));
            let choice = options[choiceIndex];
            options.splice(choiceIndex,1);
            connections.push(choice);    
        }
        // add element objects to array
        elements.push(new Element(random([0, 1]), 1, connections, createVector(x,y)));
    }
}


function generatePermutations(){
    // generate permutations
    permutations = [];
    for (let i = 0; i < 2**K; i++){
        let binary = i.toString(2);
        let diff = K - binary.length;
        if (diff > 0){
            for (let j = 0; j < diff; j++){
                binary = "0" + binary;
            }          
        } 
        permutations.push(binary);
    }
}


function mouseClicked() {
    for (let e of elements){
        e.checkMouse();
    }
    //update();
}

function reset(){
    N = int(setN.value());
    K = int(setK.value());
    if (N > 35){
        N = 35;
        setN.value(35);
    }
    if (K > N){
        K = N;
        setK.value(N);
    }
    if (K > 12){
        K = 12;
        setK.value(12);
    } 
    initialiseElements();
    generatePermutations();

}