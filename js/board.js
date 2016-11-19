'use strict'

class Board extends EventEmitter {
	constructor(
		element
		, width
		, height
		, column
		, verticalCount
		, createEmpties = false
		, defaultImagePath = 'images/circle.jpg'
		, isGameBoard = true) {
		super();
		this._isGameBoard = isGameBoard;
		this._element = element;
		this._element.css({
			'width': width,
			'height': height,
			'margin': '50px',
			'position': 'relative'
		});
		this._width = width;
		this._height = height;
		this._circles = [];
		this._empties = [];
		this._players = [];
		this._defaultImagePath = defaultImagePath;
		this._h = column;
		this._v = verticalCount;
		this._gameController = new GameController(this);

		if (createEmpties) {		
			for (let x = 0; x <= this._h; x++) {
				for (let y = 0; y <= this._v; y++) {
					var empty = new Circle('images/empty.png', this, new Point(x, y), true);
					this._empties.push(empty);
					empty.on('move', function(args) {
						this.emit('move', arguments);
					}.bind(this));
				}
			}
		}
	}
	get element() { return this._element; }
	get horizontalCount() { return this._h; }
	get verticalCount() { return this._v; }
	get isGameBoard() { return this._isGameBoard; }
	set isGameBoard(isGameBoard) { this._isGameBoard = isGameBoard; }
	add (x, y, player) {
		let point = new Point(x, y);
		if (!this.hasCircle(point)) {
			var circle = new Circle('images/' + player.color + '.png', this, point);
			circle.player = player;
			this._circles.push(circle);
			circle.on('location.changed', this.checkWin.bind(this));
			this.checkWin();
			return circle;
		}
		return false;
	}
	hasCircle (point) {
		for (let i = 0; i < this._circles.length; i++) {
			if (this._circles[i].point.isEqualTo(point)) {
				return true;
			}
		}
		return false;
	}
	getCircle (x, y) {
		let point = new Point(x, y);
		for (let i = 0; i < this._circles.length; i++) {
			if (this._circles[i].point.isEqualTo(point)) {
				return this._circles[i];
			}
		}
		return null;
	}
	convert (point) {
		let partWidth = Math.round(this._width / this._h);
		let partHeight = Math.round(this._height / this._v);
		return new Point(point.x * partWidth, point.y * partHeight);
	}
	addPlayer(name, container, color) {
		var playerElement = $('<div>').appendTo(container).addClass('player');
		var player = new Player(playerElement, name, container, this, color);
		player.isGameBoard = false;
		this._players.push(player);
	}
	clear() {
		for (let x = 0; x <= this._h; x++) {
			for (let y = 0; y <= this._v; y++) {
				let circle = this.getCircle(x, y);
				if (circle) {
					circle.remove();
				}
			}
		}
		this._circles = [];
	}
	checkWin() {
		if (this.isGameBoard) {
			let win = this._gameController.control();
			if (win) {
				alert(win.name + ' won!!');
				this.clear();
				for (let i = 0; i < this._players.length; i++) {
					this._players[i].clear();
				}
				for (let i = 0; i < this._players.length; i++) {
					this._players[i].prepareCircles();
				}
			}
		}
	}
}