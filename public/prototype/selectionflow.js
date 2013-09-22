$(function() {
  $.urlParam = function(name){
      var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
      if(!results) return undefined;
      return results[1] || 0;
  }

  var filteredData;
  var currentLeft;
  var currentRight;

  function affirm(elem, color) {
    elem.closest('.thumbnail').css('box-shadow', '0 0 25px ' + color);
    setTimeout(function(){
      elem.closest('.thumbnail').css('box-shadow', 'none');
    }, 500)
  }

  // Swap out element with something not in the dont show list
  function swapout(elem) {
    next = _.chain(filteredData).reject(function(datum){
      if(_([currentRight, currentLeft]).contains(datum)) return true
    }).sample().value();

    setTimeout(function(){
      elem.attr('src', 'img/'+next.img);
    }, 500);


    return next;
  }

  $(document).ready(function(){
    $('#leftimg').closest('.selectionpanel').find('a').click(function(e){
      console.log("Left clck");
      // We don't want the right one, decrement its popularity
      currentRight.popularity--;
      // But we do want the left one
      currentLeft.popularity++;

      affirm($('#leftimg'), 'rgba(0, 255, 0, 1)');
      affirm($('#rightimg'), 'rgba(255, 0, 0, 1)');
      currentLeft = swapout($("#rightimg"));
    });
    $('#rightimg').closest('.selectionpanel').find('a').click(function(e){
      console.log("Right Clk");

      // We do want the right one
      currentRight.popularity++;
      currentLeft.popularity--;

      affirm($('#rightimg'), 'rgba(0, 255, 0, 1)');
      affirm($('#leftimg'), 'rgba(255, 0, 0, 1)');
      currentRight = swapout($("#leftimg"));
    });

    $('a#imdone').click(function(e){
      var jstring = JSON.stringify(filteredData);

      window.location.replace("results.html?" + $.param({q: jstring}));
    });

    var etsyUrl = "https://openapi.etsy.com/v2/listings/active?" +
                  "includes=Images,Shop&" + 
                  "category=Toys&" + 
                  "max_price=" + maxPrice + "&" +
                  "min_price=" + minPrice + "&" + 
                  "limit=100&" + 
                  "sort_on=created&" + 
                  "sort_order=down&" + 
                  "geo_level=country&" + "
                  api_key=ouavs6p1ors6wt2e9uz9s4j1";

    $.getJSON("data.json", function(data){
      console.log("Got", data);
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
      currentLeft = _(filteredData).sample();
      currentRight = _.chain(filteredData).reject(function(datum){ return datum == currentLeft }).sample().value();

      $('#leftimg').attr('src', "img/" + currentLeft.img);
      $('#rightimg').attr('src', "img/" + currentRight.img);
    })
  })
});