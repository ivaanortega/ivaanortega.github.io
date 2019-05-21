

class GameController {
    constructor(conf){
        this.state = 0;
        this.puntuation = 0;
        this.numberOfBalls = conf.numberOfBalls;
        this.pointBarHeight = conf.pointBarHeight;
        this.MaxPlayTime = conf.MaxPlayTime;
        this.ActualPlayTime  = 1;
        this.bestScore = 0;
    }

    setBgImage(){
        imageMode(CORNER);
        if(this.state === 0){
            background(bgIntro);
        }else if(this.state === 1){
            background(bgPlayImg);
        }else{
            background(255);
        }
    }

    restart(){
        this.state = 1;
        this.puntuation = 0;
        this.ActualPlayTime = this.MaxPlayTime;
        this.createBalls(20,50);
    }
    gameOver(){
        if(localStorage["puntuation"] === undefined){
            localStorage["puntuation"] = this.puntuation;
        }else{
            if(localStorage["puntuation"] < this.puntuation){
                localStorage["puntuation"] = this.puntuation;
            }
        }

        this.bestScore = localStorage["puntuation"];
        this.state = 2;
    }

    printUI(){
        switch(GC.state){
            case 0:

                break;
            case 1:

                fill(0);
                rect(0,0,width,this.pointBarHeight);
                fill(color(255,0,0));
                rect(0,0,map(this.ActualPlayTime,0,this.MaxPlayTime,0,width), this.pointBarHeight);


                //Score
                textSize(25);
                fill(255);
                stroke(0);
                textAlign(CENTER,CENTER);
                text('Score: ' + this.puntuation, 0, height - 30, width);

                break;
            case 2:

                let margin = 0;
                textSize(70);
                fill(0);
                stroke(0);
                textAlign(CENTER, CENTER);
                text('Game Over', 0, height/4, width);


                textSize(40);
                fill(0);
                stroke(0);
                textAlign(CENTER, CENTER);
                margin += 70;
                text('Your Score: ' + this.puntuation, 0, (height/4) + margin, width);


                textSize(30);
                fill(color(255,0,0));
                stroke(0);
                textAlign(CENTER, CENTER);
                margin += 70;
                text('Best Score: ' + this.bestScore, 0, (height/4) + margin, width);

                textSize(16);
                fill(50);
                stroke(0);
                textAlign(CENTER, CENTER);
                text("Press 'r' to restart! / Press 'm' to return menu!", 0, (height - 30), width);

                break;
        }

    }
    playing(){
        for (let b of Balls) {
            if (b.visible) {
                b.update();
                b.display();
                b.checkBoundaryCollision();
                for (let other of Balls) {
                    if (b !== other && other.visible) {
                        b.checkCollision(other);
                    }
                }

            } else {
                b.checkTime()
            }
        }

        if(this.ActualPlayTime <= 0){
            this.gameOver()
        }else{
            this.ActualPlayTime -= 0.01;
        }

    }

    createBalls(minRadius, maxRadius){
        Balls = [];
        for (let i = 0; i < this.numberOfBalls; i++) {
            //Create the ball in random position keeping in bounds with random size

            //We need to check if the ball collides with other, if its the case we need to recreate
            var Created = false;
            //Do while the ball is not created
            while(!Created){
                var bol = new Ball(random(width), random(height), random(minRadius,maxRadius),fBall);
                var vCreate = true;
                //Check with all the other balls if the new ball collides with any other
                for (let other of Balls) {
                    if (bol !== other ) {
                        if(bol.checkCollisionCreate(other)){
                            vCreate = false;
                        }
                    }
                }
                //If the ball is created, exit he loop
                if(vCreate){
                    Created = true;
                }else{ //If not, recreate the ball with random position
                    console.log("Recreate");
                }
            }

            Balls[i] = bol;
        }
    }

    incrementTime(){
        if(this.ActualPlayTime + 1 >= this.MaxPlayTime ){
            this.ActualPlayTime = this.MaxPlayTime
        }else{
            this.ActualPlayTime += 1;
        }
    }
    decrementTime(){
        if(this.ActualPlayTime -0.05 <= 0 ){
            this.ActualPlayTime = 0;
        }else{
            this.ActualPlayTime -= 0.05;
        }
    }

    incrementScore(value){
        this.puntuation += value;
        this.puntuation = round(this.puntuation);
    }

}
