function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

Array.prototype.removeOne = function(one) {
	var indexOfOne = this.indexOf(one);
	if (indexOfOne !== -1) {
		this.splice(indexOfOne, 1);
	}
	return this;
};