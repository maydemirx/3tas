'use strict'

class GameController extends EventEmitter {
	constructor(board) {
		super();
		this.board = board;
		this.lastWon = null;
		this.wins = {};
		this.board.on('circle.location.changed', this.onCircleLocationChanged.bind(this));
	}
	verticalControl() {
		let h = this.board.horizontalCount;
		let v = this.board.verticalCount;
		let vs = [];
		for (let x = 0; x <= h; x++) {
			for (let y = 0; y <= v; y++) {
				let circle = this.board.getCircle(x, y);
				if (circle) {
					vs.push(circle);
				} else {
					vs = [];
					break;
				}
			}
			if ((vs.length - 1) == h) {
				let notFound = false;
				for (let c = 0; c < vs.length; c++) {
					if (c > 0 && vs[c - 1].player.guid != vs[c].player.guid) {
						notFound = true;
						break;
					}
				}
				if (!notFound) {
					return vs[0].player;
				}
			}
		}
		return null;
	}
	horizontalControl() {
		let h = this.board.horizontalCount;
		let v = this.board.verticalCount;
		let hs = [];
		for (let y = 0; y <= v; y++) {
			for (let x = 0; x <= h; x++) {
				let circle = this.board.getCircle(x, y);
				if (circle) {
					hs.push(circle);
				} else {
					hs = [];
					break;
				}
			}
			if ((hs.length - 1) == h) {
				let notFound = false;
				for (let c = 0; c < hs.length; c++) {
					if (c > 0 && hs[c - 1].player.guid != hs[c].player.guid) {
						notFound = true;
						break;
					}
				}
				if (!notFound) {
					return hs[0].player;
				}
			}
		}
		return null;
	}
	control() {
		var win = this.verticalControl();
		if (!win) {
			win = this.horizontalControl();
		}
		return win;
	}
	start() {
		let lastWon = null;
		let players = this.board.getPlayers;
		if (!Object.keys(this.wins).length) {
			lastWon = players[0];
		} else {
			lastWonCount = 0;
			for (let guid in this.wins) {
				if (lastWonCount < this.wins[guid]) {
					lastWon = this.board.getPlayer(guid);
					lastWonCount = this.wins[guid];
				}
			}
		}
		this.board.clear();
		for (let i = 0; i < players.length; i++) {
			players[i].prepareCircles();
		}
		this.changePlayerSequence(lastWon);
	}
	restart() {
		this.wins = {};
		this.start();
	}
	changePlayerSequence(player) {
		let players = this.board.getPlayers;
		for (let i = 0; i < players.length; i++) {
			players[i].playingSequence = false;
		}
		player.playingSequence = true;
		this.emit('player.sequence.changed', [player]);
	}
	onCircleLocationChanged( circle, target ) {
		let win = this.control();
		if (win) {
			if (!this.wins[win.guid]) {
				this.wins[win.guid] = 1;
			} else {
				this.wins[win.guid]++;
			}
			this.emit('player.win', [win]);
		} else {
			let players = this.board.getPlayers;
			for (let i = 0; i < players.length; i++) {
				if (players[i] !== circle.player) {
					this.changePlayerSequence(players[i]);
					break;
				}
			}
		}
	}
}