//Globals
var count = 1;
var links = new Array();

$(document).ready(function() {
    var site = 'http://news.ycombinator.com/';
    var xpath='//table/tr/td/table/tr';
    makeRequest(site,xpath);
    $('#info-btn').click(function() {
      $('#info').show();
    });
    $('#info div').click(function() {
      $('#info').hide();
    });
   
});


/*$(document).endlessScroll({
   	bottomPixels: 100,
   	fireOnce: true,
	fireDelay: 1000,
   	callback: function(p){
   	     $('#progress').show();
   	    id = '#more' + (count - 1) + ' a';
   	    link = $(id).attr('href');
   	    var site = 'http://news.ycombinator.com' + link;
        var xpath='//table/tr/td/table/tr';
        makeRequest(site,xpath);
       }
   });*/
   
$(window).scroll(function(){
       if  ($(window).scrollTop() == $(document).height() - $(window).height()){
            $('#progress').show();
          	id = '#more' + (count - 1) + ' a';
          	link = $(id).attr('href');
          	var site = 'http://news.ycombinator.com' + link;
            var xpath='//table/tr/td/table/tr';
            if($.inArray(links,link) == -1){
                links.push(link);
                makeRequest(site,xpath);
            }
            else{
               $('#progress').hide(); 
            }
       }
});
function makeRequest(site,xpath) {
    var query = 'select * from html where url="' + site + '" and xpath="' + xpath + '"';
    var request = "http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query)+"&format=xml&_maxage=1800";
    $.ajax({
            url: request, 
            dataType: 'jsonp',
            jsonp: 'callback', 
            jsonpCallback: 'cbfunc'
    }); 
}

function cbfunc(data) {
    var results = data.results;
    var articles = '';
    if(results == ''){
        $('#articles').html('<h1>We are having issues retrieving articles. Try agian later.</h1>');
        $('#progress').hide();
        return
    }
    $.each(results, function(i, val) {
        if (val.match(/height|bgcolor/) === null) {   
           if(val.match(/fnid/)) {
               //articles += val.replace(/<tr>/, '<li id="more' + count +'" class="morelink">');
               //articles += val.replace(/<\/tr>/, '<\li>');
               articles += '<li id="more' + count +'" class="morelink">' + val + '</li>';
               count ++;
           } else {
                if(val.match('class="title">')) { 
                  var prefix = '<li class="arrow"><table>';
                  var suffix = '';
                  val = val.replace(/http:\/\/ycombinator.com\/images\/grayarrow.gif/,'images/blank.png');
                  val = val.replace(/<a href="http:\/\//, '<a href="mreadability.html?l=http://');
                  val = val.replace(/<a href="item/, '<a href="http://news.ycombinator.com/item');
                }else if (val.match('class="subtext">')){
                  var suffix = '</table><li>';
                  var prefix = '';
                  val = val.replace(/<a href="user/, '<a href="http://news.ycombinator.com/user');
                  val = val.replace(/<a href="item/, '<a href="http://news.ycombinator.com/item');
                }
               val = prefix + val + suffix;
               articles += val
           }
        }
    });	
    $('#articles').append(articles);
    $('li').each(function(index) {
        if($(this).html() == ''){
            $(this).remove();
        }
      });
    $('#progress').hide();
}

$(window).scroll(function() {
    $('#progress').css('top', ($(this).scrollTop() + 200) + "px");
});