class Astroid {
    constructor(loc, vel, r, rotSpd) {
        this.underFire = false;
        this.astCol = color(127);
        this.vertices = [];
        this.radius = int(r);
        let numVertices = 4 * this.radius;
        this.health = this.radius;
        this.rotSpeed = rotSpd;
        this.a = 0;
        
        this.location = loc;
        this.velocity = vel;
        
        let noiseMax = 2;
        let seed = random(1, 1000);
        for (let i = 0; i < numVertices; i++) {      
            let a = map(i, 0, numVertices-1, 0, TWO_PI);
            let xoff = map(cos(a)+seed, -1, 1, 0, noiseMax);
            let yoff = map(sin(a)+seed, -1, 1, 0, noiseMax);
            this.vertices[i] = createVector(cos(a), sin(a)).mult(this.radius * (1 + 12*noise(xoff, yoff)));
        }
    }
  

    update() {
        this.location.add(this.velocity);
        this.a += this.rotSpeed;
        if (this.underFire) {
            this.astCol = color(70);
        } else {
            this.astCol = color(100);
        }
        this.underFire = false;
    }
  
    display() {
        push();
        translate(this.location.x, this.location.y);
        rotate(this.a);
        fill(this.astCol);
        strokeWeight(2);
        stroke(0);
        beginShape();
        for (let ver of this.vertices) {
            vertex(ver.x, ver.y);
        }
        endShape();
        pop();
    }
  
    checkBullets(bullets) {
        let record = 10000;
        //int closestPointIndex = -1;
        let toRemove = [];
        // Point on astroid's surface that is closest to bullet
        let closestSurfPoint = createVector(0, 0);
    
        for (let i = bullets.length - 1; i >= 0; i--) {
            // Finds the closest surface point the bullet
            for (let vertex of this.vertices) {
                let vertexLoc = vertex.copy();
                vertexLoc.rotate(this.a);
                vertexLoc.add(this.location);
                // Distance from each surface point to bullet
                let dist1 = dist(bullets[i].location.x, bullets[i].location.y, vertexLoc.x, vertexLoc.y);
                if (dist1 < record) {
                    record = dist1;
                    closestSurfPoint = vertexLoc;
                }
            }
  
            if (debug) this.printDebugLines(closestSurfPoint);   
    
            // Distance from astroid center to astroid surface at point closest to bullet
            let dist2 = dist(this.location.x, this.location.y, closestSurfPoint.x, closestSurfPoint.y);
            // Distance from astroid center to bullet
            let dist3 = dist(this.location.x, this.location.y, bullets[i].location.x, bullets[i].location.y);
            if (dist3 < dist2) {
                this.health -= 1;
                this.underFire = true;
                bullets.splice(i, 1);;
            }
        }
        // // Removes bullets that have found their target
        // for (let b of toRemove) {
        //     bullets.remove(b);
        // }
    }
  
    outOfThreshold() {
        if (this.location.x < -outerThresh || 
            this.location.x > width + outerThresh || 
            this.location.y < -outerThresh ||
            this.location.y > height + outerThresh) {
            return true;
        } else {
            return false;
        }
    }
  
    printDebugLines(closestSurfPoint) {
        stroke(255, 0, 0);
        strokeWeight(10);
        point(closestSurfPoint.x, closestSurfPoint.y);
        point(this.location.x, this.location.y);
        strokeWeight(3);
        line(this.location.x, this.location.y, closestSurfPoint.x, closestSurfPoint.y);
    }
  }