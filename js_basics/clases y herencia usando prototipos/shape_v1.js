function Shape() {
	this.X = 0
	this.Y = 0
	this.move = function(x, y) {
		this.X = x
		this.Y = y
	}
	this.distance_from_origin = function() {
		return Math.sqrt(this.X**2 + this.Y**2)
	}
	this.area = function() {
		throw new Error("Need a 2d form!")
	}
}

var s = new Shape()
s.move(10,10)
console.log(s.distance_from_origin())