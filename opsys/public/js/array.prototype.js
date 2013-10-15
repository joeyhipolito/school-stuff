Array.prototype.inObjects = function(key, value) {
  for (var i = 0; i < this.length; i++) {
    if(this[i].hasOwnProperty(key) && this[i][key] == value){
      return true;
    }
  };
  return false;
};

Array.prototype.clone = function() {
  return this.slice(0);
};

Array.prototype.rowsToColumns = function() {
  var arrC = [],
      x = Math.max.apply(Math, this.map(function (e) {return e.length;})),
      y = this.length,
      i, j;
  for (i = 0; i < x; ++i) {
    arrC[i] = [];
    for (j = 0; j < y; ++j)
      if (i in this[j])
        arrC[i].push(this[j][i]);
  }
  return arrC;
}

Array.prototype.fifo = function(frames) {
  var results = [], result = [];
  var success = 0, fail = 0, currentIndex = 0;
  for (var i = 0, age = 0; i < this.length; i++, age++) {
    result = result.slice(0);
    var inObjects = result.inObjects('page', this[i]);
    if(result.length == frames && !inObjects) {
      result[currentIndex%frames] = {page: this[i]};
      fail++;
      currentIndex++;
    } else if (result.length < frames && !inObjects) {
      fail++;
      result.push({page: this[i]});
    } else {
      success++;
    }
    results.push(result);
  };
  return {result: results, success: success, fail: fail, total: this.length};
};