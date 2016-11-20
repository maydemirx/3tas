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
		this._playingSequence = false;
		this.board = board;
		this.circleCount = 3;
	}
	get guid() { return this._guuid; }
	get playingSequence() { return this._playingSequence; }
	set playingSequence(playingSequence) { this._playingSequence = playingSequence; }
	prepareCircles() {
		for (let i = 0; i < this.circleCount; i++) {
			var circle = this.add(0, i, this);
			circle.element.removeAttr('style');
			circle.player = this;
		}
	}
}