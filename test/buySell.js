var Exchange = require("../lib/");
var a = new Exchange();
console.log(a.sell(4,5));
console.log(a.buy(4,5));
console.log(a.getOrder(0));
console.log(a.buy(10,5));
console.log(a.sell(1,5));
console.log(a.getOrder(2));

