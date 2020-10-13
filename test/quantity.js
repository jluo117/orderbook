var Exchange = require("../lib/");
var a = new Exchange();
a.buy(4,5);
a.buy(100,5);
console.log(a.getQuantityAtPrice(5)); //check sales prices for 5 -> 104
a.sell(4,10);
a.sell(5,10);
console.log(a.getQuantityAtPrice(10));//check sles prices for 10 ->9
