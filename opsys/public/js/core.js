var opsys = function() {};

opsys.prototype.init = function() {
  op.bindEvents();
};

opsys.prototype.bindEvents = function() {
  var frames;
  var pages = [];
  var txtFrames = document.getElementById('frames'),
      txtPages  = document.getElementById('pages');
  txtFrames.on('input', function(e){
    frames = this.value;
  });
  txtPages.on('keyup', function(e){
    if(e.keyCode >= 48 && e.keyCode <= 57) {
      pages = this.value.match(/\S+/g);
      opsys.prototype.resultset = pages.fifo(frames);
      console.log(JSON.stringify(opsys.prototype.resultset.result));
      opsys.prototype.ui.build();
    }
  });
  
  var btnAdd = document.getElementById('btn-add'),
      jobs = document.getElementById('jobs');
  btnAdd.on('click', function(e){
    var count = jobs.children.length;
    jobs.append('<li class="job">J' + (count+1) + '</li>');
  });
};

opsys.prototype.ui = {
  build: function() {
    var results = opsys.prototype.resultset.result.rowsToColumns();
    var table = document.createElement('table');
    var max = 0;
    for (var i = 0; i < results.length; i++) {
      var row = table.insertRow(i);
      var len = results[i].length;
      max = len > max ? len : max;
      for (var k = 0; k < len; k++) {
        if(results[i][k-1] != results[i][k]) {
          table.rows[i].insertCell(k).appendChild(document.createTextNode(results[i][k].page));
          table.rows[i].cells[k].setAttribute('class', 'replaced');
        }
        else
          table.rows[i].insertCell(k).appendChild(document.createTextNode(results[i][k].page));
      };
    };
    for (var i = 0; i < results.length; i++) {
      while(table.rows[i].cells.length < max) {
        table.rows[i].insertCell(0);
      }
    };
    var result = document.getElementById('results');
    // result.appendChild(table);
    result.innerHTML = "";
    result.appendChild(table);
    faults = opsys.prototype.resultset.fail;
    success = opsys.prototype.resultset.success;
    total = opsys.prototype.resultset.total;
    result.append('<p class="fault"><b>Fault: </b>' + faults
                + '<br><b>Rate: </b>' + (faults / total * 100).toFixed(2) + '%');
    result.append('<p class="success"><b>Success Rate: </b>' + success
      + '<br><b>Rate: </b>' + (success / total * 100).toFixed(2)+ '%');
    result.append('<div class="clearfix"></div>')
  }
}

var op = new opsys;
window.onload = op.init();
