function parseQuery (str) {
  var arr = str.split('&');
  var queryObj = {};
  arr.forEach(function(val, i) {
    var item = val.split('=')
    queryObj[item[0]] = queryObj[item[0]] ? [item[1]].concat(queryObj[item[0]]) : item[1]
  })
  return queryObj
}
var params = parseQuery(location.search.slice(1));
console.log(params)
