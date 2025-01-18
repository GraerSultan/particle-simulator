var balls = [];
var density = 0;
var counter = 0;

function ball(radius, x, y, dx, dy, color)
{
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.ballObject = null;

    this.create = function()
    {
        this.ballObject = new Circle(radius);
        this.ballObject.setPosition(this.x, this.y);
        this.ballObject.setColor(color);
        add(this.ballObject);
    }
    this.moveObject = function()
    {
        this.ballObject.move(this.dx, this.dy);
        this.x = this.ballObject.getX();
        this.y = this.ballObject.getY();
    }

    this.collisionDetection = function()
    {
        
        if (this.ballObject.getX() - this.radius <= 0)
        {
            this.dx *= -1;
            this.ballObject.setPosition(1 + this.radius, this.y);
        }
        else if (this.ballObject.getX() + this.radius >= getWidth())
        {
            this.dx *= -1;
            this.ballObject.setPosition(getWidth() - 1 - this.radius, this.y);
        }
        if (this.y - this.radius <= 0)
        {
            this.dy *= -1;
            this.ballObject.setPosition(this.x, 1 + this.radius);
        }
        else if (this.y + this.radius >= getHeight())
        {
            this.dy *= -1;
            this.ballObject.setPosition(this.x, getHeight() - 1 - this.radius);
        }
        for (let i = 0; i < balls.length; i++)
        {
            this.x = this.ballObject.getX();
            this.y = this.ballObject.getY();
            var ballTemp = balls[i];
            density += distanceCalculator(this.x, this.y, ballTemp.ballObject.getX(), ballTemp.ballObject.getY());
            var distanceTemp = distanceCalculator(this.x, this.y, ballTemp.x, ballTemp.y);
            if (this.radius + ballTemp.radius >= distanceTemp && ballTemp != this)
            {
                var temp = this.dx;
                this.dx = ballTemp.dx;
                ballTemp.dx = temp;

                temp = this.dy;
                this.dy = ballTemp.dy;
                ballTemp.dy = temp;

                var overlapTemp = this.radius + ballTemp.radius - distanceTemp;
                var angleTemp = Math.atan2(this.y - ballTemp.y, this.x - ballTemp.x);

                var overlapX = Math.cos(angleTemp) * overlapTemp / 2;
                var overlapY = Math.sin(angleTemp) * overlapTemp / 2;

                this.x += overlapX;
                this.y += overlapY;
                ballTemp.x -= overlapX;
                ballTemp.y -= overlapY;

                var canvas = document.getElementById("simulationCanvas");
                var context = canvas.getContext("2d");
                
                this.moveObject(dx, dy);
                ballTemp.moveObject(dx, dy);
            }
        }
    }
}

function distanceCalculator(x1, y1, x2, y2)
{
    return (Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)));
}
function start()
{
    setTimer(tick, 1000 / 60);
    createBalls(2500);
}

function createBalls(numBalls)
{
    for (let i = 1; i <= numBalls; i++)
    {
        var ballTemp = new ball(1, Randomizer.nextInt(2, getWidth() - 2), Randomizer.nextInt(6, getHeight() - 6), Randomizer.nextInt(1, 5), Randomizer.nextInt(1, 5), Randomizer.nextColor());
        ballTemp.create();
        balls.push(ballTemp);
    }
}

function tick()
{
    counter ++;
    density = 0;
    for (let i = 0; i < balls.length; i++)
    {
        balls[i].moveObject();
        balls[i].collisionDetection();
    }
    if (counter % 100 == 0)
    {
        counter = 0;
        density /= Math.pow(balls.length, 2);
        println(density);
    }
}
