class Ball{
    constructor(){
        this.velX = 0;
        this.velY = 0;
        this.x = random(0,width);
        this.y = random(0,height);
        while(this.velX == 0){
            this.velX = round(random(-3, 3));
        }
        while(velY == 0){
            this.velY = round(random(-3, 3));
        }
    }

    render(){
        circle(this.x, this.y, 20);
        this.x+= this.velX;
        this.y+= this.velY;
        if(this.x+10 >= width){
            this.velX = -this.velX;
        }
        if(this.x-10 <= 0){
            this.velX = -this.velX;
        }
        if(this.y+10 >= height){
            this.velY = -this.velY;
        }
        if(this.y-10 <= 0){
            this.velY = -this.velY;
        }
    }
}

var balls=[];
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    for(let i = 0; i < balls.length; i++){
        balls[i].render();
    }
}