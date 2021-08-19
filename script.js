const cnv = document.getElementById("breakout");
const ctx = cnv.getContext("2d");


//Object for used images
var BG_IMG = new Image();
BG_IMG.src = "img/bg.png";

var SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

var LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

var LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";



//Objects for sounds
var WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

var PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

var WIN = new Audio();
WIN.src = "sounds/win.mp3";

var LOSE = new Audio();
LOSE.src = "sounds/life_lost.mp3";

var BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";




//Used Constant
let PADDLE_WIDTH=150;
let PADDLE_HEIGHT=20;
let PADDLE_MARGIN_BOTTOM=50
let BALL_RADIUS=10;
let LIFE = 3;
let SCORE_UNIT = 10;
let SCORE=0;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;
let upArrow = false;

//paddle object
let paddle = {
    x: cnv.width/2 - (PADDLE_WIDTH/2),
    y: cnv.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx:5
}

//draw the paddle
function drawPaddle()
{
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Control Paddle
document.addEventListener("keydown", function(event){
    if(event.keyCode==37)
       leftArrow=true;
    else if(event.keyCode==39)
       rightArrow=true;
    else if(event.keyCode==38){// make ball move after clicking the up button
       upArrow=true;
       ball.speed = 5;
       ball.dx = 3*(Math.random()*2-1);
       ball.dy = -3;
    }    
});

document.addEventListener("keyup", function(event){
    if(event.keyCode==37)
       leftArrow=false;
    else if(event.keyCode==39)
       rightArrow=false;    
});


//Move Padlle
function movePaddle()
{
    if(rightArrow && paddle.x + paddle.width < cnv.width)
       paddle.x += paddle.dx;    
    else if(leftArrow && paddle.x > 0)
       paddle.x -= paddle.dx;   
}

// create the ball object
let ball = {
    x: cnv.width/2,
    y: paddle.y - BALL_RADIUS,
    rad: BALL_RADIUS,
    speed : 0,
    dx : 0,
    dy : 0
}

//Draw ball
function drawBall()
{
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.rad, 0, Math.PI*2);

    ctx.fillStyle = "#ffcd05";
    ctx.fill();

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

// move ball
function moveBall()
{
    ball.x += ball.dx;
    ball.y += ball.dy;
}


// BALL AND WALL COLLISION DETECTION
function ballWallCollision()
{
    //Collision with right wall and left wall
    if(ball.x + ball.rad > cnv.width || ball.x - ball.rad < 0)
    {
        ball.dx = -ball.dx;
        WALL_HIT.play();
    }

    //Collision with upper wall
    if(ball.y - ball.rad < 0){
        ball.dy = -ball.dy; 
        WALL_HIT.play();       
    }

    //Collison with base
    if(ball.y + ball.rad > cnv.height){
        LIFE--;
        LOSE.play();        
        resetBall();
        resetPaddle();
        upArrow=false;
        stayBall();
    }
}

// reset the ball it's initial position as it collides with base wall
function resetBall()
{
    ball.x= cnv.width/2,
    ball.y= paddle.y - BALL_RADIUS,
    ball.dx = 5, 
    ball.dy = -5
}


// reset the paddle at it's initial position as it ball collides with base wall
function resetPaddle()
{
    paddle.x= cnv.width/2 - (PADDLE_WIDTH/2),
    paddle.y= cnv.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    paddle.width= PADDLE_WIDTH,
    paddle.height= PADDLE_HEIGHT,
    paddle.dx=5
}

// make ball stay at initian postion
function stayBall()
{
    ball.speed = 0;
    ball.dx = 0;
    ball.dy = 0;
}


// Ball paddle collision detection
function ballPaddleCollision()
{
    if(ball.y + ball.rad > paddle.y &&  ball.x > paddle.x && ball.x < paddle.x + paddle.width )
    {
         PADDLE_HIT.play();

        // + if ball collides right to mid point and - if ball collides left to mid point of paddle 
          let colliPoint = ball.x - (paddle.x + paddle.width/2); 
        
        // Normalize the point
          colliPoint = colliPoint/(paddle.width/2);

        // Angle at which ball return from paddle after collision
          let angle = colliPoint * (Math.PI/3);
          ball.dx = ball.speed * Math.sin(angle);
          ball.dy = -ball.speed * Math.cos(angle);
    }
}

// Brick object
let brick = {
    row:2,
    column:10,
    width:90,
    height:40,
    offSetLeft : 25,
    offSetTop : 20,
    marginTop : 60,
    fillColor : "#2e3548",
    strokeColor : "#FFF"
 }         

// function will create a 2d matrix of bricks with their x and y cordinate
let bricks = [];
function createBricks()
{
for(let r=0; r<brick.row; r++)
{
bricks[r]=[];
for(let c=0; c<brick.column; c++)
{
   bricks[r][c]={
       x: c*(brick.offSetLeft+brick.width) + brick.offSetLeft,
       y: r*(brick.offSetTop+brick.height) + brick.marginTop + brick.offSetTop,
       status: true // true means bricks are not broken yet
   }
}
}
}

createBricks();


//function for drawing the bricks on canvas 
function drawBricks()
{
for(let r=0; r<brick.row; r++)
{
for(let c=0; c<brick.column; c++)
{            
   if(bricks[r][c].status)
   {
       ctx.fillColor = brick.fillColor;
       ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);

       ctx.strokeStyle = brick.strokeColor;
       ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
   }
}
}
}

// for collision between ball and bricks
function ballBrickCollision()
{
for(let r=0; r<brick.row; r++){
for(let c=0; c<brick.column; c++){           
  let b = bricks[r][c];
  if(b.status)
  {
   if(ball.x + ball.rad > b.x && ball.x - ball.rad < b.x + brick.width && ball.y + ball.rad > b.y && ball.y - ball.rad < b.y + brick.height)
   {
           BRICK_HIT.play();
           ball.dy = -ball.dy;
           bricks[r][c].status = false; // the brick is broken
           SCORE += SCORE_UNIT;
   }                
  }
}
}
}

// General function for show image and text => score, life and level images and their values
function showGameStats(text, textX, textY, img, imgX, imgY){
ctx.fillColor = "#FFF";
ctx.font = "35px Germania One";
ctx.fillText(text, textX, textY);

ctx.drawImage(img, imgX, imgY, 35, 35);
}

// function for over the game
function gameOver()
{
if(LIFE <= 0){       
GAME_OVER=true;
showYouLose();
}      
}

//for level up
function levelUp()
{
let isLevelDone = true;
for(let r=0; r<brick.row; r++){
for(let c=0; c<brick.column; c++){
   isLevelDone = isLevelDone && !bricks[r][c].status;
}
}    

if(isLevelDone)
{

WIN.play();
LEVEL++;

if(LEVEL > MAX_LEVEL) {
   GAME_OVER=true;
   showYouWin();
   return;
}

upArrow = false;        
brick.row++;
createBricks();
// ball.speed += 1;
paddle.dx += 4;        
resetBall();
resetPaddle();
stayBall();
}
}




// To draw diffrent structure on canvas
function draw()
{
    drawPaddle();  
    drawBall();
    drawBricks();

    // SHOW SCORE
    showGameStats(SCORE, 50, 35, SCORE_IMG, 10, 5);
    // SHOW LIVES
    showGameStats(LIFE, cnv.width - 25, 35, LIFE_IMG, cnv.width-70, 5); 
    // SHOW LEVEL
    showGameStats(LEVEL+"/3", cnv.width/2, 40, LEVEL_IMG, cnv.width/2 - 40, 5);
}


//update the canvas as button clicked
function update()
{
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp()
}

function loop()
{
    // ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.drawImage(BG_IMG,0,0,cnv.width,cnv.height);
    draw()
    update()
    

    if(! GAME_OVER)
        requestAnimationFrame(loop);// calls the loop function as soon as browser is ready to render the changes
}     

loop();

//Setting the sound of the game
let soundElement = document.getElementById("sound");

soundElement.addEventListener("click", soundManager);

function soundManager()
{
     // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ?  "img/SOUND_OFF.png" :  "img/SOUND_ON.png";
    soundElement.setAttribute("src", SOUND_IMG);

    // MUTE AND UNMUTE SOUNDS
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}



// SHOW GAME OVER MESSAGE

/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU WIN
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}
