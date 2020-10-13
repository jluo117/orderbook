var Exchange = require("../lib/");
var a = new Exchange();
a.sync("./sync.json"); //loads JSON with the file sheet in there
var res =a.getQuantityAtPrice(5);//should return 10
console.log(res)
console.log(a.getOrder(5));