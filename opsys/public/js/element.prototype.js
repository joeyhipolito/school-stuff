Element.prototype.on = function(evnt, callback) {
  return this.addEventListener(evnt, callback);
}

Element.prototype.append = function(html) {
  return this.insertAdjacentHTML('beforeend', html);
}