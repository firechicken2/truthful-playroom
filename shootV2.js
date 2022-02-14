//score get
let gooudScore = 0.1;
let rareScore = 1;
let epicScore = 6;
let legendScore = 10;

//range 1~4
let socreHigh = 1.5;
let socreLow = 2.4;

let shoot = false;
let reStart = false;
let arrowCount = 0;

class arrow {
  constructor(name, pos_x, pos_y) {
    this.name = name;
    this.x = pos_x;
    this.y = pos_y;
    this.absX = 0;
    this.absY = 0;
    
    this.arrowVel = 3;
    this.arrowSize = 21;
    this.arrowDis = 0.0;
    
    this.angleStep = 3; 
    this.angleStart = -90;
    this.angle = 0;
    this.angleMax = 180; 
  }
  
  display(){
  
    this.absX = this.x + cos(this.angleStart+this.angle) * (this.arrowDis+this.arrowSize);
    this.absY = this.y + sin(this.angleStart+this.angle) * (this.arrowDis+this.arrowSize);
    stroke(0);
    line(this.x + cos(this.angleStart+this.angle) * (this.arrowDis) ,
         this.y + sin(this.angleStart+this.angle) * (this.arrowDis) ,
         this.absX ,
         this.absY
        );
    
    if(arrowTrig == true && shoot == false){
      this.count();
    }else if(shoot){
      this.run();
    }
  }
  
  run(){ 
    this.arrowDis += this.arrowVel;
  }
  
  count(){
    if(this.angle == 0){
      this.angleStep = abs(this.angleStep);
    }else if(this.angle == this.angleMax){
      this.angleStep = abs(this.angleStep) * -1;
    }
    
    this.angle += this.angleStep;  
  }
  
  reset(){
    this.absX = 0;
    this.absY = 0;
    this.arrowDis = 0.0;    
    this.angleStep = 3; 
    this.angle = 0;
    
    shoot = false;
  }
}

class target {
  constructor(name, pos_x, pos_y) {
    this.name = name;
    this.x = pos_x;
    this.y = pos_y;
    
    this.xMin = 280;
    this.xMax = 300;
    this.xTarget = 300;
    
    this.yMin = 150;
    this.yMax = 250;
    this.yTarget = this.yMax;
    this.yBest = 200;
    
    this.moveX = 0;
    this.moveY = 0;
    
    this.color = 255;
    this.size = 60;
  }
  
  display(){ 
    stroke(0);
    
    this.y = this.y + (this.yTarget - this.y)/30;
    this.count();
    fill(0);
    ellipse(this.x ,this.y ,this.size,this.size); 
    fill(240);
    ellipse(this.x ,this.y ,this.size/4,this.size/4);
    fill(0);  
    ellipse(this.x ,this.yBest ,this.size/4,this.size/4); 
  }
  
  count(){
    if(this.yTarget == this.yMax && abs(this.yTarget - this.y) < 3) {
      this.yTarget = this.yMin;
    } else if(this.yTarget == this.yMin && abs(this.yTarget - this.y) < 3) {
      this.yTarget = this.yMax;
    } 
  }
  
  reset(){
    this.color = 255;
    fill(this.color);
    ellipse(this.x ,this.y ,this.size,this.size); 
    randomSeed(frameCount);
    testTarget.yRangeSet(random(height*1/9, height*3/6), 
                         random(height*3/6, height*8/9));
    console.log("good");
  }
  
  yRangeSet(ymin,ymax){
    this.yMin = ymin;
    this.yMax = ymax;
    this.yTarget = this.yMax;   
    this.yBest = (this.yMin + this.yMax)/2;
  }
}

let testArrow = new arrow('arrow1', 50, 0); 
let testTarget = new target('target1', 300, 150); 
let audio_bonk;

function setup() {
    createCanvas(400, 400);
    
    randomSeed(99);
    angleMode(DEGREES);
    fontSet();
    
    testArrow.y = height/2;
    testTarget.yRangeSet(height*1/4, height*3/4);

    audio_bonk = createAudio('bonk.mp3');
    rareColor = color(65,105,225);
    epicColor = color(187,41,187);
    legendColor = color(255,163,0);
}

function draw() { 
  if(!shoot){
    background(240);
  }else{
    rectMode(CORNER);
    fill(240,10);
    noStroke();
    rect(0,0,width,height);
  }
  
  testArrow.display();
  testTarget.display();
  judge();
  scoreDisplay();
  youAreGooud();

}

let cheat = false;
let arrowTrig = false;

function mousePressed() {
  if(!reStart){
      arrowTrig = true;  
  }
}

function mouseReleased() { 
  if(!reStart){
    shoot = true;
    arrowTrig = false; 
  }
}
//fix phone restart problem
function mouseClicked() {
  if(reStart){
    reStart = false;
    scoreReset();
  }
}

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

function judge(){
  if(arrowCount > 9){return;}

  let d = dist(testArrow.absX,testArrow.absY,testTarget.x,testTarget.y);
  //hit target
  if(d < testTarget.size/2){
    audio_bonk.play();
    //talk shit process
    hit = hitAccuracyCount();
    let _hitLevel = hitLevelCount(hit);
    talkShitTime = 100;
    console.log(_hitLevel);
    //reset
    testTarget.reset();
    testArrow.reset();
    //result check
    scoreAdd(10*_hitLevel);
    scoreRecord(hit);
    //combo check bonus
    comboHitCheck(_hitLevel);
    scoreBonus(comboValue);
    //finished
    NextArrow();
  }

  // out of canvas size
  if(testArrow.absX < 0 || testArrow.absX > 390 || testArrow.absY > 390 || testArrow.absY < 0){
    testArrow.reset();
    scoreRecord(-1.0); 
    //finished
    NextArrow();
  }

  talkShit();
}

let hit = 0;
let talkShitTime = 0;

function hitAccuracyCount(){
  let _m = (testTarget.yMax + testTarget.yMin)/2;
  let _dm = abs(testTarget.y - _m);
  let _am = abs(testTarget.yMax - _m);
  let _lv = _dm / _am;
  let _result = nfc(map(_lv,0,1,1,4),3);

  return _result;
}

function hitLevelCount(_hit){
  let _result =1;
  if(_hit >= socreLow){
    _result = rareScore;
  }else if( socreHigh < _hit && _hit < socreLow){
    _result = epicScore;
  }else if(0 <_hit && _hit <= socreHigh){
    _result = legendScore;
  }else if(_hit == -1){
    //
    _result = -1;
  }else if(_hit == 0){
    //
    _result = 0;
  }
  return _result;
}

let rareColor;
let epicColor;
let legendColor;

function talkShit(){
  if(talkShitTime > 0){
    textStyle(BOLD);
    noStroke();

    let _hitLevel = hitLevelCount(scores[arrowCount-1]);

    if(_hitLevel == rareScore ){
      fill(	rareColor );
      textSize(72);
      text("稀   油", width/2,250);
      textSize(24);
      text(hit, width/2,250 + 24*2);
    }else if( _hitLevel == epicScore ){
      fill(	epicColor );
      textSize(72);
      text("史私", width/2,250);
      textSize(24);
      text(hit, width/2,250 + 24*2);
    }else if(_hitLevel == legendScore ){
      fill(	legendColor );
      textSize(72);
      text("哇 窩 船 說", width/2,250);
      textSize(24);
      text(hit, width/2,250 + 24*2);
    }
    talkShitTime -= 1;
  }
}

let comboValue = 1.0;
function comboHitCheck( _hitLevel){
  if(arrowCount == 0){return;}
  let _pastHitLevel = hitLevelCount(scores[arrowCount-1]);
  if(_hitLevel == _pastHitLevel){
    //1.200002
    let _combuBonus = _hitLevel/10;

    comboValue += _combuBonus;
    //u need round to avoid something wired like 1.1+0.1 = 1.2000000000000002
    comboValue = round(comboValue,1);
    console.log("comboValue");
    console.log(comboValue);
    console.log("combo");
  }else{
    comboValue = 1;
  }
}

let scoreCount = 0;

function scoreAdd(_add){
  scoreCount += _add;
}

function scoreBonus(_bonus){
  scoreCount = scoreCount * _bonus;
  //u need round to avoid something wired like 285.01120000000003
  scoreCount = round(scoreCount,7);
}

function scoreReset(){
  scoreCount = 0;
  scores = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
  arrowCount = 0;
}

let scoreSize = 21;
let rectBtw = 36;

function scoreDisplay(){
  textStyle(NORMAL);
  noStroke();
  fill(0);
  textSize(24);
  text(scoreCount, width/2,50);

  for(let i =0;i<scores.length;i++){
    let _hitLevel = hitLevelCount(scores[i]);
    if(_hitLevel == rareScore){
      fill(	rareColor );
    }else if(_hitLevel == epicScore){
      fill(	epicColor );
    }else if(_hitLevel == legendScore){
      fill(	legendColor );
    }else if(_hitLevel == -1){
      fill(	210 );
    }else if(_hitLevel == 0){
      fill(	255 );
    }

    ellipse(i*rectBtw + width/2 - (scores.length-1)*rectBtw/2,height-scoreSize*1.2,scoreSize,scoreSize);
  }
}

function fontSet(){
  textAlign(CENTER);
  textSize(24);
  textFont('Helvetica');
}

let scores = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];

function scoreRecord( _hit ){
  scores[arrowCount] = _hit
}

function NextArrow(){
  if(cheat){testArrow.x -= 30;}
  if(arrowCount <9){
    arrowCount += 1;
  }else{
    reStart = true; 
  }
}


