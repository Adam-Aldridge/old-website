// Flexible list of macrophage objects
let macrophages; // arrays
let neutrophils; 
let extracellBacteriaA;
let extracellBacteriaB;
let bacterialImages;
let macrophageImages;
let initialN = 20; // initial number of macrophages
let filled = 3; // number of macrophages that start with a Y. pestis bacterium


// initial base rates
let baI = 1; // birth of type a Y. pestis
let muaI = 0.3; // death of type a
let bbI = 0.8; // birth of type b Y. pestis
let mubI = 0.7; // death of type b
let gamI = 0.1; // transition from a to b
let delI = 0.005; // macrophage rupture event
let alphaIM = 2; // absorption rate initial mphs
let alphaIN = 10; // absorption rate initial neuts
// base rates
let ba = baI; // birth of type a Y. pestis
let mua = muaI; // death of type a
let bb = bbI; // birth of type b Y. pestis
let mub = mubI; // death of type b
let gam = gamI; // transition from a to b
let del = delI; // macrophage rupture event
let alphaM = alphaIM; // absorption rate mphs
let alphaN = alphaIN; // absorption rate neuts

let activeWidth = 400; // width of box containing experiment dynamics
let activeHeight = 400; // height of box containing experiment dynamics
let margin = 10; // width of region surrounding active box

let running = true;
let fancyRendering = true;
let dynamicRender = true;
let entityCount;
let entityCap = 3; 
let totalEntities = 0;

// keeps track of historical bacteria counts to make bar charts
let historyBact = [];
let histSumsBact = [];

let historyLeuko = [];
let histSumsLeuko = [];

let bars = 25;

// entity counts to inform process that limits rendering
let extraACount;
let extraBCount; 
let intraACount;
let intraBCount; 
let MphCount;




function setup() {
    
    canvas = createCanvas(840, 550);
    canvas.parent("YPModel");
    
    initiateModel();
    initiateControls();  
}



function draw() {
    // gets rates from user controls
    pullRates();
    // draws rectangular back panals
    displayBackPanels(); 

    if (running) {
        runModel();
    }

    // sets up the counting of entities for puropses including the functioning of a render cap
    initialiseEntityCounts();
    // renders moving components of model: macrophages, extracellular bacteria etc
    displayModel();
    // draws boarder around simultion
    displayModelTrim();
    // records the state of the model every 20 frames for the drawing of bar charts 
    makeRecordForBarCharts();
    // reduces the number of entities that are displayed when the framerate dips below 25
    dynamicRendering();
    // displayes model history in bar charts
    drawGraphs();
    drawSliderLabels();   
}












