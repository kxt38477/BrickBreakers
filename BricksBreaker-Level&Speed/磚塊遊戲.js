var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");       //渲染canvas 2D繪製

var moveX = 2;  //球往右移動2
var moveY = -2;  //球往上移動2
//定義球
var ballRadius = 10
var x = canvas.width / 2;
var y = canvas.height - 20;

const reX = canvas.width / 2;   //下一關的球起始位置
const reY = canvas.height - 20;

//定義擊槳
var floorHeight = 10;
var floorWidth = 75;
var floorLocation = (canvas.width - floorWidth) / 2;

var floorSpeed = 7;//擊槳速度
var rightPressed = false;
var leftPressed = false;

//磚頭的變量
var brickRowCount = 3;
var brickColumnCount = 8;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickTopPadding = 50;
var brickLeftPadding = 15;
//分數
var score = 0;
//關卡
var level = 1;
//球速
var ballSpeed = 10;

var bricks = []; //磚頭顯示成陣列
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: true }; //定義位置
    }
}


document.addEventListener("keydown", keyDownHandler, false); //當按鍵被按下,做一個名為KeyDownHandler的函數
document.addEventListener("keyup", keyUpHandler, false);     //當按鍵被放開,做一個名為KeyUpHandler的函數
//語法element.addEventListener(event, function, useCapture)

//按下鍵盤
function keyDownHandler(e) {    //當按鍵被按下,rightPressed及leftPressed變為True
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
//放開鍵盤
function keyUpHandler(e) {      //當按鍵被放開
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

//繪製球
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //位置為X,y 半徑為10,從0度角開始畫圓
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    document.getElementById('ballLocation').innerText = "球的位置:(x:" + x + ",y:" + y + ")";
}

//繪製擊槳
floorLocation = (canvas.width - floorWidth) / 2;
function drawFloor() {
    ctx.beginPath();
    ctx.rect(floorLocation, canvas.height - floorHeight, floorWidth, floorHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//擊槳移動
function floorMove() {

    if (rightPressed == true) {     //當條件變為True,平台移動
        floorLocation = floorLocation + floorSpeed;
        if (floorLocation + floorWidth > canvas.width) {
            floorLocation = canvas.width - floorWidth;
        }

    } else if (leftPressed == true) {
        floorLocation = floorLocation - floorSpeed;
        if (floorLocation < 0) {
            floorLocation = 0;
        }
    }
}


//繪製磚頭
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {

            if (bricks[c][r].status == true) {
                var brickX = (c * (brickWidth + brickPadding)) + brickLeftPadding; //座標位置
                var brickY = (r * (brickHeight + brickPadding)) + brickTopPadding;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//繪製分數及等級
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level:" + level, 635, 20);
}


//碰撞偵測
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    moveY = -moveY;
                    b.status = false;
                    score += 2;    //每撞擊一次分數+2
                    gamePassTest();
                }
            }
        }
    }
}


//關卡
var gamePass = false;
function gamePassTest() {

    var BCount = 0;//死亡計數器
    var allBricks = brickColumnCount * brickRowCount// 總磚頭數 

    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var brick = bricks[c][r]
            if (brick.status == false) {
                BCount += 1;
            }
        }
    }
    console.log(`目前破壞了${BCount}個磚頭`);
    //如果沒有全部打完 不會進入if
    if (BCount == allBricks) {
        gamePass = true;
        if (speed > 3) {
            speed -= 3;
        } else {
            alert('YOU WIN!')
        }
    }
}
//復活
function reborn() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            var brick = bricks[c][r];
            brick.status = true;
        }
    }
}
//下一關
function levelUp() {
    if (gamePass == true) {
        level += 1;
        console.log(`第${level}關`);
        x = reX;
        y = reY;
        reborn();
        gamePass = false;
    }
}
//繪製讓球及擊槳移動效果

function draw() {
    levelUp();//檢查是否到下一關
    ctx.clearRect(0, 0, canvas.width, canvas.height); //消除球移動之軌跡
    drawBall();  // 畫球
    drawFloor(); // 畫擊槳
    floorMove(); // 擊槳移動之程式碼
    drawBricks();// 磚頭程式碼
    drawScore();
    drawLevel();
    collisionDetection(); // 磚頭碰撞偵測

    x = x + moveX;
    y = y + moveY;


    if (x + moveX > canvas.width - ballRadius || x + moveX < ballRadius) {  //不讓畫面邊緣吃掉半顆球
        moveX = -moveX;
    }

    if (y + moveY < ballRadius) {
        moveY = -moveY;
    } else if (y + moveY > canvas.height - ballRadius) {  //達成else if的條件之後，在讓程式執行有無碰到平台，如有即回傳遊戲結束
        if (x > floorLocation && x < floorLocation + floorWidth) {
            moveY = -moveY;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);   //停止執行每10毫秒執行一次interval的function
        }
    }

}


var interval = setInterval(draw, ballSpeed);


