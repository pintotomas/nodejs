function Shape() {
	Shape.prototype.X = 0
	Shape.prototype.Y = 0
	Shape.prototype.move = function(x, y) {
		this.X = x
		this.Y = y
	}
	Shape.prototype.distance_from_origin = function() {
		return Math.sqrt(this.X**2 + this.Y**2)
	}
	Shape.prototype.area = function() {
		throw new Error("Need a 2d form!")
	}
}


function Square() {
}
Square.prototype = new Shape();
Square.prototype.__proto__ = Shape.prototype;
Square.prototype.Width = 0;
Square.prototype.area = function() {
	return this.Width ** 2;

}

function Rectangle(){

}

Rectangle.prototype = new Square()
Rectangle.prototype.__proto__ = Square.prototype
Rectangle.Height = 0
Rectangle.prototype.area = function() {
	return this.Width * this.Height;

}

var sq = new Square();
sq.move(-5, -5);
sq.Width = 5;
console.log(sq.area());
console.log(sq.distance_from_origin());

console.log("Rectangle")
var re = new Rectangle()
re.move(5,10)
re.Height = 10
re.Width = 3
console.log(re.distance_from_origin())
console.log(re.area())