$(document).ready(function(){
  $.urlParam = function(name){
    var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    if(!results) return undefined;
    return results[1] || 0;
  };

  var filteredData;
  var currentLeft;
  var currentRight;
  var speed = 200;

  function getImageUrl(item) {
    return item.Images[0].url_570xN;
  }

  function affirm(elem, color) {
    elem.closest('.thumbnail').css('box-shadow', '0 0 25px ' + color);
    setTimeout(function(){
      elem.closest('.thumbnail').css('box-shadow', 'none');
    }, speed);
  }

  function throwOut($elem, throwOutRight) {
    var direction = throwOutRight ? 'right' : 'left';

    var throwOutProps = {
      opacity: 0
    };
    throwOutProps[direction] = '400px';

    var throwInProps = {
      opacity: 1
    };
    throwInProps[direction] = 0;

    $elem.animate(throwOutProps, speed).animate(throwInProps, speed);
  }

  // Swap out element with something not in the dont show list
  function swapout(elem) {
    next = _.chain(filteredData).reject(function(datum){
      if(_([currentRight, currentLeft]).contains(datum)) return true;
    }).sample().value();

    setTimeout(function(){
      elem.attr('src', getImageUrl(next));
    }, speed);

    return next;
  }

  $('#leftimg').closest('.selectionpanel').click(function(e){
    // We don't want the right one, decrement its popularity
    currentRight.popularity--;
    // But we do want the left one
    currentLeft.popularity++;

    affirm($('#leftimg'), 'rgba(0, 255, 0, 1)');
    throwOut($('#rightimg').closest('.selectionpanel'), false);
    currentLeft = swapout($("#rightimg"));
  });
  $('#rightimg').closest('.selectionpanel').click(function(e){
    // We do want the right one
    currentRight.popularity++;
    currentLeft.popularity--;

    affirm($('#rightimg'), 'rgba(0, 255, 0, 1)');
    throwOut($('#leftimg').closest('.selectionpanel'), true);
    currentRight = swapout($("#leftimg"));
  });

  $('a#imdone').click(function(e){
    var jstring = JSON.stringify(filteredData);

    window.location.replace("results.html?" + $.param({q: jstring}));
  });

  var dataFile = 'exampledata.json'; //"data.json"
  $.getJSON(dataFile, function(data){
    var results = data.results;
    /*
    // Filter data from params
    var age = $.urlParam("age");
    var girls = $.urlParam("girls");
    var boys = $.urlParam("boys");

    if(!boys && !girls) {
      // None selected?
      boys = true;
      girls = true;
    }

    filteredData = _(data).select(function(datum){
      if(boys && _(datum.gender).contains('b')) return true;
      if(girls && _(datum.gender).contains('g')) return true;
    });

    // Start the game
    */
    filteredData = results;

    currentLeft = _(filteredData).sample();
    currentRight = _.chain(filteredData).reject(function(datum){ return datum == currentLeft; }).sample().value();

    $('#leftimg').attr('src', getImageUrl(currentLeft));
    $('#rightimg').attr('src', getImageUrl(currentRight));
  });
});