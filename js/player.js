'use strict'

class Player extends Board {
	constructor(element, name, container, board, color = 'red') {
		super(element, 200, 400, 1, 3, false, 'images/' + color + '.png');
		$('<div>'+name+'</div>').appendTo(element);
		this.element.removeAttr('style');
		this.element.css({
			'border': '1px solid #000',
			'float':'left',
			'width':'49%',
			'height':' 399px',
			'overflow':'hidden'
		});
		this.name = name;
		this.color = color;
		this._guuid = guid();
		this.board = board;
		this.board.on('move', this.onMovedToBoard.bind(this));
		this.circleCount = 3;
		this.prepareCircles();
	}
	get guid() { return this._guuid; }
	prepareCircles() {
		for (let i = 0; i < this.circleCount; i++) {
			var circle = this.add(0, i, this);
			circle.element.removeAttr('style');
			circle.player = this;
		}
	}
	onMovedToBoard(source, target, sourcePlayerGuuid) {
		if (sourcePlayerGuuid == this.guid) {			
			var circle = this.getCircle(source.x, source.y);
			circle.remove();
			this.board.add(target.x, target.y, this);
		}
	}
}