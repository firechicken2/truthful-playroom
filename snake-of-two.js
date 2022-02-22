let ballTwoRun = true;
let ballSize = 30;
let boxSize = 50;

class two_ball{
    constructor(name, pos_x, pos_y) {
        this.name = name;
        this.r = ballSize;
        this.boxR = boxSize;
        this.rotSpeed = 3;

        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 50;
        this.y2 = 0;    
        this.rotX = 0;
        this.rotY = 0;

        this.angle1 = 0 ;
        this.angle2 = 0 ;

        this.lastBallTwoRun = ballTwoRun;
    }

    display(){
        this.run();
        fill(255);
        //ball 1 
        ellipse(this.x1,this.y1,this.r);
        //ball 2
        ellipse(this.x2,this.y2,this.r);
        // text(this.angle2%360,this.x2,this.y2);
    }

    run(){
        // calculate the relate angle and reset the this.angle to start new rotate at right position
        if(this.lastBallTwoRun != ballTwoRun){
            this.angle1 = this.angleReset(this.x1,this.y1,this.x2,this.y2);
            this.angle2 = this.angleReset(this.x2,this.y2,this.x1,this.y1);
            this.lastBallTwoRun = ballTwoRun;
        }
        // rotate process
        if(ballTwoRun){
            this.angle2 = (this.angle2 + this.rotSpeed)%360;
            this.rotX = this.x1;
            this.rotY = this.y1;
            this.x2 = this.rotX + this.boxR * cos(this.angle2); 
            this.y2 = this.rotY + this.boxR * sin(this.angle2);
            
        }else{
            this.angle1 = (this.angle1 + this.rotSpeed)%360;
            this.rotX = this.x2;
            this.rotY = this.y2;
            this.x1 = this.rotX + this.boxR * cos(this.angle1); 
            this.y1 = this.rotY + this.boxR * sin(this.angle1);
        }       
    }

    angleReset(_x1,_y1,_x2,_y2){
        // calculate the relate angle between ballone and balltwo
        let _dx = _x2 - _x1;
        let _dy = _y2 - _y1;
        let _deg = atan2(_dy,_dx);
        _deg = 180+_deg;
        return _deg;
    }

    adjust(_box){
        // adjust the ball position with the closest box 
        if(ballTwoRun){
            this.x1 = _box.x;
            this.y1 = _box.y;
        }else{
            this.x2 = _box.x;
            this.y2 = _box.y;
        }
    }

    clicked(){
        let _ballJustRun = !ballTwoRun;
        let _closestBoxResult = closestBoxGet(_ballJustRun);
        let _closestBox = _closestBoxResult.box;
        _closestBox.clicked();
    }

    reset(){
        // restart the game
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 50;
        this.y2 = 0;    
        this.rotX = 0;
        this.rotY = 0;

        this.angle1 = 0 ;
        this.angle2 = 0 ;
        ballTwoRun = true;
    }
}

class box{
    constructor(name, pos_x, pos_y){
        this.name = name;
        this.x = pos_x;
        this.y = pos_y;
        this.pastX = pos_x;
        this.pastY = pos_y;
        this.resetTime = 100;
        this.resetTimeCount = 0;
        this.InDisplayTime = true;
        this.targetRed = false;

        this.boxSize = boxSize*0.93;
    }

    display(){
        if(this.InDisplayTime){
            fill(255);
            //rect(this.x,this.y,this.boxSize,this.boxSize);
            if(this.targetRed){
                fill(255,0,0);
            }else{
                fill(255);
            }
            ellipse(this.x,this.y,this.boxSize*0.9,this.boxSize*0.9);
        }else{
            this.clickResetCounter();
        }
        // text(this.name,this.x,this.y);
    }

    clicked(){
        this.pastX = this.x;
        this.pastY = this.y;
        //out of canvas
        this.x = -300;
        this.y = -300;
        this.resetTimeCount = this.resetTime;
        this.InDisplayTime = false;
    }

    clickResetCounter(){
        if(this.resetTimeCount > 0){
            this.resetTimeCount -= 1;
        }else{
            this.reset();
            this.InDisplayTime = true;
        }
    }

    reset(){
        this.x = this.pastX;
        this.y = this.pastY;
        //reset reset count
        this.resetTimeCount = 0;
        this.InDisplayTime = true;
    }
}
let lastTargetBox;
function targetBoxSetter(){
    //avoid the same target as last time
    for(let i =0;i<99;i++){
        let _target = round(random(0,boxes.length-1));
        while(boxes[_target] != lastTargetBox){
            boxes[_target].targetRed = true;
            return boxes[_target];
        }
        console.log("same Target");
    }
}

let testTwoBall = new two_ball('tb1', 200, 200); 
let boxes = [];

function setup(){
    createCanvas(400, 500);

    rectMode(CENTER);
    ellipseMode(CENTER);
    angleMode(DEGREES);

    for(let i =0;i<6;i++){
        for(let j = 0;j<6;j++){
            let _box = new box(i+j*4, boxSize*i, boxSize*j); 
            boxes.push(_box);  
        }
    }
    targetBoxSetter();
}

function draw(){
    background(240);
    //400-50*6+50/2
    translate(75,90);
    
    for(let i=0;i<boxes.length;i++){
        boxes[i].display();
    }
    testTwoBall.display();
}


function mouseClicked() {
    // ballTwoRun = !ballTwoRun;
    // judge();
}
function mousePressed() {
    ballTwoRun = !ballTwoRun;
    judge();
}
  function keyPressed() {
    ballTwoRun = !ballTwoRun;
    judge();
}

function judge(){
    // hit Accuracy Count
    let _closestBoxResult = closestBoxGet(ballTwoRun);
    let _closestBox = _closestBoxResult.box;
    let _dMin = _closestBoxResult.dMin;
    // console.log(_dMin);

    //pass or fail
    if(_dMin <= passport ){
        //pass to next box
        passProcess(_closestBox);
        //chech the box is the target or not
        checkBoxTarget(_closestBox);
        // hitLevelCount(_dMin);
    }else{
        testTwoBall.reset();
        for(let i=0;i<boxes.length;i++){
            boxes[i].reset();
        }
        console.log("_closestBox name");
        console.log(_closestBox.name);
        console.log("nope");
    }
}

function passProcess(_clzBox){
    testTwoBall.adjust(_clzBox);
    testTwoBall.clicked();
    // _clzBox.clicked();
}

//range 1~4
let passport = 9;
let socreHigh = 1.5;
let socreLow = 2.4;

function closestBoxGet(_ballTurn){
    let _tx,_ty;
    if(!_ballTurn){
        _tx = testTwoBall.x2;
        _ty = testTwoBall.y2;
    }else{
        _tx = testTwoBall.x1;
        _ty = testTwoBall.y1;
    }
    let _closestBox;
    let _dMin = 999;
    for(let i=0;i<boxes.length;i++){
        let _d = dist(_tx,_ty,boxes[i].x,boxes[i].y);
        if(_d < _dMin){ 
            _dMin = _d;
            _closestBox = boxes[i];
        }
    }
    return {
        'box': _closestBox,
        'dMin': _dMin
      };
}
  
function checkBoxTarget(_clzBox){
    if(_clzBox.targetRed == true){
        //the target box mission complete
        _clzBox.targetRed = false;
        //avoid the same target as last time
        lastTargetBox = _clzBox;
        //hit the target then reset all boxes
        for(let i=0;i<boxes.length;i++){
            boxes[i].reset();
        }
        //set the new target box
        targetBoxSetter();
    }
}