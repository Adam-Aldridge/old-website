

class YPestis {
   
    constructor(loc, vel, typ) {
        this.location = loc;
        this.velocity = vel;
        this.type = typ;   
        this.radius = 3;
        this.waitsM = []; //count downs to absorption by particular macrophages
        this.waitsN = [];
        this.overlappingMphs = []; // macrophages that are overlaped with (correspond to wait times)
        this.overlappingNeuts = [];
        this.absorbed = false;
    }
    

    update() {
        if (fancyRendering) {
            this.velocityNoise(); // creates a josstling element to movement 
        }      
        this.location.add(this.velocity); // moves macrophage across screen   
    }


    checkAbsorbed() {
        this.handleAbsorptionMphs(); // manages potential absorptions 
        this.handleAbsorptionNeuts();  
    }


    bigStep() {
        let bigMove = createVector(this.velocity.x, this.velocity.y).mult(60);
        this.location.add(bigMove);
        this.checkEdges();
    }
    

    instantiateLeuko(leuko) {
      /* (same as in macrophage Gilespie calculations) multiplies with outputed
       wait time to make animation appear reasonable (would be too fast otherwise) */
      let slowDownFactor = 200;  
      // standard Gillespie algorithm wait time calculation
      let U = random(1);
      let absorbRate;
      if (leuko.type == 'macrophage') {
        
        absorbRate = alphaM;
      } else {
        absorbRate = alphaN;
      }
      let wait = -log(U)/absorbRate;
      
      if (leuko.type == 'macrophage') {
        // instantiates wait time variable 
        this.waitsM.push(floor(slowDownFactor * wait));
        
        // links relevant macrophage
        this.overlappingMphs.push(leuko);
      } else {
        this.waitsN.push(floor(slowDownFactor * wait));
        this.overlappingNeuts.push(leuko);
      } 
    }


    handleAbsorptionMphs() {
      // code to manage potential absorptions
      if (this.waitsM.length > 0) {
        for (let i = this.waitsM.length - 1; i >= 0; i--) {
            let m = this.overlappingMphs[i];
            if (m.checkOverlap(this.location, this.radius)) { // macrophage still overlapping
                if (this.waitsM[i] == 0) { // countdown timer has finished
                    // initiate absorption event
                    m.YPa++;
                    m.updateRates();
                    m.getWaitTime();  
                    if (fancyRendering) {
                        // handles absorption animation
                        bacterialImages.push(new YPImage(this.location, this.velocity, this.type, m));
                    }      
                    // taggs this bacteria for removal
                    this.absorbed = true
                } else { // countdown timer has not finsihed
                    this.waitsM[i]--;
                }

            } else { // macrophage no longer overlapping
                this.overlappingMphs.splice(i,1);
                this.waitsM.splice(i,1);
            }
        }
      }
    }


    handleAbsorptionNeuts() {
        // code to manage potential absorptions
        if (this.waitsN.length > 0) {
          for (let i = this.waitsN.length - 1; i >= 0; i--) {
              let n = this.overlappingNeuts[i];
              if (n.checkOverlap(this.location, this.radius)) { // macrophage still overlapping
                  if (this.waitsN[i] == 0) { // countdown timer has finished
                      // initiate absorption event
                      n.YPa++;
                      n.updateRates();
                      n.getWaitTime();  
                      if (fancyRendering) {
                          // handles absorption animation
                          bacterialImages.push(new YPImage(this.location, this.velocity, this.type, n));
                      }      
                      // taggs this bacteria for removal
                      this.absorbed = true
                  } else { // countdown timer has not finsihed
                      this.waitsN[i]--;
                  }
  
              } else { // macrophage no longer overlapping
                  this.overlappingNeuts.splice(i,1);
                  this.waitsN.splice(i,1);
              }
          }
        }
    }


    display() { 
        let alph;
        if (fancyRendering) {
            if (this.overlappingMphs.length == 0) {
                alph = 200;
            } else {
                alph = 150;
            }  
        } else {
            alph = 255;
        }
           
        // blue circles
        if (this.type == 'a') {
            fill(100,100,200, alph);
            stroke(50,50,150, alph);
        // red circles
        } else if (this.type == 'b') {
            fill(200,100,100, alph);
            stroke(150,50,50, alph);
        }
        strokeWeight(1);
        circle(this.location.x, this.location.y, this.radius*2);   
    }

    velocityNoise() {
        let nudgeDir = random(-2*PI, 2*PI);
        let nudgeMag = 0.1;
        this.velocity.add(createVector(nudgeMag * cos(nudgeDir), nudgeMag * sin(nudgeDir)));
        if (this.velocity.mag() > 0.6) {
            this.velocity.mult(0.9);
        }
    }


    checkEdges() {
        if (this.location.x > margin + activeWidth + this.radius) {
            this.location.x = margin - this.radius;
        } else if (this.location.x < margin - this.radius) {
            this.location.x = margin + activeWidth + this.radius;
        } else if (this.location.y > margin + activeHeight +this.radius) {
            this.location.y = margin - this.radius;
        } else if (this.location.y < margin - this.radius) {
            this.location.y = margin + activeHeight + this.radius;
        }
    }
}
    



















class YPImage {
   
    constructor(loc, vel, typ, macrophage) {
        this.location = loc;
        this.velMph = macrophage.velocity;
        this.type = typ;   
        this.radius = 3;
        this.opacity = 250;      
    }
    
    
    update() {  
        this.location.add(this.velMph); // moves bacterial image with macrophage 
        this.opacity -= 15;
    }
    

    display() { 
        let pertMag = random(0.5);
        let pertAng = random(-2*PI, 2*PI);
        // blue circles
        if (this.type == 'a') {
            fill(100,100,200, this.opacity);
            stroke(50,50,150, this.opacity);
        // red circles
        } else if (this.type == 'b') {
            fill(200,100,100, this.opacity);
            stroke(150,50,50, this.opacity);
        }
        strokeWeight(1);
        circle(this.location.x + pertMag*cos(pertAng), this.location.y + pertMag*sin(pertAng), this.radius*2);   
    }  
}