function random(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

max = random(3,9);

for(i = 0; i < max ; i++) {
  $('#btn-add-job').click();
}

var testData = [];
var jobs = $('.job');
var bt = [];
var at = [];
for(i = 0; i < jobs.length - 1; i++) {
  bt[i] = random(1,9);
  at[i] = random(1,9);
}
bt.push(random(1,9));
at.push(0);

for(j=0; j < jobs.length; j++) {
  var row = $(jobs[j]).children().first();
  var btcol = row.next().find('input').val(bt[j]).parent();
  var atcol = btcol.next().find('input').val(at[j]).parent();
  opsys.prototype.vars.jobs.push({job: 'j' + (j+1), bt: bt[j], at: at[j]});
}

$('#btn-test-job').addClass('show');