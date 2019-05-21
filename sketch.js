let Balls= []; //Array of object balls
let fBall = []; //Array of loaded images of balls

let bgPlayImg; // On game background image
let bgIntro; // Background Image
let GC; //Game controller

let cursorStr; //Cursor path image
let sounds = [];

let imgCursor;
let gameOverImg;

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
    imgCursor  = loadImage(stgs.cursor);
    cursorStr = stgs.cursor;

    sounds[0] = loadSound(stgs.catchMp3);
    sounds[1] = loadSound(stgs.missMp3);
    gameOverImg = loadImage(stgs.gameOverImg);
}
function setup() {

    let cnv = createCanvas(833,411);
    cnv.parent("game");
    frameRate(60);

    noCursor();
    //cursor(cursorStr);
    //cursor(ARROW);

    //We create the balls
    //GC.createBalls(20,50);

    bgPlayImg.loadPixels();
    bgIntro.loadPixels();
    imgCursor.loadPixels();
    gameOverImg.loadPixels();
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

    imageMode(CENTER);

    const texts = select('#idPuntuation');
    texts.html('Best Score: ' + GC.getMaxPuntuation());

    image(imgCursor,mouseX,mouseY);
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
