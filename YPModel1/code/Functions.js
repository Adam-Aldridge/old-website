// function for getting sum of elements in an array
function sum(array) {
    let total = 0;
    for (let item of array) {
        total += item;
    }
    return total
}
  
  
function weightedChoice(rates) {
    // chooses an event randomly weighted by the current effective rates
    let index;
    let bag = [];   
    // add to bag
    for (let i = 0; i < rates.length; i++) {
        let numToAdd = floor(100 * rates[i]);
        for (let j = 0; j < numToAdd; j++) {
            bag.push(i);
        }
    }
    // select at random
    let choicePosition = floor(random(bag.length));
    index = bag[choicePosition];    
    return index;
}


function pullRates() {
  ba = baTextBox.value();
  mua = muaTextBox.value();
  bb = bbTextBox.value();
  mub = mubTextBox.value();
  gam = gamTextBox.value();
  del = delTextBox.value();
  alphaM = alphaTextBox.value();  
}


function startStop() {
  running = !running;
}


function resetSketch() {
  initiateModel()
  renderCapSlider.value(100); 
}


function toggleFancy() {
  fancyRendering = !fancyRendering;
  if (fancyRendering) {
      graphicsTextTimerOn = 10;
      graphicsTextTimerOff = 0;
  } else {
      graphicsTextTimerOff = 10;
      graphicsTextTimerOn = 0;
  }
  renderTextTimer = 0;
  dynamicRenderTextTimerOn = 0;
  dynamicRenderTextTimerOff = 0;
}


function toggleDynamRend() {
  dynamicRender = !dynamicRender;
  if (dynamicRender) {
    dynamicRenderTextTimerOn = 10;
    dynamicRenderTextTimerOff = 0;
  } else {
    dynamicRenderTextTimerOff = 10;
    dynamicRenderTextTimerOn = 0;
  }
  renderTextTimer = 0;
  graphicsTextTimerOn = 0;
  graphicsTextTimerOff = 0;
}


function renderSliderChanged() {
  renderTextTimer = 10;
  graphicsTextTimerOn = 0;
  graphicsTextTimerOff = 0;
  dynamicRenderTextTimerOn = 0;
  dynamicRenderTextTimerOff = 0;
}


function resetRates() {
  // resets sloder values
  baSlider.value(baI);
  muaSlider.value(muaI);
  bbSlider.value(bbI);
  mubSlider.value(mubI);
  gamSlider.value(gamI);
  delSlider.value(delI);
  alphaSlider.value(alphaIM);
  // resets input box values
  baTextBox.value(baI);
  muaTextBox.value(muaI);
  bbTextBox.value(bbI);
  mubTextBox.value(mubI);
  gamTextBox.value(gamI);
  delTextBox.value(delI);
  alphaTextBox.value(alphaIM);
}


function dynamicRendering() {
  if (dynamicRender) {
      if (frameCount % 10 == 0 && running) {

          let currentRendCapSlid = renderCapSlider.value();
          let currentFR = frameRate();
          //console.log(currentFR);
          if (currentFR < 25 && currentRendCapSlid >= 10) {
              renderCapSlider.value(currentRendCapSlid-10);
              renderSliderChanged(); 
          } else if (currentFR > 35 && currentRendCapSlid < 100) {
              renderCapSlider.value(currentRendCapSlid+1); 
              renderSliderChanged();
          }
      }
  }
}







