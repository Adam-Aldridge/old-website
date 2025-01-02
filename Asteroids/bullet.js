
class Bullet {
    constructor(dir, loc, vel, a) {
        this.velocity = dir.setMag(20);
        this.velocity.add(vel);
        this.location = loc;
        // Location of spaceship tip
        this.location.add(createVector(cos(a), sin(a)).mult(shipDim/2));
 
    }
  
    update() {
        this.location.add(this.velocity);
    }
  
    display() {
      strokeWeight(8);
      stroke(0, 100, 255);
      point(this.location.x, this.location.y);
    }
  
    outOfFrame() {
      // Determines wheather bullets are out of frame
      if (this.location.x > width || this.location.x < 0 ||
        this.location.y > height|| this.location.y < 0) {
        return true;
      } else {
        return false;
      }
    }
  }