
boardWidth = 500
boardHeight = 500
bufferWidth = 50
bufferHeight = 50
tileSize = 50
bufferXpx = tileSize*bufferWidth
bufferYpx = tileSize*bufferHeight
totalBuffersX = boardWidth/bufferWidth
totalBuffersY = boardHeight/bufferHeight

targetZoom = 1


class tile {


  constructor(){
    this.redv = rand(0,255)
    this.greenv = rand(0,255)
    this.bluev = rand(0,255)

  }
}

class board {
  constructor(x,y){
    this.board = matrix(x,y);


    for (let x1 = 0; x1 < x; x1++){

      for (let y1 = 0; y1 < y; y1++){

        this.board[x1][y1] = new tile()
      }
    }
    console.log("done initiating")
  }
}


class camera { //camera class is used for the users view area
  constructor(){
    this.x = 0 //global location of top left of screen
    this.y = 0
    this.width = 1500
    this.height = 1000
    this.zoom = 1
    this.zx = 0;
    this.zy = 0;
    this.prevX = 0
    this.prevY = 0
    this.velX = 0
    this.velY = 0
  }
}



class graphicsBuffer{
  constructor(x,y){
    this.buffers = matrix(x,y)
    var x1;
    var y1;
    for (x1 = 0; x1<x; x1++){
      for (y1 = 0; y1 < y; y1++){
        this.buffers[x1][y1] = createGraphics(bufferXpx, bufferYpx)
        this.buffers[x1][y1].background(255)
      }
    }
}}






var graphics;
gameBoard = new board(boardWidth,boardHeight);
playerCam = new camera()


function rand(min,max){
  return(Math.floor(max*Math.random() + min  ))


}

function renderToBuffer(bufferX,bufferY){
  xstart = bufferX * bufferWidth;
  ystart = bufferY * bufferHeight;
  gBuff = graphics.buffers[bufferX][bufferY]; 
  
  for (let x=xstart; x < xstart + bufferWidth; x++){
    for (let y = ystart; y < ystart + bufferHeight; y++){
      relX = x-xstart;
      relY = y-ystart;
      bTile = gameBoard.board[x][y];
      gBuff.fill(bTile.redv,bTile.greenv,bTile.bluev)
      gBuff.rect(relX*tileSize,relY*tileSize,tileSize,tileSize);
    }
  }
}


function getGlobals(x,y){
  x = (x + playerCam.x)/playerCam.zoom
  y = (y + playerCam.y)/playerCam.zoom

  return({x,y})
}


function getBuffer(x,y){ //takes in x,y in screenspace pixels, returns the buffer that falls under, 
  global = getGlobals(x,y)
  //console.log(global)
  x = floor(global.x/bufferXpx)
  y = floor(global.y/bufferYpx)
  return({x,y})
}




function len(x){
  return(x.length());
}


function matrix(x,y){
  out = new Array(x)
  for(var x1=0; x1<x; x1++) {
    out[x1] = new Array(y);
  }
  return(out);
}



function inBufferRange(x,y){
  if (x >= 0 && x < totalBuffersX){
    if (y >= 0&& y < totalBuffersY){
      return(true)
    }
  }
return(false)
}

function drawOnscreenBuffers(){
  topLeft = getBuffer(0,0)
  bottomRight = getBuffer(playerCam.width,playerCam.height)
  //console.log("a")
  for (let x=topLeft.x; x <= bottomRight.x; x++){
    for (let y=topLeft.y; y <= bottomRight.y; y ++){
      if (inBufferRange(x,y) == true){
      buffer = graphics.buffers[x][y]

      newX = bufferXpx*playerCam.zoom
      newY = bufferYpx*playerCam.zoom
      
      image(buffer,x*newX - playerCam.x, y*newY-playerCam.y,newX,newY)
      }
    }


  }



}



function renderAll(){
  //out = 0
  for (let x=0; x < totalBuffersX; x ++){
    
    //out += x  
    for (let y=0; y < totalBuffersY; y ++){
      //console.log(x)
      renderToBuffer(x,y)
     

    }

  }

}

//a=matrix(10,10);
anchorX = 0
anchorY = 0
var anchorCamX;
var anchorCamY;
var drag;

var velX = 0
var velY = 0
function mouseDrag(){
  
 if (mouseIsPressed == true){
  if (drag == false){
    anchorX = mouseX
    anchorY = mouseY
    anchorCamX = playerCam.x 
    anchorCamY = playerCam.y
    drag = true
  } 


  var relPosX = anchorX-mouseX;
  var relPosY = anchorY-mouseY
  playerCam.prevX = playerCam.x
  playerCam.prevY = playerCam.y
  playerCam.x = anchorCamX + relPosX
  playerCam.y = anchorCamY + relPosY
  playerCam.velX = playerCam.prevX-playerCam.x
  playerCam.velY = playerCam.prevY-playerCam.y
 }else{

  playerCam.x -= playerCam.velX
  playerCam.velX *= .8
  playerCam.y -= playerCam.velY
  playerCam.velY *= .8
  drag = false
 }


}
//console.log(matrix(10,10));

function mouseWheel(event) {
  //console.log(event.delta);
  zoom(event.delta)
  if (event.delta <0){
    targetZoom -= 2
  }else{
    targetZoom += 2
  }
  //console.log("aa")
  
  //move the square according to the vertical scroll amount
  // += event.delta;
  //uncomment to block page scrolling
  //return false;
}
function zoom(amount){

  var before = getGlobals(mouseX,mouseY)
  if (amount < 0){
    playerCam.zoom *= 1.05
   

  }else{

    playerCam.zoom *= .95
  }
  var after = getGlobals(mouseX,mouseY)
  deltaX = before.x - after.x
  deltaY = before.y - after.y
  //console.log({deltaX,deltaY})
  playerCam.x += deltaX*playerCam.zoom
  playerCam.y += deltaY*playerCam.zoom
  anchorX = mouseX
  anchorY = mouseY
  anchorCamX = playerCam.x 
  anchorCamY = playerCam.y
  //console.log(before)
  //console.log(after)
}




function mouseClicked() {

//console.log(mouseX)
//console.log(mouseY)
console.log(getGlobals(100,100))
//console.log(getBuffer(mouseX,mouseY))



}
function setup() {
  createCanvas(playerCam.width, playerCam.height);

  noSmooth();
  strokeWeight(5)
  background(100)
  gameBoard.board[0][3] = 1
  graphics = new graphicsBuffer(totalBuffersX,totalBuffersY)
  renderAll()
  

  //renderToBuffer(0,0)
  //image(graphics.buffers[0][0],0,0)
  getBuffer(1,1)
}

function draw() {
  background(0)
  mouseDrag()

  playerCam.zx =playerCam.x * playerCam.zoom
  playerCam.zy =playerCam.y* playerCam.zoom
  drawOnscreenBuffers()
  if (targetZoom != 0){

    zoom(targetZoom)
    targetZoom -= Math.sign(targetZoom)
  }
  //playerCam.x += 1
}

