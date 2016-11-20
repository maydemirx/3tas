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
		this._gameController.on('player.sequence.changed', this.onPlayerSequenceChanged.bind(this));
		this._gameController.on('player.win', this.onWin.bind(this));

		this._graph = new Graph();

		if (createEmpties) {		
			for (let x = 0; x <= this._h; x++) {
				for (let y = 0; y <= this._v; y++) {
					var empty = new Circle('images/empty.png', this, new Point(x, y), true);
					this._empties.push(empty);
					empty.on('move', function(args) {
						this.emit('move', arguments);
					}.bind(this));

					var edges = {};

					for (let h = 0; h <= this._h; h++) {
						for (let v = 0; v <= this._v; v++) {

							if (h == x && v == y) {
								continue;
							}

							if ((h == x && Math.abs(v - y) <= 1) || (v == y && Math.abs(h - x) <= 1)) {
								edges[h + '_' + v] = 1;
							}

						}
					}
					this._graph.addVertex(x + '_' + y, edges);
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
			circle.on('location.changed', this.onCircleLocationChanged.bind(this));
			this.onCircleLocationChanged(circle, point);
			return circle;
		}
		return false;
	}
	remove (x, y) {
		for (let i = 0; i < this._circles.length; i++) {
			if (this._circles[i].point.isEqualTo(new Point(x, y))) {
				this._circles[i].remove();
				this._circles.removeOne(this._circles[i]);
			}
		}
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
	getShortestPath(p1, p2) {
		let p1Key = p1.x + '_' + p1.y;
		let p2Key = p2.x + '_' + p2.y;
		return this._graph.shortestPath(p1Key, p2Key);
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
	getPlayer(guid) {
		for (let i = 0; i < this._players.length; i++) {
			if (this._players[i].guid == guid) {
				return this._players[i];
			}
		}
		return null;
	}
	get getPlayers() { return this._players; }
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
	isEmpty() {
		return this._circles.length == 0;
	}
	start() {
		if (this.isGameBoard) {
			this._gameController.start();
		}
	}
	onCircleLocationChanged() {
		if (this.isGameBoard) {
			this.emit('circle.location.changed', arguments);
		}
	}
	onWin() {
		if (this.isGameBoard) {
			this.emit('player.win', arguments);
			this._gameController.restart();
		}
	}
	onPlayerSequenceChanged() {
		if (this.isGameBoard) {
			this.emit('player.sequence.changed', arguments);
		}
	}
}