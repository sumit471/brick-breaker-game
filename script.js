const cnv = document.getElementById("breakout");
const ctx = cnv.getContext("2d");


//Object for used images
var BG_IMG = new Image();
BG_IMG.src = "img/bg.png";





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
