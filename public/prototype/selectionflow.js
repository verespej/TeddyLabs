$(document).ready(function(){

  function getURLParameters(paramName){
          var sURL = window.document.URL.toString();
      if (sURL.indexOf("?") > 0)
      {
         var arrParams = sURL.split("?");
         var arrURLParams = arrParams[1].split("&");
         var arrParamNames = new Array(arrURLParams.length);
         var arrParamValues = new Array(arrURLParams.length);
         var i = 0;
         for (i=0;i<arrURLParams.length;i++)
         {
          var sParam =  arrURLParams[i].split("=");
          arrParamNames[i] = sParam[0];
          if (sParam[1] != "")
              arrParamValues[i] = unescape(sParam[1]);
          else
              arrParamValues[i] = "No Value";
         }

         for (i=0;i<arrURLParams.length;i++)
         {
                  if(arrParamNames[i] == paramName){
              //alert("Param:"+arrParamValues[i]);
                  return arrParamValues[i];
               }
         }
         return false;
      }

  }

  var filteredData;
  var currentLeft;
  var currentRight;
  var nextObj;
  var speed = 300;

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
      opacity: 0,
    };
    throwOutProps[direction] = '400px';

    var throwInProps = {
      opacity: 1
    };
    throwInProps[direction] = 0;

    var rotateName = 'rotate' + direction;
    $elem.addClass(rotateName).animate(throwOutProps, speed, function () {
      $(this).removeClass(rotateName);
    }).animate(throwInProps, speed);
  }

  // Swap out element with something not in the dont show list
  function swapout(elem) {
    next = nextObj;

    setTimeout(function(){
      elem.attr('src', getImageUrl(next));
    }, speed);

    // Prefetch next img
    nextObj = _.chain(filteredData).reject(function(datum){
      if(_([currentRight, currentLeft]).contains(datum)) return true;
    }).sample().value();

    prefetch_img = new Image();
    prefetch_img.src = getImageUrl(nextObj);

    return next;
  }

  $('#leftimg').closest('.selectionpanel').click(function(e){
    console.log("Click Left");
    // We don't want the right one, decrement its popularity
    currentRight.popularity--;
    // But we do want the left one
    currentLeft.popularity++;

    affirm($('#leftimg'), 'rgba(0, 255, 0, 1)');
    throwOut($('#rightimg').closest('.selectionpanel'), false);
    currentRight = swapout($("#rightimg"));
  });
  $('#rightimg').closest('.selectionpanel').click(function(e){
    // We do want the right one
    currentRight.popularity++;
    currentLeft.popularity--;
    console.log("Lfet popularity", currentLeft.popularity);
    console.log("Right popularity", currentRight.popularity);

    affirm($('#rightimg'), 'rgba(0, 255, 0, 1)');
    throwOut($('#leftimg').closest('.selectionpanel'), true);
    currentLeft = swapout($("#leftimg"));
  });

  $('a#imdone').click(function(e){
    var dataToSend = _(filteredData).sortBy(function(datum){
      return datum.popularity;
    }).reverse().slice(0,3);

    console.log(dataToSend);

    var jstring = JSON.stringify(dataToSend);
    window.location.replace("results.html?" + $.param({q: jstring}));
  });



    // Filter data from params
    var age = getURLParameters("age");
    var girls = getURLParameters('girl');
    var boys = getURLParameters('boy');
/*

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

  // var dataFile = 'exampledata.json';
  var dataFile = '/api/toys?';
  // price_range=
  // gender
  // age_range

  $.getJSON(dataFile, function(data){
    var results = data.results;

    filteredData = _(results).map(function(datum) {
      datum.popularity = 0;
      return datum;
    });
    console.log(data);

    currentLeft = _(filteredData).sample();
    currentRight = _.chain(filteredData).reject(function(datum){ return datum == currentLeft; }).sample().value();
    nextObj = _.chain(filteredData).reject(function(datum){
      if(_([currentRight, currentLeft]).contains(datum)) return true;
    }).sample().value();


    $('#leftimg').attr('src', getImageUrl(currentLeft));
    $('#rightimg').attr('src', getImageUrl(currentRight));
  });
});
