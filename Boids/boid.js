class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.perceptionRadius = 50;
        this.acceleration = createVector();
        this.maxForce = 0.1;
        this.maxSpeed = 5;
    }

    vision(boids) {
        let visableBoids = [];
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < this.perceptionRadius) {
                visableBoids.push(other);
            }
        }
        return visableBoids;
    }

    flocking(boids) {
        let visableBoids = this.vision(boids);
        if (!(visableBoids.length == 0)) {
            this.align(visableBoids);
            this.seperate(visableBoids);
            this.cohise(visableBoids);
        }
    }


    seperate(visableBoids) {
        let steering = createVector();
        for (let other of visableBoids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            let displacement = p5.Vector.sub(this.position, other.position);
            displacement.setMag(map(d, 0, this.perceptionRadius, this.maxSpeed, 0));
            steering.add(displacement);
        }
        steering.div(visableBoids.length);
        steering.limit(this.maxForce * 3);
        this.applyForce(steering);
    }

    align(visableBoids) {
        let steering = createVector();
        for (let other of visableBoids) {
            steering.add(other.velocity)
        }   
        // Normalize
        steering.div(visableBoids.length);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
        this.applyForce(steering);
    }

    cohise(visableBoids) {
        let target = createVector();
        for (let other of visableBoids) {
            target.add(other.position);
        }
        // Normalise 
        target.div(visableBoids.length);
        let desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);
        let steering = p5.Vector.sub(desired, this.velocity);      
        steering.limit(this.maxForce);
        this.applyForce(steering);
    }

    
    show() {
        let theta = this.velocity.heading() + PI/2;
        fill(153, 79, 0);
        stroke(102, 53, 0);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        let r = 3;
        vertex(0, -r * 2);
        vertex(-r, r * 2);
        vertex(r, r * 2);
        endShape(CLOSE);
        pop();
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    edges() {
        if (this.position.x < 0) this.position.x = width;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.y > height) this.position.y = 0;
    }

    repelEdges() {
        
        let repuls;
        let mag = 0.4;
        if (this.position.x < bound) {
            repuls = createVector(mag, 0);
            this.applyForce(repuls);
        }
        if (this.position.x > width - bound) {
            repuls = createVector(-mag, 0);
            this.applyForce(repuls);
        }
        if (this.position.y < bound) {
            repuls = createVector(0, mag);
            this.applyForce(repuls);
        }
        if (this.position.y > height - bound) {
            repuls = createVector(0, -mag);
            this.applyForce(repuls);
        }  
        
    }

    attract() {
        let mouse = createVector(mouseX, mouseY);
        let desired = p5.Vector.sub(mouse, this.position);
        desired.setMag(this.maxSpeed);
        let steering = p5.Vector.sub(desired, this.velocity);
        steering.limit(this.maxForce * 2);
        this.applyForce(steering);

        drawCrosshair();
    }
}