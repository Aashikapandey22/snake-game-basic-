let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let snake;
let food;
let dx;
let dy;
let score;
let gameInterval;
let gameSpeed = 120;
let paused = false;
let obstacles = [
{x:100,y:200},
{x:300,y:100},
{x:200,y:300}
];
document.addEventListener("keydown", changeDirection);
function startGame(){
snake = [{x:200,y:200}];
dx = 20;
dy = 0;
score = 0;
gameSpeed = 120;
paused = false;
food = {
x: Math.floor(Math.random()*20)*20,
y: Math.floor(Math.random()*20)*20
};
document.getElementById("score").innerText = score;
document.getElementById("gameOverBox").style.display="none";
clearInterval(gameInterval);
gameInterval = setInterval(gameLoop,gameSpeed);
}
function gameLoop(){
if(paused) return;
moveSnake();
checkCollision();
drawGame();
increaseSpeed();
}
function moveSnake()
{
let head = {x:snake[0].x + dx, y:snake[0].y + dy};
snake.unshift(head);
if(head.x == food.x && head.y == food.y){
score += 10;
document.getElementById("score").innerText = score;
food = {
x: Math.floor(Math.random()*20)*20,
y: Math.floor(Math.random()*20)*20
};
}else{
snake.pop();
}
}
function drawGame()
{
ctx.clearRect(0,0,400,400);
ctx.fillStyle="red";
ctx.fillRect(food.x,food.y,20,20);
ctx.fillStyle="green";
snake.forEach(part=>{
ctx.fillRect(part.x,part.y,20,20);
});
ctx.fillStyle="gray";
obstacles.forEach(o=>{
ctx.fillRect(o.x,o.y,20,20);
});
}
function changeDirection(e){
if(e.key=="ArrowUp" && dy==0){dx=0;dy=-20;}
if(e.key=="ArrowDown" && dy==0){dx=0;dy=20;}
if(e.key=="ArrowLeft" && dx==0){dx=-20;dy=0;}
if(e.key=="ArrowRight" && dx==0){dx=20;dy=0;}
}
function checkCollision(){
let head = snake[0];
if(head.x<0 || head.x>=400 || head.y<0 || head.y>=400){
gameOver();
}
for(let i=1;i<snake.length;i++){
if(head.x==snake[i].x && head.y==snake[i].y){
gameOver();
}
}
obstacles.forEach(o=>{
if(head.x==o.x && head.y==o.y){
gameOver();
}
});
}
function increaseSpeed(){
if(score % 50 == 0 && score !=0){
clearInterval(gameInterval);
gameSpeed -= 10;
if(gameSpeed < 60){
gameSpeed = 60;
}
gameInterval = setInterval(gameLoop,gameSpeed);
}
}
function gameOver(){
clearInterval(gameInterval);
document.getElementById("finalScore").innerText = score;
document.getElementById("gameOverBox").style.display="block";
}
function saveScore(){
let name = document.getElementById("playerName").value;
if(name=="") name="Player";
let scores = JSON.parse(localStorage.getItem("scores")) || [];
scores.push({name:name,score:score});
scores.sort((a,b)=>b.score-a.score);
localStorage.setItem("scores",JSON.stringify(scores));
document.getElementById("playerName").value="";
displayScores();
}
function pauseGame(){
paused = true;
}
function resumeGame(){
paused = false;
}
function displayScores(){
let list = document.getElementById("scoreList");
list.innerHTML="";
let scores = JSON.parse(localStorage.getItem("scores")) || [];
scores.forEach(s=>{
let li = document.createElement("li");
li.innerText = s.name + " - " + s.score;
list.appendChild(li);
});
}
function addComment(){
let input = document.getElementById("commentInput");
let comments = JSON.parse(localStorage.getItem("comments")) || [];
comments.push(input.value);
localStorage.setItem("comments",JSON.stringify(comments));
input.value="";
displayComments();
}
function displayComments(){
let list = document.getElementById("commentList");
list.innerHTML="";
let comments = JSON.parse(localStorage.getItem("comments")) || [];
comments.forEach(c=>{
let li = document.createElement("li");
li.innerText = c;
list.appendChild(li);
});
}
function showSection(id){
document.querySelectorAll(".section").forEach(sec=>{
sec.style.display="none";
});
document.getElementById(id).style.display="block";
if(id=="leaderboard") displayScores();
if(id=="forum") displayComments();
}
