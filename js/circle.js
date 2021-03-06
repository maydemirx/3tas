'use strict'

class Circle extends EventEmitter {
	constructor(image, board, point, isEmptyCircle = false) {
		super();
		this._image = image;
		this._board = board;
		this._element = $('<img src="${image}">')
			.appendTo(board.element)
			.attr('src', image);

		if (isEmptyCircle) {
			this._element.on('dragover', this.onDragOver.bind(this));
			this._element.on('drop', this.onDrop.bind(this));
		} else {
			this._element.attr('draggable', true);
			this._element.on('dragstart', this.onDragStart.bind(this));
		}
		this.move(point.x, point.y);
	}
	get board() { return this._board; }
	get image() { return this._image; }
	get point() { return this._point; }
	get element() { return this._element; }
	get player() { return this._player; }
	set player(player) { this._player = player; }
	move (x, y) {
		var target = new Point(x, y);
		if (!this.board.hasCircle(target)) {			
			this._point = target;
			let convertedPoint = this.board.convert(this.point);
			this._element.css({
				'position': 'absolute',
				'top': (convertedPoint.y - 61 / 2) + 'px',
				'left': (convertedPoint.x - 61 / 2) + 'px'
			});
			this._element.attr('data-x', target.x);
			this._element.attr('data-y', target.y);
			this.emit('location.changed', [this, target]);
		} else {
			alert('you can move object only empty points');
		}
	}
	remove() {
		this.element.remove();
	}
	onDragOver (e) {
		e = e.originalEvent;
		if (this.board.hasCircle(this.point)) {
			return false;
		}
		e.preventDefault();
	}
	onDragStart (e) {
		if (!this.player.playingSequence) {
			return false;
		}
		e = e.originalEvent;
		e.dataTransfer.setData("x", this.point.x);
		e.dataTransfer.setData("y", this.point.y);
		e.dataTransfer.setData("player-guid", this.player.guid);
	}
	onDrop (e) {
		e = e.originalEvent;
		e.preventDefault();
	    let sourceX = parseInt(e.dataTransfer.getData("x"));
	    let sourceY = parseInt(e.dataTransfer.getData("y"));
	    let sourcePlayerGuid = e.dataTransfer.getData('player-guid');
	    let sourcePlayer = this.board.getPlayer(sourcePlayerGuid);

	    if (this.board.isGameBoard) {

	    	let sourceCircle = sourcePlayer.getCircle(sourceX, sourceY);
	    	if (sourceCircle) {
	    		sourcePlayer.remove(sourceX, sourceY);
	    		this.board.add(this.point.x, this.point.y, sourcePlayer);
	    	} else {
	    		let shortestPath = this.board.getShortestPath(new Point(sourceX, sourceY), this.point)
					.removeOne(sourceX + '_' + sourceY)
					.removeOne(this.point.x + '_' + this.point.y);
	    		for (let i = 0; i < shortestPath.length; i++) {
	    			let x = parseInt(shortestPath[i].split('_')[0]);
	    			let y = parseInt(shortestPath[i].split('_')[1]);
	    			if (this.board.hasCircle(new Point(x, y))) {
	    				return false;
	    			}
	    		}
	    		sourceCircle = this.board.getCircle(sourceX, sourceY);
	    		sourceCircle.move(this.point.x, this.point.y);
	    	}


	    }
	}
}