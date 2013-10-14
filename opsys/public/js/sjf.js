function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function compare(a,b) {
  if (a.at < b.at)
     return -1;
  if (a.at > b.at)
    return 1;
  return 0;
}

var opsys = function() {};

opsys.prototype.init = function() {
  opsys.prototype.bindEvents();
};

opsys.prototype.jobs = [];

opsys.prototype.bindEvents = function() {
  var btnAdd = document.getElementById('btn-add-job');
  var jobList = $('#list-jobs');
  btnAdd.addEventListener('click', function(e) {
     $('#btn-test-job').fadeIn();
     var count = $('.job').length;
     jobList.children('tbody').append("<tr class='job' data-job-id='" + (count) + "'><td><b>J" + (count) + "</b>" + 
           "<td><input class='form-control' type='text' placeholder='Change BT' data-criteria='bt'>" + 
           "<td><input class='form-control' type='text' placeholder='Change AT' data-criteria='at'>" +
           "<td><input class='form-control' type='text' placeholder='Change Priority' data-criteria='priority'></tr>");
  });
  // $('#btn-remove-job').on('click', function(e){
  //   if (jobList.find('tr').length > 1) {
  //     jobList.find('tr:last-child').remove();
  //     opsys.prototype.jobs.pop();
  //   };
  // });
  $('#btn-test-job').on('click', function(e){
    opsys.prototype.ui.process();
    $('#btn-add-job').fadeOut();
  });
  $('#list-jobs').on('keyup', 'input', function() {
    var criteria = $(this).data('criteria');
    var parentRow = $(this).parent().parent();
    var jobId = parentRow.data('job-id');
    if(!opsys.prototype.jobs[jobId]) {
      opsys.prototype.jobs[jobId] = {job: 'J' + jobId};
    }
    opsys.prototype.jobs[jobId][criteria] = parseInt(this.value);
  });

};
  
opsys.prototype.ui = {
  build: function() {
    
  },
  process: function() {
    var processList = $('#process');
    processList.html('<tr>' +
                        '<th>Time</th>' +
                        '<th>Process</th>' +
                      '</tr>');
    jobs = opsys.prototype.jobs;
    sorted = jobs.sort(compare);
    maxTime = 0;
    $.each(jobs, function(k, v){
      maxTime = v.at > maxTime ? v.at : maxTime;
    });
    var row = [];
    for (var i = 0; i <= maxTime; i++) {
      row.push('<tr>');
      row.push('<td>' + i);
      var arrivedJobs = "";
      for (var j = 0; j < sorted.length; j++) {
        if(sorted[j].at == i) {
          arrivedJobs += sorted[j].job + '(' + sorted[j].bt + 'ms)' + "," ;
        }
      };
      row.push('<td>' + arrivedJobs.replace(/(^,)|(,$)/g, ""));
    };
    processList.append(row.join(''));
  },
  process2: function() {
    
  },
  tabulate: function() {

  }
}

var op = new opsys;
window.onload = op.init();
