
DETAILDATA.sort(function(a, b){
  var value1 = a['sort'];
  var value2 = b['sort'];
  return value2 - value1;
});
var prevArr = []
listSort(DETAILDATA)
function listSort(itemList) {
  if (getParam('q')) {
    let tempArr = getParam('q').split('-');
    console.log('tempArr===>', tempArr)
    for (let i = 0; i < tempArr.length; i++) {
      for (let j = 0; j < itemList.length; j++) {
        if (tempArr[i] == itemList[j].goodsNum) {
          prevArr.push(itemList[j]);
          break;
        }
      }
    }
  }
}

function getParam(key) {
  var param = "";
  var valus = new RegExp(key + "=(([^\\s&(#!)])+)").exec(window.location.href);
  if (valus && valus.length >= 2) {
    param = valus[1];
  }
  return param;
}