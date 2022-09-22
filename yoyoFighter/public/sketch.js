class YoYo{
    constructor(x, y, r, g, b, playerX, playerY){
        this.playerPos = {x: playerX, y: playerY};
        this.pos = {x: x, y: y};
        this.vel = {x: 0, y: 0, max: 20};
        this.acc = {x: 0, y: 0};
        this.rad = 20;
        this.maxLength = 300;
        this.currentLength = 0;
        this._color = {r: r, g: g, b: b};
        this.show = true;
    }

    render(){
        this.movement();
        push();
        fill(this._color.r, this._color.g, this._color.b);
        circle(this.pos.x, this.pos.y, this.rad);
        pop();
    }

    movement(){
        //Add acceleration
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        //Limit speed of character
        let tempV = createVector(this.vel.x, this.vel.y);
        tempV.limit(this.vel.max);
        this.vel.x = tempV.x;
        this.vel.y = tempV.y;

        //Try to add velocity
        let tPosX = this.pos.x + this.vel.x;
        let tPosY = this.pos.y + this.vel.y;


        this.currentLength = sqrt(((tPosX-this.playerPos.x)*(tPosX-this.playerPos.x))+((tPosY-this.playerPos.y)*(tPosY-this.playerPos.y)));
        if(this.currentLength > this.maxLength){
            let tempP = createVector(tPosX-this.playerPos.x, tPosY-this.playerPos.y);
            tempP.limit(this.maxLength);
            tPosX = this.playerPos.x + tempP.x;
            tPosY = this.playerPos.y + tempP.y;
            this.vel = {x: 0, y: 0};
            this.acc = {x: 0, y: 0};
        }

        //Collisions!!!
        if(tPosX-(this.rad/2) >= 0 && tPosX+(this.rad/2) <= width){ //Object Not in way, Move the player there
            this.pos.x = tPosX;
        }
        else{ //Object in way, Don't move the player there and set vel to 0
            this.vel.x = 0;
        }
        if(tPosY-(this.rad/2) >= 0 && tPosY+(this.rad/2) <= height){ //Object Not in way, Move the player there
            this.pos.y = tPosY;
        }
        else{ //Object in way, Don't move the player there and set vel to 0
            this.vel.y = 0;
        }
    }
}

class Player{
    constructor(x, y, r, g, b){
        this.pos = {x: x, y: y};
        this.vel = {x: 0, y: 0, max: 20};
        this.acc = {x: 0, y: 1};
        this._color = {r: r, g: g, b: b};
        this.size = {x: 20, y: 30};
        this.yoyo = new YoYo(this.pos.x, this.pos.y+10, this._color.r-10, this._color.g-10, this._color.b-10, this.pos.x, this.pos.y);
    }

    render(){
        this.movement();
        push();
        line(this.pos.x, this.pos.y, this.yoyo.pos.x, this.yoyo.pos.y);
        fill(this._color.r, this._color.g, this._color.b);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        pop();
        if(this.yoyo.show){
            this.yoyo.render();
        }
    }

    movement(){
        //Set acceleration
        this.takeInput();

        //Add acceleration
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        //Limit speed of character
        let tempV = createVector(this.vel.x, this.vel.y);
        tempV.limit(this.vel.max);
        this.vel.x = tempV.x;
        this.vel.y = tempV.y;

        //Try to add velocity
        let tPosX = this.pos.x + this.vel.x;
        let tPosY = this.pos.y + this.vel.y;

        //Collisions!!!
        if(tPosX >= 0 && tPosX+this.size.x <= width){ //Object Not in way, Move the player there
            this.pos.x = tPosX;
        }
        else{ //Object in way, Don't move the player there and set vel to 0
            this.vel.x = 0;
        }
        if(tPosY >= 0 && tPosY+this.size.y <= height){ //Object Not in way, Move the player there
            this.pos.y = tPosY;
        }
        else{ //Object in way, Don't move the player there and set vel to 0
            this.vel.y = 0;
        }

        this.yoyo.playerPos = this.pos;
    }

    takeInput(){
        //Player Controls
        if(keyIsDown(87)){ //w
            this.acc.y = -1;
        }

        if(keyIsDown(65)){ //a
            this.acc.x = -1;
        }

        if(keyIsDown(83)){ //s
            this.acc.y = 2;
        }

        if(keyIsDown(68)){ //d
            this.acc.x = 1;
        }

        //YoYo Controls
        if(mouseIsPressed){
            if(mouseButton == LEFT){
                let tempA = createVector((mouseX - this.yoyo.pos.x), (mouseY - this.yoyo.pos.y));
                tempA.limit(20);
                this.yoyo.acc.x = tempA.x;
                this.yoyo.acc.y = tempA.y;
                this.yoyo.maxLength = 300;
                
            }
            if(mouseButton == RIGHT){
                let tempA = createVector((mouseX - this.yoyo.pos.x), (mouseY - this.yoyo.pos.y));
                tempA.limit(2);
                this.yoyo.acc.x = tempA.x;
                this.yoyo.acc.y = tempA.y;
                this.yoyo.maxLength = 300*0.4;
            }
        }
    }
}

var socket;
var player;

function setup() {
    createCanvas(1250, 560);
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    socket = io.connect('http://localhost:3000');
    let newPlayer = new Player();
    socket.emit('new_player', newPlayer);
    player = new Player(width/2, 0, 255, 0, 0);
}

function draw() {
    background(220);
    player.render();
}

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}