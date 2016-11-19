class GameController {
	constructor(board) {
		this.board = board;
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
}