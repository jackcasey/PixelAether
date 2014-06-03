/*------------------------------------------------------------
This is a url:

  foo://example.com:8042/over/there?name=ferret#nose
  \_/   \______________/\_________/ \_________/ \__/
   |           |            |            |        |
scheme     authority       path        query   fragment
------------------------------------------------------------*/

matchUrl = function(){
  var r = new RegExp(
    '^(https?://)?' + // 1 optional scheme
    '([^/]*)'       + // 2 Authority
    '(/[^#?]*)?'    + // 3 optional path (anything other than a # or ?)
    '(\\?[^#]*)?'   + // 4 optional query
    '(#.*)?'        + // 5 optional fragment
    '\s*'             // trailing white space
  );

  return function(url){
    return url.match(r);
  };
}();

cleanUrl = function(url){
  var match = matchUrl(url);
  if (match[3]){
    // remove extra slashes from path
    match[3] = match[3].replace(/[\/]+/g, '/');
    // remove last slash
    match[3] = match[3].replace(/\/$/, '');
  }
  return match.slice(1).join('');
};

stripUrl = function(url){
  var match = matchUrl(url);
  if (match[3]){
    // remove extra slashes from path
    match[3] = match[3].replace(/[\/]+/g, '/');
    // remove last slash
    match[3] = match[3].replace(/\/$/, '');
  }

  if (!match[1]){
    // ensure http://
    match[1] = 'http://'
  }
  // Do not return fragment or query
  return match.slice(1, 4).join('');
}

// test
/*
var test = function (){
  equal = function(v1, v2, reason){
    if (v1 !== v2) console.log('ERROR: ' +reason +': ' + v1 + ' !== ' + v2);
  };

  equal(matchUrl('www.blah.com')[3], undefined, 
    'path is undefined when no path is present');

  var url = 'https://www.blah.com/okay///one////two//three?n=blah#house'
  var ans = matchUrl(url);

  equal(ans[1], 'https://', 'detect https');
  equal(ans[2], 'www.blah.com', 'authority');

  ans = matchUrl(cleanUrl(url));

  equal(ans[3], '/okay/one/two/three', 'remove extra slashes');
  equal(ans[4], '?n=blah', 'query');
  equal(ans[5], '#house', 'fragment');

  equal(matchUrl(cleanUrl(('www.blah.com/blah.html/?asdf=s')))[3], '/blah.html', 
    'remove trailing slash');

  equal(stripUrl('www.blah.com/one//two?asdf=sd#okay'), 
    'http://www.blah.com/one/two',
    'stripUrl add http, remove query, remove hash');
}();
*/

