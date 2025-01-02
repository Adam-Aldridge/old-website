

function initiateModel() {
    macrophages = [];
    neutrophils = [];
    extracellBacteriaA = [];
    extracellBacteriaB = [];
    bacterialImages = [];
    macrophageImages = []; 
    historyBact = [];
    histSumsBact = [];
    historyLeuko = [];
    histSumsLeuko = [];
    
    initiateMacrophages()
}


function initialiseEntityCounts() {
    extraACount = extracellBacteriaA.length;
    extraBCount = extracellBacteriaB.length;
    intraACount = 0;
    intraBCount = 0;
    MphCount = macrophages.length;
    NutCount = neutrophils.length; 

    entityCount = 0;
    totalEntities = extraACount + extraBCount + MphCount;
    entityCap = floor(pow(renderCapSlider.value(), 2));
}


// Model Running

function runModel() {

    runMacrophages();
    runNeutrophils();
    runBacteria();
    runBactImages()
    runMphImages();
}


// operates the dynamics of macrophages in the simulation
function runMacrophages() {
    
    let toRemove = [];
    // updates the position and activity of macrophages
    for (let i = 0; i < macrophages.length; i++) {
        let m = macrophages[i];
        m.update();     // changes position according to velocity and manages the Gillespie algorithm
        m.checkEdges(); // deals with edge bouncing where necessary
    
        // records macrophages that have died, until the end of this loop, after which, they are removed
        if (m.checkApoptosis()) {
            toRemove.push(i);
        }
    }

    // removes macrophages that are 'tagged' to die
    // and releases resident intracellular bacteria 
    for (let index of toRemove) {
        let deadMacrophage = macrophages[index];
        // Y. pestis bacteria to release into the extracellular enviroment
        let dml = deadMacrophage.location;
        let dmv = deadMacrophage.velocity;
        let dmr = deadMacrophage.radius;
        let YPa = deadMacrophage.YPa;
        let YPb = deadMacrophage.YPb;
        
        // generates bacterial release
        for (let i = 0; i < YPa + YPb; i++) {
            let rad = random(dmr);
            let theta = random(2 * PI);
            let vSpan = 0.4;
            
            let l = createVector(dml.x + rad*cos(theta), dml.y + rad*sin(theta));
            let v = createVector(dmv.x + random(-vSpan, vSpan), dmv.y + random(-vSpan, vSpan)); // can add randomness if wanted
              
            if (i < YPa) {
                extracellBacteriaA.push(new YPestis(l, v, 'a'));
            } else {
                extracellBacteriaB.push(new YPestis(l, v, 'b'));
            }
        }
        if (fancyRendering) {
            macrophageImages.push(new MacrophageImage(dml, dmv, dmr, deadMacrophage.zoff, deadMacrophage.phase, deadMacrophage.xoff2));
        }  
    }
    for (let index of toRemove) {
        macrophages.splice(index, 1);
    }


    // implements colisions between macrophages
    for (let i = 0; i < macrophages.length; i++) {
        thisMph = macrophages[i];
        thisMph.acceleration = createVector(0, 0);
        
        for (let j = 0; j < i; j++) {
            thisMph.checkCollision(macrophages[j]);      
        }
    }  
}





function runNeutrophils() {
    
    let toRemove = [];
    // updates the position and activity of macrophages
    for (let i = 0; i < neutrophils.length; i++) {
        let n = neutrophils[i];
        n.update();     // changes position according to velocity and manages the Gillespie algorithm
        n.checkEdges(); // deals with edge bouncing where necessary
    
        // records macrophages that have died, until the end of this loop, after which, they are removed
        if (n.checkApoptosis()) {
            toRemove.push(i);
        }
    }

    // removes macrophages that are 'tagged' to die
    // and releases resident intracellular bacteria 
    for (let index of toRemove) {
        let deadMacrophage = neutrophils[index];
        // Y. pestis bacteria to release into the extracellular enviroment
        let dnl = deadMacrophage.location;
        let dnv = deadMacrophage.velocity;
        let dnr = deadMacrophage.radius;
        let YPa = deadMacrophage.YPa;
        
        
        // generates bacterial release
        for (let i = 0; i < YPa; i++) {
            let rad = random(dnr);
            let theta = random(2 * PI);
            let vSpan = 0.4;
            
            let l = createVector(dnl.x + rad*cos(theta), dnl.y + rad*sin(theta));
            let v = createVector(dnv.x + random(-vSpan, vSpan), dnv.y + random(-vSpan, vSpan)); // can add randomness if wanted
              
          
            extracellBacteriaA.push(new YPestis(l, v, 'a'));
            
        }
        // if (fancyRendering) {
        //     macrophageImages.push(new MacrophageImage(dml, dmv, dmr, deadMacrophage.zoff, deadMacrophage.phase, deadMacrophage.xoff2));
        // }  
    }
    for (let index of toRemove) {
        neutrophils.splice(index, 1);
    }


    // implements colisions between macrophages
    for (let i = 0; i < neutrophils.length; i++) {
        thisNeut = neutrophils[i];
        thisNeut.acceleration = createVector(0, 0);
        
        for (let j = 0; j < i; j++) {
            thisNeut.checkCollision(neutrophils[j]);            
        }
        for (let k = 0; k < macrophages.length; k++) {
            thisNeut.checkCollision(macrophages[k]);
        }
    }  


}





function runBacteria() {

    for (let ypa of extracellBacteriaA) {
        ypa.checkAbsorbed();
        ypa.checkEdges(); // deals with edge bouncing where necessary
    }
    for (let ypb of extracellBacteriaB) {
        ypb.checkEdges(); // deals with edge bouncing where necessary
    }


    // handles absorption dynamics
    for (let ypaIndex = 0; ypaIndex < extracellBacteriaA.length; ypaIndex++) {
        ypa = extracellBacteriaA[ypaIndex];
        // removes extracellular bacteria from the array if they have already been absorbed
        if (ypa.absorbed == true) { 
            extracellBacteriaA.splice(ypaIndex, 1);
            continue;
        }
        // instantiates macrophage-bacteria overlap relations
        let isOverlappedMph = false;
        for (let m of macrophages) {
            if (m.checkOverlap(ypa.location, ypa.radius)) { 
                isOverlappedMph = true;
                if (ypa.overlappingMphs.includes(m)) { // when the overlap relationship is already instantiated
                    continue;
                } else {
                    ypa.instantiateLeuko(m);
                }
            }
        }
        // removes over lapping macrophages that have ruptured
        if (!isOverlappedMph) {
            ypa.overlappingMphs = [];
            ypa.waitsM = [];
        }
        
        // instantiates neutrophil-bacteria overlap relations
        let isOverlappedNeut = false;
        for (let n of neutrophils) {
            if (n.checkOverlap(ypa.location, ypa.radius)) { 
                isOverlappedNeut = true;
                if (ypa.overlappingMphs.includes(n)) { // when the overlap relationship is already instantiated
                    continue;
                } else {
                    ypa.instantiateLeuko(n);
                }
            }
        }
        // removes over lapping macrophages that have ruptured
        if (!isOverlappedNeut) {
            ypa.overlappingNeuts = [];
            ypa.waitsN = [];
        }

    }
}


// Run Images
function runBactImages() { 
    if (bacterialImages.length > 0) {
        for (let i = bacterialImages.length - 1; i >= 0; i--) {
            let bactIm = bacterialImages[i];
            bactIm.update();
            
    
            if (bactIm.opacity <= 0) {
                bacterialImages.splice(i, 1);
            }
        }
    }   
}

function runMphImages() { 
    if (macrophageImages.length > 0) {
        for (let i = macrophageImages.length - 1; i >= 0; i--) {
            let mphIm = macrophageImages[i];
            mphIm.update();
            
            if (mphIm.opacity <= 0) {
                macrophageImages.splice(i, 1);
            }
        }
    }   
}



// Display BActerial Images


function displayBactImages() { 
    if (bacterialImages.length > 0) {
        for (let bactIm of bacterialImages) {
            bactIm.display();
        }
    }  
}

function displayMphImages() { 
    if (macrophageImages.length > 0) {
        for (let mphIm of macrophageImages) {
            mphIm.display();
        }
    }  
}



// Display

function displayModel() {
    // displays macrophages
    for (let m of macrophages) {
        if (entityCount < entityCap) {
            m.display();    // prints macrophage objects to canvas as circles
            m.render = true;
            entityCount ++;
        } else {
            // prevents collisions with unrendered macrophages
            m.render = false;
        }
        intraACount += m.YPa;
        intraBCount += m.YPb;
    }

    // displays neutrophils
    for (let n of neutrophils) {
        if (entityCount < entityCap) {
            n.display();    // prints macrophage objects to canvas as circles
            n.render = true;
            entityCount ++;
        } else {
            // prevents collisions with unrendered macrophages
            n.render = false;
        }
        intraACount += n.YPa;
    }

    
    // decides how many type a and b bacteria to display based on render cap
    let aLen = extracellBacteriaA.length;
    let bLen = extracellBacteriaB.length;
    let numA;
    let numB;
    if (aLen + bLen <= entityCap) {
        // if render cap is not surpassed
        numA = aLen;
        numB = bLen;
    } else {
        // if render cap is surpassed
        let entityBuget = entityCap - entityCount;
        numB = floor(bLen / (bLen + aLen) * entityBuget);
        numA = entityBuget - numB; 
    }
    
    // renders type a bacteria 
    renderBacteria(numA, extracellBacteriaA);
    // renders type b bacteria
    renderBacteria(numB, extracellBacteriaB);
    

    // updates non rendered bacteria only every 60 frames to increase speed
    if (running) {
        if (frameCount % 60 == 0) {
            for (let i = numA; i < aLen; i++) {
                extracellBacteriaA[i].bigStep();
                //extracellBacteriaA[i].display(); 
            }
            for (let i = numB; i < bLen; i++) {
                extracellBacteriaB[i].bigStep();
                //extracellBacteriaB[i].display(); 
            }
        }
    }
    

    displayBactImages();
    displayMphImages();        
}


function renderBacteria(number, array) {
    for (let i = 0 ; i < number; i++) {
        let yp = array[i];
        if (running) {
            yp.update();
        }
        yp.display(); 
        entityCount ++;    
    }
}










// Initiation 

function initiateMacrophages() {
    // initiates macrophages
    for (let i = 0; i < initialN; i++) {  
        let vSpan = 0.1;  // initial velocity for each macrophage
        let radius = 25;
        let lMargin = radius + 10; // initial minimum distance from origin
        
        // initial location of each macrophage
        /* the following chunk of code is in place to ensure that initial placements
        don't overlap (viability is obviously limited by size of canvas in relation to 
        the number of macrophages and their radii)*/
        let placed = false;
        let l; // placing location
        let iter = 0; // variable to stop while loop running indefinately if placement is not possible
        while (!placed && iter < 50000) {
            l = createVector(random(margin + lMargin, margin + activeWidth-lMargin), random(margin + lMargin, margin + activeHeight-lMargin));
            if (macrophages.length != 0) {
                let overlapped = false;
                for (let m of macrophages) {
                    if (m.checkOverlap(l, radius)) {
                        // if the current choice of location will cause an overlap with a previously placed macrophage
                        overlapped = true;
                        break;
                    } 
                }
                if (overlapped == false) {
                    placed = true;
                } else { 
                    iter += 1;
                    continue;
                }  
            // if this is the first macrophage  
            } else {
                placed = true;
            }
        }
        // once the position of the macrophage is decided on, it is instantiated by the following 
        // initial velocity
        let v = createVector(random(-vSpan, vSpan), random(-vSpan, vSpan));
        
        // adding macrophages with one Y. pestis type a (YPa)
        if (i < filled) {
            macrophages.push(new Macrophage(l, v, radius, 1, 0));
        }
        // adding macrophages with no YPa
        else {
            macrophages.push(new Macrophage(l, v, radius, 0, 0));
        }
    }
}







function initiateNeurtophils() {
    // initiates macrophages
    for (let i = 0; i < 10; i++) {  
        let vSpan = 0.1;  // initial velocity for each macrophage
        let radius = 17;
        let lMargin = radius + 10; // initial minimum distance from origin
        
        // initial location of each macrophage
        /* the following chunk of code is in place to ensure that initial placements
        don't overlap (viability is obviously limited by size of canvas in relation to 
        the number of macrophages and their radii)*/
        let placed = false;
        let l; // placing location
        let iter = 0; // variable to stop while loop running indefinately if placement is not possible
        while (!placed && iter < 50000) {
            l = createVector(random(margin + lMargin, margin + activeWidth-lMargin), random(margin + lMargin, margin + activeHeight-lMargin));
            if (neutrophils.length != 0) {
                let overlapped = false;
                for (let n of neutrophils) {
                    if (n.checkOverlap(l, radius)) {
                        // if the current choice of location will cause an overlap with a previously placed macrophage
                        overlapped = true;
                        break;
                    } 
                }
                if (overlapped == false) {
                    placed = true;
                } else { 
                    iter += 1;
                    continue;
                }  
            // if this is the first macrophage  
            } else {
                placed = true;
            }
        }
        // once the position of the macrophage is decided on, it is instantiated by the following 
        // initial velocity
        let v = createVector(random(-vSpan, vSpan), random(-vSpan, vSpan));
        
        neutrophils.push(new Neutrophil(l, v, radius));
    }   
}



