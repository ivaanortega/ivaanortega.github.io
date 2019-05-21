class Ball {

    constructor(x, y, r_, img) {
        this.visible = true;
        this.position = new p5.Vector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(3);
        this.radius = r_;
        this.m = this.radius*.1;
        this.actual = img;
        this.actualframe = 0;
        this.frames = this.actual.length;
        this.time1 = 0;

    }

    //Check if th ball has to reapeear, if true, create the ball in empty possition
    checkTime(){
        let time2 = millis() - this.time1;
        //console.log(time2);
        if(time2 >= 2000){
            let vCreate = false;
            while(!vCreate){
                vCreate = true;
                for (let other of Balls) {
                    if (this !== other) {
                        if (this.checkCollisionCreate(other)) {
                            this.position = new p5.Vector(random(width), random(height));
                            this.radius = random(20,30);
                            this.m = this.radius*.1;
                            this.time1 = 0;
                            this.visible = true;
                            vCreate = false;

                        }
                    }
                }
            }
            this.visible = true;
        }
    }

    //update the position of the ball
    update() {
        if(this.visible){
            this.position.add(this.velocity);
        }

    }


    mouseClickCheck() {


        if(this.visible){
            var posMouse = new p5.Vector(mouseX, mouseY);
            // Get distances between the balls components
            if(Math.sqrt((posMouse.x-this.position.x)*(posMouse.x-this.position.x) + (posMouse.y-this.position.y)*(posMouse.y-this.position.y)) < this.radius + 15){
                GC.incrementTime();
                this.time1 = millis();
                this.visible = false;
                GC.incrementScore(map(this.radius,20, 50, 50, 20));
                sounds[0].play();


            }else{
                GC.decrementTime();
            }
        }else{
            GC.decrementTime();
        }

    }

    checkBoundaryCollision() {
        if (this.position.x > width-this.radius) {
            this.position.x = width-this.radius;
            this.velocity.x *= -1;
        } else if (this.position.x < this.radius) {
            this.position.x = this.radius;
            this.velocity.x *= -1;
        } else if (this.position.y   > height-this.radius) {
            this.position.y = height-this.radius;
            this.velocity.y *= -1;
        } else if (this.position.y < this.radius + GC.pointBarHeight) {
            this.position.y = this.radius + GC.pointBarHeight;
            this.velocity.y *= -1;
        }
    }



    checkCollisionCreate(other){
        // Get distances between the balls components
        var distanceVect = p5.Vector.sub(other.position, this.position);

        // Calculate magnitude of the vector separating the balls
        var distanceVectMag = distanceVect.mag();

        // Minimum distance before they are touching
        var minDistance = this.radius + other.radius;

        if (distanceVectMag < minDistance + 50) {
            //The ball has to be recrearted
            return true;
        }
        return false;

    }


    checkCollision(other) {

        // Get distances between the balls components
        var distanceVect = p5.Vector.sub(other.position, this.position);

        // Calculate magnitude of the vector separating the balls
        var distanceVectMag = distanceVect.mag();

        // Minimum distance before they are touching
        var minDistance = this.radius + other.radius;

        if (distanceVectMag < minDistance && this.visible) {
            var distanceCorrection = (minDistance-distanceVectMag)/2.0;
            var d = distanceVect.copy();
            var correctionVector = d.normalize().mult(distanceCorrection);
            other.position.add(correctionVector);
            this.position.sub(correctionVector);

            // get angle of distanceVect
            let theta  = distanceVect.heading();
            // precalculate trig values
            let sine = sin(theta);
            let cosine = cos(theta);

            /* bTemp will hold rotated ball positions. You
             just need to worry about bTemp[1] position*/
            var bTemp = [];
            bTemp[0] = new p5.Vector();
            bTemp[1] = new p5.Vector();

            /* this ball's position is relative to the other
             so you can use the vector between them (bVect) as the
             reference point in the rotation expressions.
             bTemp[0].position.x and bTemp[0].position.y will initialize
             automatically to 0.0, which is what you want
             since b[1] will rotate around b[0] */
            bTemp[1].x  = cosine * distanceVect.x + sine * distanceVect.y;
            bTemp[1].y  = cosine * distanceVect.y - sine * distanceVect.x;

            // rotate Temporary velocities
            var vTemp = [];
            vTemp[0] = new p5.Vector();
            vTemp[1] = new p5.Vector();

            vTemp[0].x  = cosine * this.velocity.x + sine * this.velocity.y;
            vTemp[0].y  = cosine * this.velocity.y - sine * this.velocity.x;
            vTemp[1].x  = cosine * other.velocity.x + sine * other.velocity.y;
            vTemp[1].y  = cosine * other.velocity.y - sine * other.velocity.x;

            /* Now that velocities are rotated, you can use 1D
             conservation of momentum equations to calculate
             the final velocity along the x-axis. */
            var vFinal = [];
            vFinal[0] = new p5.Vector();
            vFinal[1] = new p5.Vector();

            // final rotated velocity for b[0]
            vFinal[0].x = ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (this.m + other.m);
            vFinal[0].y = vTemp[0].y;

            // final rotated velocity for b[0]
            vFinal[1].x = ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + other.m);
            vFinal[1].y = vTemp[1].y;

            // hack to avoid clumping
            bTemp[0].x += vFinal[0].x;
            bTemp[1].x += vFinal[1].x;

            /* Rotate ball positions and velocities back
             Reverse signs in trig expressions to rotate
             in the opposite direction */
            // rotate balls
            var bFinal = [];
            bFinal[0] = new p5.Vector();
            bFinal[1] = new p5.Vector();


            bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
            bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            // update balls to screen position
            other.position.x = this.position.x + bFinal[1].x;
            other.position.y = this.position.y + bFinal[1].y;

            this.position.add(bFinal[0]);

            // update velocities
            this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
            this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
            other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
            console.log("xocat");
        }
    }

    display() {
        imageMode(CENTER);
        if(this.visible){
            image(this.actual[this.actualframe], this.position.x, this.position.y,this.radius*2, this.radius*2);
            this.actualframe = (this.actualframe+1)%this.frames;
        }

        //image(fBall, this.position.x, this.position.y,this.radius*2, this.radius*2);
        //noStroke();
        //fill(this.color);
        //ellipse(this.position.x, this.position.y, this.radius*2, this.radius*2);
    }
}