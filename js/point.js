class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    isEqualTo(point) {
    	return this.x == point.x && this.y == point.y; 
    }
    toJSON() { return { x: this.x, y: this.y }; }
}