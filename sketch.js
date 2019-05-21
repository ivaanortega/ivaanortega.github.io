let Balls= []; //Array of object balls
let fBall = []; //Array of loaded images of balls

let bgPlayImg; // On game background image
let bgIntro; // Background Image
let GC; //Game controller

let cursorStr; //Cursor path image
let sounds = [];



function preload(){
    loadJSON('./assets/config.json',carregagt);
}

function carregagt(settings){
    let stgs = settings.stg[0];

    GC = new GameController(stgs);

    for(let i = 0; i < stgs.ballsSrpriteLength; i++){
        fBall[i] = loadImage(stgs.pathBalls.replace("{$i}",i));
    }

    bgPlayImg = loadImage(stgs.bgPlayImg);
    bgIntro = loadImage(stgs.bgIntro);

    cursorStr = stgs.cursor;

    sounds[0] = loadSound('./assets/music/catch.mp3');
    sounds[1] = loadSound('./assets/music/miss2.mp3');
}
function setup() {

    let cnv = createCanvas(833,411);
    cnv.parent("game");
    frameRate(60);

    cursor(cursorStr);
    //cursor(ARROW);

    //We create the balls
    //GC.createBalls(20,50);

    bgPlayImg.loadPixels();
    bgIntro.loadPixels();
}

function draw() {

    GC.setBgImage();

    //cursor(cursorStr);
    switch(GC.state){
        case 0:

            break;
        case 1:
            GC.playing();
            break;
        case 2:

            break;
    }

    GC.printUI();
}

function keyTyped() {
    //cursor(cursorStr);
    if ((key == 'r' || key =='R') && GC.state == 2) {
        GC.restart();
    }
    if ((key == 's' || key =='S') && GC.state == 0) {
        GC.restart();
    }
    if ((key == 'm' || key =='M') && GC.state == 2) {
        GC.state = 0;
    }
    // uncomment to prevent any default behavior
    // return false;
}


function mouseReleased() {
    if(GC.state == 1){
        for (let b of Balls) {
            b.mouseClickCheck();
        }
        if(! sounds[0].isPlaying()){
            sounds[1].play();
        }
    }
}
