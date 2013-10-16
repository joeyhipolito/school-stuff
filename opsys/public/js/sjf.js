var opsys = function() {};

opsys.prototype.vars = {
  jobs : [],
  jobLength : 0
}

opsys.prototype.init = function() {
  opsys.prototype.bindEvents();
};

opsys.prototype.sort = function(array, by) {
  array.sort(function(a,b){
    if(a[by] < b[by])
      return -1;
    if(a[by] > b[by])
      return 1;
    return 0;
  });
};

opsys.prototype.bindEvents = function() {
  var btnAddJob    = $('#btn-add-job'),
      btnRemoveJob = $('#btn-remove-job'),
      btnTestJob   = $('#btn-test-job');
  var listJobs    = $('#list-jobs'),
      listProcess = $('#list-process'),
      listGantt   = $('#list-gantt'),
      listResult  = $('#list-result');

  // on click on add job
  btnAddJob.on('click', function(e){
    var jobCount = $('.job').length + 1;
    opsys.prototype.vars.jobLength = jobCount;
    opsys.prototype.table.rows.add(listJobs,
        [
          {"class" : "job"},
          {"data-job-id" : "j" + jobCount}
        ],
        [
          "<b>J" + jobCount + "</b>",
          "<input class='form-control' type='text' placeholder='bt' data-criteria='bt'>",
          "<input class='form-control' type='text' placeholder='at' data-criteria='at'>",
          "<i class='icon-remove'></i>"
        ],
        true
      )
    var empty = listJobs.find('input').filter(function(){
      return this.value === "";
    });
    if(empty.length) {
      btnTestJob.removeClass('show');
    } else {
      btnTestJob.addClass('show');
    }
  });

  btnRemoveJob.on('click', function(e){
    opsys.prototype.table.rows.remove(listJobs);
  });

  btnTestJob.on('click', function(e){
    // opsys.prototype.test.tabulateArrivalTime();
    opsys.prototype.test.preemptive();
  });

  listJobs.on('keyup', 'input', function(e){
    var that = $(this);
    var parent = that.closest('.job');
    var criteria = that.data('criteria'),
        jobId    = parent.data('job-id');
    var empty = parent.find("input").filter(function() {
        return this.value === "";
    });
    var row = opsys.prototype.vars.jobs[parent[0].rowIndex - 1]
    if(!row) {
      row = {job: jobId};
    }
      row[criteria] = parseInt(this.value, 10);

    opsys.prototype.vars.jobs[parent[0].rowIndex - 1] = row;

    if(empty.length) {
      parent.find('i').removeClass('icon-ok').addClass('icon-remove');
    } else {
      parent.find('i').removeClass('icon-remove').addClass('icon-ok');
    }
    var empty = listJobs.find('input').filter(function(){
      return this.value === "";
    });
    if(empty.length) {
      btnTestJob.removeClass('show');
    } else {
      btnTestJob.addClass('show');
    }

  });
};


opsys.prototype.test = {
  tabulateArrivalTime: function() {
    var listProcess = $('#list-process');
    listProcess.html('<tr><th>Time<th>Process');
    var jobs = opsys.prototype.vars.jobs.clone();
    opsys.prototype.sort(jobs, 'at');
    var maxTime = jobs[jobs.length - 1].at;
    for (var i = 0; i <= maxTime; i++) {
      var row = $('<tr>');
      row.append('<td>' + i);
      var arrivedJobs = '';
      for (var j = 0; j < jobs.length; j++) {
        if(jobs[j].at == i) {
          arrivedJobs += jobs[j].job + '(' + jobs[j].bt + 'ms)' + "," ;
        }
      };
      row.append('<td>' + arrivedJobs.replace(/(^,)|(,$)/g, ""));
      listProcess.append(row);
    };
  },
  preemptive: function() {
    var arr = opsys.prototype.vars.jobs;

    var active = undefined,
        queue = [],
        final = [],
        totalBurst = 0,
        currentBurst = 0;

    // Get the total burst time
    $.map(arr, function(job, index) {
        arr[index].runTime = arr[index].bt;
        totalBurst += job.bt + job.at;
    });

    // This loop simulates time
    for (var i = 0; i < totalBurst; i+=1) {
      if (typeof active === 'object') {
        active.runTime -= 1;
        
        if (active.runTime < 1) {
          final.push({ job : active.job, start : active.start, end : i, die: true});
          active = undefined;
        }
      }
    
      // Get array of jobs recieved at this time signature
      var toProcess,
          jobs = $.grep(arr, function(job, index) {
              return job.at === i;
          });
    
      // Merge new jobs into queue
      queue = queue.concat(jobs);    
      // Sort the queue
      queue.sort(function(a,b) {
          return a.bt < b.bt ? -1 : 1;
      });
      
      // Get the job to process next
      toProcess = queue.splice(0,1)[0];
     
      if (typeof toProcess !== 'undefined') {
        // Process active job
        if (typeof active === 'undefined' && typeof toProcess !== 'undefined') {
            // Automatically start the first job in the queue
            toProcess.start = i;
            active = toProcess;
        } else if( typeof toProcess !== 'undefined' && active.bt > toProcess.bt ) {
          // Push active time to final array
          final.push({ job : active.job, start : active.start, end : i});
          // If active still has time to run add it to queue
          if (active.runTime > 0) {
            queue.push(active);
          }
          
          // Create new active process
          toProcess.start = i;
          active = toProcess;
        } else if( typeof toProcess !== 'undefined') {
          // Otherwise we still have an active process
          // Push the toProcess back on the queue
          queue.push(toProcess);
        }
      }    
    }

    var listProcess = $('#list-process');
    // listProcess.html('<tr><th>Time<th>Process');
    listProcess.html('<tr><th>Process<th>Start<th>End');
    $.each(final, function(index, job) {
      var row = $('<tr>');
      row.append('<td>' + job.job)
         .append('<td>' + job.start)
         .append('<td>' + job.end);
      if(job.die === true) {
        row.children().first().addClass('died');
      }
      listProcess.append(row);
    });
    //
    var listResult = $('#list-result');
    listResult.html('<tr><th>ST<th>FT<th>TAT<th>WT');
    var sorted = final.slice(0);
    opsys.prototype.sort(sorted, 'job');
    for(var j = 0; j < sorted.length ; j++) {
      result = sorted.filter(function( obj ) {
        return obj.job == sorted[j].job;
      });
      console.log(result);
    }
    
  }
}

opsys.prototype.table = {
  rows: {}
};

opsys.prototype.table.rows = {
  add: function(table, attr, data, tbody) {
    var row = $('<tr>');
    for (var i = 0; i < attr.length; i++) {
      $.each(attr[i], function(k,v){
        row.attr(k , v);
      });
    };
    for (var i = 0; i < data.length; i++) {
      row.append('<td>' + data[i]);
    };
    if(!tbody) {
      table.append('<tbody>').append(row);
    } else if(tbody) {
      table.find(' > tbody:last').append(row);
    }
  },
  remove: function(table, row) {
    if(row){
      table.find(' > tbody:last').find('tr:nth-child(' + row + ')').remove();
    }else {
      table.find(' > tbody:last').find('tr:last').remove();
    }
  }
};



var op = new opsys;
window.onload = op.init();