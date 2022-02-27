let ballTwoRun = true;
let ballSize = 30;
let boxSize = 50;
let waitState = true;

let scoreCount = 0;
let scoreBonus = 0;
let stepCount = 0;

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
        this.angleCount = 0;
        this.rotSpeedAdd = 0;
        this.speedBoxCount = 0;
        this.slowBoxCount = 0;

        this.lastBallTwoRun = ballTwoRun;
    }

    display(){
        this.run();
        
        stroke(0);
        fill(bg);
        //ball 1 
        ellipse(this.x1,this.y1,this.r);
        //ball 2
        ellipse(this.x2,this.y2,this.r);

    }

    run(){
        // calculate the relate angle and reset the this.angle to start new rotate at right position
        if(this.lastBallTwoRun != ballTwoRun){
            this.angleCount = 0;
            this.angle1 = this.angleReset(this.x1,this.y1,this.x2,this.y2);
            this.angle2 = this.angleReset(this.x2,this.y2,this.x1,this.y1);
            this.lastBallTwoRun = ballTwoRun;
        }
        // rotate process
        if(ballTwoRun){
            this.angleCount += (this.speedBoxCount >= 0 ) ? this.rotSpeed * (1 + this.rotSpeedAdd*1.0) : this.rotSpeed * (1 - this.rotSpeedAdd*1.0) ;
            let _a = (this.angle2 + this.angleCount)%360;
            this.rotX = this.x1;
            this.rotY = this.y1;
            this.x2 = this.rotX + this.boxR * cos(_a); 
            this.y2 = this.rotY + this.boxR * sin(_a);
            
        }else{
            this.angleCount += (this.speedBoxCount >= 0 ) ? this.rotSpeed * (1 + this.rotSpeedAdd*1.0) : this.rotSpeed * (1 - this.rotSpeedAdd*1.0) ;
            let _a = (this.angle1 + this.angleCount)%360;
            this.rotX = this.x2;
            this.rotY = this.y2;
            this.x1 = this.rotX + this.boxR * cos(_a); 
            this.y1 = this.rotY + this.boxR * sin(_a);
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
        this.angleCount = 0;
        this.rotSpeedAdd = 0;
        this.speedBoxCount = 0;
        this.slowBoxCount = 0;

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
        this.resetTime = 1;
        this.resetTimeCount = 0;
        this.InDisplayTime = true;
        this.target = 0;

        this.boxSize = boxSize*0.93;
    }

    display(){
        if(this.InDisplayTime){
            fill(255);
            //rect(this.x,this.y,this.boxSize,this.boxSize);
            noStroke();
            if(this.target == 1){
                fill(240,70,100);
            }else if(this.target == 2){
                fill(120,150,240);
            }else if(this.target == 3){
                fill(100,200,150);
            }else{
                fill(255);
            }
            ellipse(this.x,this.y,this.boxSize*0.9,this.boxSize*0.9);
        }else{
            //this.clickResetCounter();
        }
        // text(this.name,this.x,this.y);
    }

    clicked(){
        this.pastX = this.x;
        this.pastY = this.y;
        //out of canvas
        this.x = -300;
        this.y = -300;
        this.target = 0;
        this.resetTimeCount = this.resetTime + scoreCount ;
        this.InDisplayTime = false;
    }

    clickResetCounter(){
        if(this.resetTimeCount > 0){
            this.resetTimeCount -= 1;
            if(this.resetTimeCount == 0){
                this.reset();
                this.InDisplayTime = true;
            }
        }
        
    }

    reset(){
        this.x = this.pastX;
        this.y = this.pastY;
        //reset reset count
        this.resetTimeCount = 0;
        this.InDisplayTime = true;
    }

    targetFastSlowBoxSetter(){
        this.target = 0;
        let _r = random(0,100);
        if(_r < scoreCount){
            this.target = 2;
        }else if(_r > 100-scoreCount){
            this.target = 3;
        }
        
    }
}
let lastTargetBox;
function targetBoxSetter(){
    //avoid the same target as last time
    for(let i =0;i<99;i++){
        let _target = round(random(0,boxes.length-1));
        //boxes[_target] != lastTargetBox  :: change the target not same as last time
        //boxes[_target].name != 0 :: the first box for reborn twoball 
        while(boxes[_target] != lastTargetBox && boxes[_target].name != 0 && boxes[_target].InDisplayTime == true){
            boxes[_target].target = 1;
            return boxes[_target];
        }
        console.log("same Target");
    }
}

let testTwoBall = new two_ball('tb1', 200, 200); 
let boxes = [];
let bg;

function setup(){
    createCanvas(400, 500);
    bg = color(240);

    rectMode(CENTER);
    ellipseMode(CENTER);
    angleMode(DEGREES);

    for(let i =0;i<6;i++){
        for(let j = 0;j<6;j++){
            let _box = new box(i+j*4, boxSize*i, boxSize*j); 
            _box.targetFastSlowBoxSetter();
            boxes.push(_box);  
        }
    }
    targetBoxSetter();
    copyState();
}

function draw(){
    background(240);
    //score
    fill(0);
    noStroke();
    textAlign(CENTER);
    text(scoreCount*10 + scoreBonus*2,width/2,30);

    //box array and ball
    //400-50*6+50/2
    translate(75,90);
    for(let i=0;i<boxes.length;i++){
        boxes[i].display();
    }
    testTwoBall.display();

    //talk shit
    translate(-75,-90);
    youAreGooud();

    //show waitstate
    // lifeProcess();
    youMustGo();
    if(waitState){
        fill(0);
        textSize(12);
        textStyle(NORMAL);
        noStroke();
        text("READY",width/2, 45);
    }else{
        fill(0);
        textSize(12);
        textStyle(NORMAL);
        noStroke();
        text("GO",width/2, 45);
    }

    //update version
    fill(204);
    textSize(12);
    textStyle(NORMAL);
    noStroke();
    text("v22022801",width/2, height-24);
}

let reStart = false;

function youAreGooud(){
    if(reStart){
      textStyle(BOLD);
      noStroke();
      textSize(72);
      fill(frameCount*3%255,frameCount*3%512,frameCount*3%765);
      text("打 的 不 錯", width/2,250);
      textSize(15);
      fill(204);
      text("click to restart", width/2,295);
    }
  }

function pressProcess(){
    if(reStart){
        waitState = true;
        reStart = false;
        failProcess();
    }else{
        waitState = false;
        ballTwoRun = !ballTwoRun;
        judge();
        stepCount += 1;
        console.log(stepCount);
    }
}

function  mousePressed (event )  {
    //in p5 js mobile touch event got two retrun : mousedown and touchstart
    // use mousedown for both mobile and pc work but hack 
    if  ( event.type  ==  'mousedown' ){
        // click action 
        pressProcess();
    }
}

  function keyPressed() {
    pressProcess();
}

function judge(){
    for(let i=0;i<boxes.length;i++){
        boxes[i].clickResetCounter();
    }

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
        let _save = checkBoxTarget(_closestBox);
        // save
        if(_save){ copyState();}
    }else{
        //fail
        console.log("nope");
        if(stepCount>1){ 
            reStart = true;
        }else{
            failProcess();
        }
    }
}

function passProcess(_clzBox){
    testTwoBall.adjust(_clzBox);
    testTwoBall.clicked();
    // _clzBox.clicked();
}

function failProcess(){
    stepCount = 0;
    scoreCount = 0;
    scoreBonus = 0;
    testTwoBall.reset();
    for(let i=0;i<boxes.length;i++){
        boxes[i].reset();
        boxes[i].targetFastSlowBoxSetter();
    }
    targetBoxSetter();
    console.log("fail");
}

let boxTemp = [];
let ballTemp;
let bonusTemp,stepTemp,ballTwoRunTemp;
function youMustGo(){       
    if(!reStart && !waitState){
        if(testTwoBall.angleCount > 720){
            waitState = !waitState;
            ballTwoRun = ballTwoRunTemp;
            scoreBonus = bonusTemp;
            stepCount = stepTemp;

            boxes = JSON.parse(JSON.stringify(boxTemp)); // 深層
            for(let i = 0;i<boxTemp.length;i++){
                boxes[i].__proto__ = box.prototype;
            }

            testTwoBall = JSON.parse(JSON.stringify(ballTemp)); // 深層
            testTwoBall.__proto__ = two_ball.prototype;

            console.log("get back");
        }
    }
}

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

function copyState(){
    ballTwoRunTemp = ballTwoRun;
    bonusTemp = scoreBonus;
    stepTemp = stepCount;
    
    boxTemp = JSON.parse(JSON.stringify(boxes)); // 深層
    for(let i = 0;i<boxTemp.length;i++){
        boxTemp[i].__proto__ = box.prototype;
    }

    ballTemp = JSON.parse(JSON.stringify(testTwoBall)); // 深層
    ballTemp.__proto__ = two_ball.prototype;
    
    console.log("get copy");
}



//range 1~4
let passport = 18;
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
    if(_clzBox.target == 1){
        //the target box mission complete
        _clzBox.target = 0;
        //avoid the same target as last time
        lastTargetBox = _clzBox;
        //hit the target then reset all boxes
        for(let i=0;i<boxes.length;i++){
            //boxes[i].reset();
            boxes[i].targetFastSlowBoxSetter();
        }
        //set the new target box
        targetBoxSetter();
        //score update
        scoreCount += 1;
        //can wait
        waitState = true;
        //
        return true;
    }else if(_clzBox.target == 2){
        testTwoBall.speedBoxCount += 1;
        testTwoBall.rotSpeedAdd = logChange( 10 , 1+abs(testTwoBall.speedBoxCount));
        console.log("testTwoBall.rotSpeedAdd");
        console.log(testTwoBall.rotSpeedAdd);
        scoreBonus += 1;
    }else if(_clzBox.target == 3){
        testTwoBall.speedBoxCount -= 1;
        testTwoBall.rotSpeedAdd = logChange( 10 , 1+abs(testTwoBall.speedBoxCount));
        console.log("testTwoBall.rotSpeedAdd");
        console.log(testTwoBall.rotSpeedAdd);
        scoreBonus += 1;
    }
    return false;
}

function logChange( _e , _n){
    let _result = log(_n) / log(_e);
    return _result;
}