


class Macrophage {
   
    constructor(loc,  vel,  r,  a,  b) {
        this.effectiveRates = []; // rates of events modified to account for number of bacteria present 
        this.death = false;
        let wait; // how many frames should be waited until next event in Gillespie algorithm  
        let rateSum; // sum of effective rates

        this.type = 'macrophage';
        this.location = loc;
        this.velocity = vel;
        this.acceleration = createVector(0, 0);
        this.radius = r; 
        this.YPa = a; // initial number of type a bacteria
        this.YPb = b; // initial type of type b bacteria
        this.multiA = 1;
        this.multiB = 1;
        this.updateRates(); // changes rates accoring to bacteria present
        this.getWaitTime(); // gets initial wait time for Gillespie algorithm
        this.maxVel = 0.15;
        //for perlin noise loops that form irregular macrophage shape
        this.zoff = random(1000); 
        this.phase = random(1000);
        this.xoff2 = random(10000);
        this.noiseMax = 3; // vary for more or less crumpled shapes
        this.render = true;
    };
     

    update() {
        if (fancyRendering) {
          this.movementNoise();
        }

        this.velocity.add(this.acceleration); // used to repel other macrophages
        if (this.velocity.mag() > this.maxVel) {
            this.velocity.setMag(this.maxVel);
        }
        
        this.location.add(this.velocity); // moves macrophage across screen
        
        // manages Gillespie algorithm
        this.gillespie();

        // for perlin noise loops that form iregular macrophage shape
        this.phase += 0.0015;
        this.zoff += 0.005;
        this.xoff2 += 0.01;

        if (this.radius < 30) {
          this.radius = 0.1 * this.YPa + 25;
        }
        if (this.noiseMax > 1) {
            this.noiseMax = -0.0133 * this.YPa + 3;
        }
        
    }
    

    gillespie() {    
      if (this.wait == 0) {
          // if the macrophage can host an event, proceed with Gillespie algorithm
          if (this.rateSum != 0) { 
              
              // choose and execute a single event (choice of which event to execute is based on respective associated effective rates)   
              this.chooseAndExecute();
          }
          // decide how many frames to wait until next event is executed
          this.getWaitTime();
      } else {
          // counts down wait each inactive frame
          this.wait -= 1;
      } 
    }
    

    getWaitTime() {
      let slowDownFactor = 200; // multiplies with outputed wait time to make animation appear reasonable (would be too fast otherwise)
      // standard Gillespie algorithm wait time calculation
      let U = random(1);
      let dt;
      if (this.rateSum != 0) {
        dt = -log(U)/this.rateSum;
      } else {
        // to kickstart the process again if all the rates have been set to 0
        dt = 0.1;
        this.updateRates();
      }
      
      // updates wait time variable appropriately
      this.wait = floor(slowDownFactor * dt);
    }
    

    chooseAndExecute() {     
      // chooses which event to execute based on effective rates
      let event = weightedChoice(this.effectiveRates);
      // carries out execution of chosen event
      this.execute(event);

      // changes multipliers to augment the Gillespie algorithm 
      //this.setMultipliers() 

      // updates rates with respect to new situation (for different number of bacteria etc)
      this.updateRates();
    }


    // not in use
    setMultipliers() {
      // augments the Gillespie algorithms functioning to boost operating speed
      // works by simultaneously reducing event rates and increasing event effects by a common factor 
      // factor scaled by number of present bacteria
      this.multiA = floor(this.YPa/40 + 1);
      this.multiB = floor(this.YPb/40 + 1);
  
    }
    

    execute(event) {
      // executes appropriate event function
      if (event == 0) {
        // divide A
        this.YPa += 1*this.multiA;   
      } else if (event == 1) {
        // kill A
        this.YPa -= 1*this.multiA;
      } else if (event == 2) {
        // divide B
        this.YPb += 1*this.multiB;
      } else if (event == 3) {
        // kill B
        this.YPb -= 1*this.multiB;
      } else if (event == 4) {
        // transition
        this.YPa -= 1*this.multiA;
        this.YPb += 1*this.multiA;
      } else if (event == 5) {
        // apoptosis
        this.death = true;
      }
      // bacterial absorption is managed separately
    }
    
    
    updateRates() {
      // recalculates rates based on YPa & YPb
      this.effectiveRates[0] = this.YPa*ba/this.multiA; // birth type a (all adjusted for quantity of resident bacteria)
      this.effectiveRates[1] = this.YPa*mua/this.multiA; // death type a
      this.effectiveRates[2] = this.YPb*bb/this.multiB; // birth type b
      this.effectiveRates[3] = this.YPb*mub/this.multiB; // death type b
      this.effectiveRates[4] = this.YPa*gam/this.multiA; // transition a to b
      this.effectiveRates[5] = (this.YPa+this.YPb)*del; // rupture
      this.rateSum = sum(this.effectiveRates);  
    }
    
    
    display() { 
      // main circle
      fill(80,200,80);
      strokeWeight(2);
      stroke(0,50,0);
      if (fancyRendering) {
        let radMargin = 0.4;
        let rmax = this.radius*(1 + radMargin);
        let rmin = this.radius*(1 - radMargin);
        this.drawPerlinLoop(this.location.x, this.location.y, rmin, rmax);
      } else {
        circle(this.location.x, this.location.y, this.radius*2); 
      }
      /* // min/max wobble guide
      strokeWeight(0.5);
      stroke(200,0,0);
      noFill();
      circle(this.location.x, this.location.y, rmax*2); 
      circle(this.location.x, this.location.y, rmin*2); 
      */
      // smaller circles
      noStroke();
      let alph = 0.3;
      let op = 255;
      if (fancyRendering) {
        op = 200;
      }
      fill(50,50,180,op);
      ellipse(this.location.x, this.location.y - this.radius/3, this.radius/2 * ( 1 + alph * (str(this.YPa).length - 1)), this.radius/2);
      fill(180,50,50,op);
      ellipse(this.location.x, this.location.y + this.radius/3, this.radius/2 * ( 1 + alph * (str(this.YPb).length - 1)), this.radius/2);   
      // text
      textSize(10);
      textAlign(CENTER, CENTER);
      if (fancyRendering) {
        fill(255,200);
      } else {
        fill(255,200);
      }
      text(str(this.YPa), this.location.x, this.location.y   - this.radius/3);
      text(str(this.YPb), this.location.x, this.location.y   + this.radius/3);  
    }
    
    
    checkApoptosis() { 
      if (this.death) {     
        return true;
      }
      return false;
    }
    
    
    checkEdges() {
      let repulseConst = 0.005;
      if (this.location.x > margin + activeWidth-this.radius) {
        this.velocity.x -= repulseConst;
      } else if (this.location.x < margin + this.radius) {
        this.velocity.x += repulseConst;
      } else if (this.location.y > margin + activeHeight-this.radius) {
        this.velocity.y -= repulseConst;
      } else if (this.location.y < margin + this.radius) {
        this.velocity.y += repulseConst;
      }
    }


    checkCollision(other) {
      if (this.render && other.render) {
          let repulsConst = 0.0001; // controls level of overlapping in a collision 
        // Get distances between the balls components
        let distanceVect = p5.Vector.sub(other.location, this.location);
        // Calculate magnitude of the vector separating the balls
        let distanceVectMag = distanceVect.mag();
        // Minimum distance before they are touching
        let minDistance = this.radius + other.radius;
        if (distanceVectMag < minDistance) {
            // quantity of overlap between macrophages
            let overlap = minDistance - distanceVectMag;     
            let repulseVec = distanceVect;
            // magnitide of repulsion scales linearly with the measure of overlap 
            repulseVec.setMag(pow(overlap, 2) * repulsConst); 
            
            // modifies "other" macrophage acceleration to cause repulsion effect
            other.acceleration.add(repulseVec);
            repulseVec.mult(-1);
            // modifies "this" macrophage acceleration to cause repulsion effect
            this.acceleration.add(repulseVec);
        } 
      }   
    }

    
    checkOverlap(locOther, rOther) {
      let d = dist(locOther.x, locOther.y, this.location.x, this.location.y);
      if (d < rOther + this.radius ) { 
        return true;
      } else {
        return false; 
      }
    }
    
    
    drawPerlinLoop(locX, locY, minRad, maxRad) {
        push();
        translate(locX, locY);
        beginShape();
        for (let a = 0; a < TWO_PI; a += radians(10)) {
          let xoff = map(cos(a + this.phase), -1, 1, 0, this.noiseMax);
          let yoff = map(sin(a + this.phase), -1, 1, 0, this.noiseMax);
          let r = map(noise(xoff, yoff, this.zoff), 0, 1, minRad, maxRad);
          let x = r * cos(a);
          let y = r * sin(a);
          vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    } 


    movementNoise() {
        let theta = map(noise(this.xoff2), 0, 1, -200*PI, 200*PI);
        let ra = 0.0001;
        let x = ra * cos(theta);
        let y = ra * sin(theta);
        let v = createVector(x,y);
        this.acceleration.add(v);
      
    }   
}




















class MacrophageImage {
   
  constructor(loc,  vel,  r, z, p, x2) {
      this.location = loc;
      this.velocity = vel;
      this.acceleration = createVector(0, 0);
      this.radius = r; 
      this.maxVel = 0.15;
      //for perlin noise loops that form irregular macrophage shape
      this.zoff = z; 
      this.phase = p;
      this.xoff2 = x2;
      this.noiseMax = 3; // vary for more or less crumpled shapes
      this.opacity = 200;   
  };
   
  update() {
      this.movementNoise();
      
      this.location.add(this.velocity); // moves macrophage across screen

      // for perlin noise loops that form iregular macrophage shape
      this.phase += 0.0015;
      this.zoff += 0.005;
      this.xoff2 += 0.01;


      let step = 4;
      if (this.radius > 20) {
        this.radius -= 10/800 * pow(step , this.opacity/80);
      }
      if (this.noiseMax < 3.5) {
        this.noiseMax += step * 3/100; 
      }
      this.opacity -= step;    
  }

  
  display() { 
    // main circle
    fill(100,200,100,this.opacity);
    noStroke();
    //circle(this.location.x, this.location.y, this.radius*2); 
    let radMargin = 0.6;
    let rmax = this.radius*(1 + radMargin);
    let rmin = this.radius*(1 - radMargin);
    this.drawPerlinLoop(this.location.x, this.location.y, rmin, rmax);
    }
  

  checkEdges() {
    let repulseConst = 0.005;
    if (this.location.x > margin + activeWidth-this.radius) {
      this.velocity.x -= repulseConst;
    } else if (this.location.x < margin + this.radius) {
      this.velocity.x += repulseConst;
    } else if (this.location.y > margin + activeHeight-this.radius) {
      this.velocity.y -= repulseConst;
    } else if (this.location.y < margin + this.radius) {
      this.velocity.y += repulseConst;
    }
  }


  drawPerlinLoop(locX, locY, minRad, maxRad) {
      push();
      translate(locX, locY);
      beginShape();
      for (let a = 0; a < TWO_PI; a += radians(10)) {
        let xoff = map(cos(a + this.phase), -1, 1, 0, this.noiseMax);
        let yoff = map(sin(a + this.phase), -1, 1, 0, this.noiseMax);
        let r = map(noise(xoff, yoff, this.zoff), 0, 1, minRad, maxRad);
        let x = r * cos(a);
        let y = r * sin(a);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
  } 


  movementNoise() {
      let theta = map(noise(this.xoff2), 0, 1, -200*PI, 200*PI);
      let ra = 0.0001;
      let x = ra * cos(theta);
      let y = ra * sin(theta);
      let v = createVector(x,y);
      this.acceleration.add(v);

      this.velocity.add(this.acceleration); // used to repel other macrophages
      if (this.velocity.mag() > this.maxVel) {
          this.velocity.setMag(this.maxVel);
      } 
  }
}




















// very similar to Macrophage class (lots of sub-optimally repeted code)
class Neutrophil {
   
  constructor(loc,  vel,  r) {
      this.effectiveRates = []; // rates of events modified to account for number of bacteria present 
      this.death = false;
      let wait; // how many frames should be waited until next event in Gillespie algorithm  
      let rateSum; // sum of effective rates

      this.type = 'neutrophil';
      this.location = loc;
      this.velocity = vel;
      this.acceleration = createVector(0, 0);
      this.radius = r; 
      this.YPa = 0; // initial number of type a bacteria

      this.updateRates(); // changes rates accoring to bacteria present
      this.getWaitTime(); // gets initial wait time for Gillespie algorithm
      this.maxVel = 0.15;
      //for perlin noise loops that form irregular macrophage shape
      this.zoff = random(1000); 
      this.phase = random(1000);
      this.xoff2 = random(10000);
      this.noiseMax = 5; // vary for more or less crumpled shapes
      this.render = true;

      this.neutBirth = 0.5;
      this.neutDeath = 1;
      this.neutRupt = 0.001;
  };
   

  update() {
      if (fancyRendering) {
        this.movementNoise();
      }
      this.velocity.add(this.acceleration); // used to repel other macrophages
      if (this.velocity.mag() > this.maxVel) {
          this.velocity.setMag(this.maxVel);
      }
      
      this.location.add(this.velocity); // moves macrophage across screen
      
      // manages Gillespie algorithm
      this.gillespie();

      // for perlin noise loops that form iregular macrophage shape
      this.phase += 0.0015;
      this.zoff += 0.005;
      this.xoff2 += 0.01;

      if (this.radius < 30) {
        this.radius = 0.1 * this.YPa + 25;
      }
      if (this.noiseMax > 1) {
          this.noiseMax = -0.0133 * this.YPa + 3;
      }   
  }
  

  gillespie() {    
    if (this.wait == 0) {
        // if the macrophage can host an event, proceed with Gillespie algorithm
        if (this.rateSum != 0) { 
            
            // choose and execute a single event (choice of which event to execute is based on respective associated effective rates)   
            this.chooseAndExecute();
        }
        // decide how many frames to wait until next event is executed
        this.getWaitTime();
    } else {
        // counts down wait each inactive frame
        this.wait -= 1;
    } 
  }
  

  getWaitTime() {
    let slowDownFactor = 200; // multiplies with outputed wait time to make animation appear reasonable (would be too fast otherwise)
    // standard Gillespie algorithm wait time calculation
    let U = random(1);
    let dt;
    if (this.rateSum != 0) {
      dt = -log(U)/this.rateSum;
    } else {
      // to kickstart the process again if all the rates have been set to 0
      dt = 0.1;
      this.updateRates();
    }
    
    // updates wait time variable appropriately
    this.wait = floor(slowDownFactor * dt);
  }
  

  chooseAndExecute() { 
    // chooses which event to execute based on effective rates
    let event = weightedChoice(this.effectiveRates);
    // carries out execution of chosen event
    this.execute(event);

    // updates rates with respect to new situation (for different number of bacteria etc)
    this.updateRates();
  }

 
  execute(event) {
    // executes appropriate event function
    if (event == 0) {
      // divide A
      this.YPa += 1;
    } else if (event == 1) {
      // kill A
      this.YPa -= 1;
    } else if (event == 2) {
      // divide B
      this.YPb += 1;
    } else if (event == 3) {
      // kill B
      this.YPb -= 1;
    } else if (event == 4) {
      // transition
      this.YPa -= 1;
      this.YPb += 1;
    } else if (event == 5) {
      // apoptosis
      this.death = true;
    }
    // bacterial absorption is managed separately
  }
  
  
  updateRates() {
    // recalculates rates based on YPa 
    this.effectiveRates[0] = this.YPa*this.neutBirth; // birth type a (all adjusted for quantity of resident bacteria)
    this.effectiveRates[1] = this.YPa*this.neutDeath; // death type a
    this.effectiveRates[2] = (this.YPa)*this.neutRupt; // rupture
    
    this.rateSum = sum(this.effectiveRates); 
  }
  
  
  display() { 
    // main circle
    fill(80,200,200);
    strokeWeight(2);
    stroke(0,50,0);
    if (fancyRendering) {
      let radMargin = 0.4;
      let rmax = this.radius*(1 + radMargin);
      let rmin = this.radius*(1 - radMargin);
      this.drawPerlinLoop(this.location.x, this.location.y, rmin, rmax);
    } else {
      circle(this.location.x, this.location.y, this.radius*2); 
    }

    // smaller circles
    noStroke();
    let alph = 0.3;
    let op = 255;
    if (fancyRendering) {
      op = 200;
    }
    fill(50,50,180,op);
    ellipse(this.location.x, this.location.y, this.radius/2 * ( 1 + alph * (str(this.YPa).length - 1)), this.radius/2);
    
    // text
    textSize(10);
    textAlign(CENTER, CENTER);
    if (fancyRendering) {
      fill(255,200);
    } else {
      fill(255,200);
    }
    text(str(this.YPa), this.location.x, this.location.y );
  }


  checkApoptosis() { 
    if (this.death) {     
      return true;
    }
    return false;
  }
  
  
  checkEdges() {
    let repulseConst = 0.005;
    if (this.location.x > margin + activeWidth-this.radius) {
      this.velocity.x -= repulseConst;
    } else if (this.location.x < margin + this.radius) {
      this.velocity.x += repulseConst;
    } else if (this.location.y > margin + activeHeight-this.radius) {
      this.velocity.y -= repulseConst;
    } else if (this.location.y < margin + this.radius) {
      this.velocity.y += repulseConst;
    }
  }


  checkCollision(other) {
    if (this.render && other.render) {
        let repulsConst = 0.0001; // controls level of overlapping in a collision 
      // Get distances between the balls components
      let distanceVect = p5.Vector.sub(other.location, this.location);
      // Calculate magnitude of the vector separating the balls
      let distanceVectMag = distanceVect.mag();
      // Minimum distance before they are touching
      let minDistance = this.radius + other.radius;
      if (distanceVectMag < minDistance) {
          // quantity of overlap between macrophages
          let overlap = minDistance - distanceVectMag;     
          let repulseVec = distanceVect;
          // magnitide of repulsion scales linearly with the measure of overlap 
          repulseVec.setMag(pow(overlap, 2) * repulsConst); 
          
          // modifies "other" macrophage acceleration to cause repulsion effect
          other.acceleration.add(repulseVec);
          repulseVec.mult(-1);
          // modifies "this" macrophage acceleration to cause repulsion effect
          this.acceleration.add(repulseVec);
      } 
    }   
  }

  
  checkOverlap(locOther, rOther) {
    let d = dist(locOther.x, locOther.y, this.location.x, this.location.y);
    if (d < rOther + this.radius ) { 
      return true;
    } else {
      return false; 
    }
  }
  
  
  drawPerlinLoop(locX, locY, minRad, maxRad) {
      push();
      translate(locX, locY);
      beginShape();
      for (let a = 0; a < TWO_PI; a += radians(10)) {
        let xoff = map(cos(a + this.phase), -1, 1, 0, this.noiseMax);
        let yoff = map(sin(a + this.phase), -1, 1, 0, this.noiseMax);
        let r = map(noise(xoff, yoff, this.zoff), 0, 1, minRad, maxRad);
        let x = r * cos(a);
        let y = r * sin(a);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
  } 


  movementNoise() {
      let theta = map(noise(this.xoff2), 0, 1, -200*PI, 200*PI);
      let ra = 0.0001;
      let x = ra * cos(theta);
      let y = ra * sin(theta);
      let v = createVector(x,y);
      this.acceleration.add(v);
  } 
}























































