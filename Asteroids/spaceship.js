class Spaceship {
    constructor() {
        this.a = -PI / 2.0;
        this.rotSpeed = 0.1;
        this.boosting = false;
        this.destroyed = false;
        this.shipPoints = [];
        this.shipPoints[0] = createVector(-shipDim/2, shipDim/2);
        this.shipPoints[1] = createVector(-shipDim/2, -shipDim/2);
        this.shipPoints[2] = createVector(shipDim/4, -shipDim/4);
        this.shipPoints[3] = createVector(shipDim, 0);
        this.shipPoints[4] = createVector(shipDim/4, shipDim/4);

        this.location =      createVector(width/2, height/2); 
        this.velocity =      createVector(0, 0);
        this.acceleration =  createVector(0, 0);
        this.direction =     createVector(cos(this.a), sin(this.a));
    }

  
    update() {
        this.direction = createVector(cos(this.a), sin(this.a));    
        this.location.add(this.velocity);
        this.velocity.add(this.acceleration);
        // Constrains velocity
        if (this.velocity.mag() > 7) this.velocity.setMag(7);
        this.acceleration.mult(0);
    }
  
    display() {
        rectMode(CENTER);
        push();
        translate(this.location.x, this.location.y);
        rotate(this.a); 
        if (this.boosting) {
            this.printExhaust();
        }
        this.boosting = false;
        this.printShip();
        pop();
    }
  
    printShip() {
        stroke(0);
        strokeWeight(2);
        fill(200);
        beginShape();
        for (let i = 0; i < 4; i++) {
            if (i == 2) continue;
            let point = this.shipPoints[i];
            vertex(point.x, point.y);
        }
        endShape();
    }
  
    printExhaust() {
      noStroke();
      fill(255, 200, 0);
      triangle(-shipDim/2-1, shipDim/4, -shipDim/2-1, -shipDim/4, -shipDim, 0);
    }
  
    turnCW() {
        this.a += this.rotSpeed;
    }
    turnCCW() {
        this.a -= this.rotSpeed;
    }
  
    boost() {
        this.direction.mult(0.1);
        this.acceleration = this.direction;
        this.boosting = true;
    }
  
    shoot() {
        bullets.push(new Bullet(this.direction.copy(), this.location.copy(), this.velocity.copy(), this.a));
    }
  
    wrapEdges() {
      if (this.location.x < -40)  this.location.x = width + 40;
      if (this.location.x > width + 40)  this.location.x = -40;
      if (this.location.y < -40) this.location.y = height + 40;
      if (this.location.y > height + 40) this.location.y = -40;
    }
  
    checkCollisions() {
      let record = 10000;
      let closestShipPoint = createVector(0, 0);
      let closestAstPoint  = createVector(0, 0);
      let closestAstroid   = new Astroid();
  
      // Finds the closest astroid surface to the ship
      for (let astroid of astroids) {
        for (let astVertex of astroid.vertices) {
          for (let shipPoint of this.shipPoints) {
            let astVertexC = astVertex.copy();
            let shipPointC = shipPoint.copy();
            astVertexC.rotate(astroid.a);
            astVertexC.add(astroid.location);
            shipPointC.rotate(this.a);
            shipPointC.add(this.location);
  
            let dist1 = dist(shipPointC.x, shipPointC.y, astVertexC.x, astVertexC.y);
            if (dist1 < record) {
              record = dist1;
              closestShipPoint = shipPointC;
              closestAstPoint  = astVertexC;
              closestAstroid = astroid;
            }
          }
        }
      }
  
      // Distance from closest astroid center to closest ship point
      let dist2 = dist(closestAstroid.location.x, closestAstroid.location.y, closestShipPoint.x, closestShipPoint.y);
      // Distance from closest astroid center to closest astroid surface
      let dist3 = dist(closestAstroid.location.x, closestAstroid.location.y, closestAstPoint.x, closestAstPoint.y);
      // If the ship colides with an astroid
      if (dist2 < dist3) {
        this.destroyed = true;
      }
  
      if (debug) this.printDebugLine(closestShipPoint, closestAstPoint);
    }
  
    printDebugLine(closestShipPoint, closestAstPoint) {
      stroke(255, 0, 255);
      strokeWeight(3);
      line(closestShipPoint.x, closestShipPoint.y, closestAstPoint.x, closestAstPoint.y);
    }
  }