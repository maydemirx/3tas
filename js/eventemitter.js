class EventEmitter {
	constructor () {
		this.listeners = [];
	}
	on (event, callback) {
		this.listeners.push({
			'event': event,
			'callback': callback
		});
	}
	emit (event, args, thisArg = this) {
		var invocationCount = 0;
		for (var i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i].event == event) {
				this.listeners[i].callback.apply(thisArg, args);
				invocationCount++;
			}
		}
		return invocationCount;
	}
}