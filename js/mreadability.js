$(document).ready(function() {
 
});

var link = $.query.get('l');
var site = link;
var xpath='//body';
try{
    makeRequest(site,xpath);

    function makeRequest(site,xpath) {
        var query = 'select * from html where url="' + site + '" and xpath="' + xpath + '"';
        var request = "http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query)+"&format=xml&_maxage=3600";
        $.ajax({
                url: request, 
                dataType: 'jsonp',
                jsonp: 'callback', 
                jsonpCallback: 'cbfunc'
        }); 

        var xpath = '//title';
        query = 'select * from html where url="' + site + '" and xpath="' + xpath + '"';
        var request = "http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query)+"&format=xml&_maxage=3600";
        $.ajax({
                url: request, 
                dataType: 'jsonp',
                jsonp: 'callback', 
                jsonpCallback: 'getTitle'
        });
    }
    function getTitle(data) {
        var data = data.results[0];
        data = data.replace(/<title>|<\/title>|<title xmlns="http:\/\/www.w3.org\/1999\/xhtml">/, '');
        $('title').html(data);
    }
    function cbfunc(data) {
        var data = data.results[0];
        if(data === undefined){
            window.location = link;
        } else {
            data = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            data = data.replace(/<body>|<\/body>/, '');
            $('#content').html(data);
            readStyle = 'style-newspaper';
            readSize = 'size-medium';
            readMargin = 'margin-wide';
            _readability_script = document.createElement('SCRIPT');
            _readability_script.type = 'text/javascript';
            _readability_script.src = 'js/readability.js?x=' + (Math.random());
            //_readability_script.src = 'http://lab.arc90.com/experiments/readability/js/readability.js?x=' + (Math.random());
            document.getElementsByTagName('head')[0].appendChild(_readability_script);
            _readability_css = document.createElement('LINK');
            _readability_css.rel = 'stylesheet';
            _readability_css.href = 'css/readability.css';
            _readability_css.type = 'text/css';
            _readability_css.media = 'all';
            document.getElementsByTagName('head')[0].appendChild(_readability_css);
        }
    }

} catch(err) {
    window.location = link;
}





