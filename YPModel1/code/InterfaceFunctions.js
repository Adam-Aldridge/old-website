
//
//let entityPanelCol = color(198, 183, 83);



let boxWid = 160;
let renderTextTimer = 0;
let graphicsTextTimerOn = 0;
let graphicsTextTimerOff = 0;
let dynamicRenderTextTimerOn = 0;
let dynamicRenderTextTimerOff = 0;

function displayBackPanels() {
    let entityPanelCol = color(110,80,80);
    let mainPanelCol = color(80,60,60);
    let backCol = color(77, 0, 0);

    background(backCol);
    //background(backCol);

    fill(109, 60, 60);
    rect(margin, margin, activeWidth, activeHeight);
    fill(mainPanelCol);
    noStroke();
    rect(3 * margin + activeWidth, 2/3*margin, activeWidth, activeHeight/2 + margin/6 + activeHeight/9); // top graph box
    rect(3 * margin + activeWidth, (activeHeight + 4*margin)/2 - margin/6 + activeHeight/9, activeWidth, (activeHeight)/2+ margin/6 - activeHeight/9 - 2/3*margin); // bottom graph box
    rect(2/3*margin, 3 * margin + activeWidth, 2/3*margin + activeWidth, 90 + 2*margin); // dials
    rect(3 * margin + activeWidth, 3 * margin + activeWidth, 224, 90 + 2*margin);
    
    rect(width - boxWid - margin,  3 * margin + activeWidth, boxWid,90 + 2*margin );

    fill(entityPanelCol);
    rect(width - boxWid , 3 * margin + activeWidth + 5, boxWid - 2*margin, 57 ); // entity count
    textSize(15);
    fill(255);
    let spac = 1.8;
    if (totalEntities >= entityCap) {      
        fill(255,0,0);
        rect(width - boxWid , 3 * margin + activeWidth + 5, boxWid - 2*margin, 57 );
        fill(255);
        text('(partial render)',width - (boxWid/2+margin), activeHeight +(4.3+2*spac)*margin); 
    }
    
    text('Entity count:',width - (boxWid/2+margin), activeHeight +4.6*margin); 
    text(str(totalEntities),width - (boxWid/2+margin), activeHeight +(4.6+spac)*margin);
    textSize(12);
 
    if (graphicsTextTimerOn > 0) {
        renderTextOpacity(graphicsTextTimerOn)
        text('Better graphics: ON',width - (boxWid/2+margin), activeHeight +103); 
        graphicsTextTimerOn -= 0.074;
    }
    if (graphicsTextTimerOff > 0) {
        renderTextOpacity(graphicsTextTimerOff)
        text('Better graphics: OFF',width - (boxWid/2+margin), activeHeight +103); 
        graphicsTextTimerOff -= 0.074;
    }
    if (renderTextTimer > 0) {
        renderTextOpacity(renderTextTimer)
        text('Render cap: '+str(floor(entityCap)),width - (boxWid/2+margin), activeHeight +103); 
        renderTextTimer -= 0.074;
    }
    if (dynamicRenderTextTimerOn > 0) {
        renderTextOpacity(dynamicRenderTextTimerOn)
        text('Dynamic render cap: ON',width - (boxWid/2+margin), activeHeight +103); 
        dynamicRenderTextTimerOn -= 0.074;
    }
    if (dynamicRenderTextTimerOff > 0) {
        renderTextOpacity(dynamicRenderTextTimerOff)
        text('Dynamic render cap: OFF',width - (boxWid/2+margin), activeHeight +103); 
        dynamicRenderTextTimerOff -= 0.074;
    }
}


function renderTextOpacity(timer) {
    if (timer < 5) {
        fill(255, 51 * timer);
    }
}


function displayModelTrim() {
    
    fill(77, 0, 0);
    noStroke();
    rect(0, 0, 2*margin + activeWidth, margin);
    rect(0, margin, margin,  activeHeight);
    rect(margin + activeWidth, margin, margin, activeHeight);
    rect(0, margin + activeHeight, 2*margin + activeWidth, margin);
    fill(80,60,60);
    rect(2/3*margin, 2/3*margin, 2/3*margin + activeWidth, margin/3);
    rect(2/3*margin, margin, margin/3,  activeHeight);
    rect(margin + activeWidth, margin, margin/3, activeHeight);
    rect(2/3*margin, margin + activeHeight, 2/3*margin + activeWidth, margin/3);

}


let baSlider;
let muaSlider;
let bbSlider;
let mubSlider;
let gamSlider;
let delSlider;
let alphaSlider;
let baTextBox;
let muaTextBox;
let bbTextBox;
let mubTextBox;
let gamTextBox;
let delTextBox;
let alphaTextBox;
let gap = 45;
let xshift = 88;

function initiateControls() {
    let buttonCol = color(66, 66, 158);
    let buttonTextCol = color(220);
    
    // initiate buttons
    buttonStart = createButton('Start/Stop');
    buttonStart.parent("YPModel");
    buttonStart.position(margin, activeHeight + 4*margin);
    buttonStart.mousePressed(startStop);
    buttonStart.style('backgroundColor', buttonCol);
    buttonStart.style('borderColor', buttonCol);
    buttonStart.style('color', buttonTextCol);
    buttonStart.size(70, 40);

    buttonReset = createButton('Reset');
    buttonReset.parent("YPModel");
    buttonReset.position(margin, activeHeight + 4*margin + 50);
    buttonReset.mousePressed(resetSketch);
    buttonReset.style('backgroundColor', buttonCol);
    buttonReset.style('borderColor', buttonCol);
    buttonReset.style('color', buttonTextCol);
    buttonReset.size(70, 25);

    buttonRateReset = createButton('Rates');
    buttonRateReset.parent("YPModel");
    buttonRateReset.position(margin, activeHeight + 4*margin + 50 + 26);
    buttonRateReset.mousePressed(resetRates);
    buttonRateReset.style('backgroundColor', buttonCol);
    buttonRateReset.style('borderColor', buttonCol);
    buttonRateReset.style('font-size : 8px');
    buttonRateReset.style('color', buttonTextCol);
    buttonRateReset.size(70, 14);

    // initiate slider objects
    let mul = 6;
    baSlider = createSlider(0, mul*baI, baI, 0.001);
    baSlider.parent("YPModel");
    muaSlider = createSlider(0, mul*muaI, muaI, 0.001);
    muaSlider.parent("YPModel");
    bbSlider = createSlider(0, mul*bbI, bbI, 0.001);
    bbSlider.parent("YPModel");
    mubSlider = createSlider(0, mul*mubI, mubI, 0.001);
    mubSlider.parent("YPModel");
    gamSlider = createSlider(0, mul*gamI, gamI, 0.001);
    gamSlider.parent("YPModel");
    delSlider = createSlider(0, mul*delI, delI, 0.001);
    delSlider.parent("YPModel");
    alphaSlider = createSlider(0, mul*alphaIM, alphaIM, 0.001);
    alphaSlider.parent("YPModel");
    // initiate input boxes under sliders
    baTextBox = createInput(str(baSlider.value()));
    baTextBox.parent("YPModel");
    muaTextBox = createInput(str(muaSlider.value()));
    muaTextBox.parent("YPModel");
    bbTextBox = createInput(str(bbSlider.value()));
    bbTextBox.parent("YPModel");
    mubTextBox = createInput(str(mubSlider.value()));
    mubTextBox.parent("YPModel");
    gamTextBox = createInput(str(gamSlider.value()));
    gamTextBox.parent("YPModel");
    delTextBox = createInput(str(delSlider.value()));
    delTextBox.parent("YPModel");
    alphaTextBox = createInput(str(alphaSlider.value()));
    alphaTextBox.parent("YPModel");
    
    // sets up sliders in their positions and with associated text boxes
    initSlider(baSlider, baTextBox, 0);
    initSlider(muaSlider, muaTextBox, gap);
    initSlider(bbSlider, bbTextBox, 2*gap);
    initSlider(mubSlider, mubTextBox, 3*gap);
    initSlider(gamSlider, gamTextBox, 4*gap);
    initSlider(delSlider, delTextBox, 5*gap);
    initSlider(alphaSlider, alphaTextBox, 6*gap);

    // sets up 'fancy render' checkbox
    fancyRender = createCheckbox('', true);
    fancyRender.parent("YPModel");
    fancyRender.changed(toggleFancy);
    fancyRender.position(width - 34, height - 34);

    // sets up 'fancy render' checkbox
    dynamicRender = createCheckbox('', true);
    dynamicRender.parent("YPModel");
    dynamicRender.changed(toggleDynamRend);
    dynamicRender.position(width -53, height - 34);
    
    // render cap slider
    renderCapSlider = createSlider(0, 100, 100, 0.01);
    renderCapSlider.parent("YPModel");
    renderCapSlider.size(100);
    renderCapSlider.position(width - boxWid + 2, height - 40);
    renderCapSlider.changed(renderSliderChanged);

    // neutrophil button
    buttonNeut = createButton('Neutrophils');
    buttonNeut.parent("YPModel");
    buttonNeut.position(activeWidth + 4*margin, activeHeight + 4*margin);
    buttonNeut.mousePressed(initiateNeurtophils);
    buttonNeut.style('backgroundColor', buttonCol);
    buttonNeut.style('borderColor', buttonCol);
    buttonNeut.style('color', buttonTextCol);
    buttonNeut.size(90, 40);
    

}


// initiates sliders and text boxes controlling  model rates
function initSlider(sliderObject, textBox, x) {
    sliderObject.position(xshift+x,  activeHeight + 4*margin + 25 );
    sliderObject.size(70);
    sliderObject.style('transform: rotate(270deg);');
    textBox.style('font-size', '8px');
    textBox.position(xshift+26+x, activeHeight + 4*margin + 75);
    textBox.size(19, 8);
    textBox.changed(function() {sliderObject.value(str(textBox.value()))});
    sliderObject.changed(function() {textBox.value(str(sliderObject.value()))});
    
}


// draws text next to sliders
function drawSliderText(textIn, gap) {
  push();
  translate( gap + xshift + 19, activeHeight + 4*margin + 36);
  fill(255);
  textSize(13);
  rotate( 3*PI/2 );
  text(textIn, 0,0);
  pop();
}


function drawSliderLabels() {
  drawSliderText('a - birth', 0);
  drawSliderText('a - death', gap);
  drawSliderText('b - birth', 2*gap);
  drawSliderText('b - death', 3*gap);
  drawSliderText('transition', 4*gap);
  drawSliderText('rupture', 5*gap);
  drawSliderText('absorption', 6*gap);
}


function makeRecordForBarCharts() {
    if (frameCount % 20 == 0 && running) {
        // makes a record of how many bacteria there are to produce bar chart
        let singleRecordBact = [extraBCount, intraBCount, extraACount, intraACount];
        historyBact.push(singleRecordBact);
        histSumsBact.push(sum(singleRecordBact));
        if (historyBact.length > bars) {
            historyBact.splice(0, 1); 
            histSumsBact.splice(0, 1); 
        } 
        // makes a record of how many leukocytes there are to produce bar chart
        let singleRecordLeuko = [MphCount, NutCount];
        historyLeuko.push(singleRecordLeuko);
        histSumsLeuko.push(sum(singleRecordLeuko));
        if (historyLeuko.length > bars) {
            historyLeuko.splice(0, 1); 
            histSumsLeuko.splice(0, 1); 
        }   
    }
}



// useful dimensions
let gBoxHeight = (activeHeight)/2 + margin/6;
let LB = gBoxHeight - 5*margin + activeHeight/9;
let LL = gBoxHeight - 5*margin - activeHeight/9 - 2/3*margin;
// draws bar charts on right hand panels
function drawGraphs() {
    // find maximum number entities contributing to a particular bar over the
    // set of all recordings to be displayed. Used for bar scaling
    let maxCountBact = max(histSumsBact);
    let maxCountLeuko = max(histSumsLeuko);
    let barCountBact = historyBact.length
    let barCountLeuko = historyLeuko.length
    
    // bacteria bar charts
    push();
    translate(activeWidth + 6*margin, 11/3*margin)

    fill(255);
    textSize(9); 
    
    let totalBactStr = str(maxCountBact);
    if (barCountBact > 0) {
        text(totalBactStr, -16, 0);
        stroke(20);
        line(2,0,-1 - 1.6*(5 - totalBactStr.length),0);
    }
    
    noStroke();
    fill(250);  
    
    for (let i = 0; i < barCountBact; i++) {

        let C = histSumsBact[i];
        let Lt = C*LB/maxCountBact; // length this

        let thisRecord = historyBact[i];
        let n1 = thisRecord[0] // extra B
        let n2 = thisRecord[1] // intra B
        let n3 = thisRecord[2] // extra A
        let n4 = thisRecord[3] // intra A
    
        let x1 = LB-Lt;
        let x2 = n1*Lt/C + x1;
        let x3 = n2*Lt/C + x2;
        let x4 = n3*Lt/C + x3;

        let l1 = ceil(n1*Lt/C);
        let l2 = ceil(n2*Lt/C);
        let l3 = ceil(n3*Lt/C);
        let l4 = ceil(n4*Lt/C);

        // draws rectangles for bar charts
        //extracellular type b
        fill(230,110,110, 255);
        rect( 2 + (bars-barCountBact+i) * 12,    x1 , margin, l1);
        //intracellular type b
        fill(200,60,60, 255);
        rect( 2 + (bars-barCountBact+i) * 12,    x2 , margin, l2);
        //extracellular type a
        fill(110,110,230, 255);
        rect( 2 + (bars-barCountBact+i) * 12,    x3 , margin, l3);
        //intracellular type a
        fill(60,60,200, 255);
        rect( 2 + (bars-barCountBact+i) * 12,    x4 , margin, l4);
    }

    stroke(20);
    strokeWeight(4);
    line(0, LB, activeWidth - 6*margin, LB);
    line(0, -1*margin, 0, LB);

    pop();

    // leukocyte bar charts
    push();
    translate(activeWidth + 6*margin, 29/6*margin + (activeHeight)/2 + activeHeight/9 )

    fill(255);
    textSize(9); 
    
    let totalLeukoStr = str(maxCountLeuko);
    if (barCountLeuko > 0) {
        text(totalLeukoStr, -16, 0);
        stroke(20);
        line(2,0,-1 - 1.6*(5 - totalLeukoStr.length),0);
    }
    
    noStroke();
    fill(250);  
    for (let i = 0; i < barCountLeuko; i++) {

        let C = histSumsLeuko[i];
        let Lt = C*LL/maxCountLeuko; // length this

        let thisRecord = historyLeuko[i];
        
        let n1 = thisRecord[0] // macrophages 
        let n2 = thisRecord[1] // neutrophils
        
        let x1 = LL-Lt;
        let x2 = n1*Lt/C + x1;
        
        let l1 = ceil(n1*Lt/C);
        let l2 = ceil(n2*Lt/C);
        
        // draws rectangles for bar charts
        fill(80,200,80);
        rect( 2 + (bars-barCountLeuko+i) * 12,    x1 , margin, l1);
        fill(80,200,200);
        rect( 2 + (bars-barCountLeuko+i) * 12,    x2 , margin, l2);
        
    }

    stroke(20);
    strokeWeight(4);
    line(0, LL, activeWidth - 6*margin, LL);
    line(0, -1*margin, 0, LL);

    pop();   
}

