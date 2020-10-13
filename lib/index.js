var Heap = require("collections/heap.js");
class Exchange {
  constructor() {
    this.buyHeap = new Heap([],null ,function(a,b){
      return a.price - b.price;
    })
    this.sellHeap = new Heap([],null,function (a,b){
      return b.price - a.price;
    })
    this.order = {};

    this.currentOrder = 0;
    return this;
  }

  sync(fileName) {
    const json = require(fileName);
    if ('buy' in json){
      for (var index = 0; index < json['buy'].length;index++){
        var node = json['buy'][index];
        var rem = node['quantity'] - node['executedQuantity'];
        if (rem < 0){
          rem = 0
        }
        var id = node['id'];
        this.currentOrder = Math.max(this.currentOrder,id+1);
        var price = node['price'];
        var orderStruct = {id: id, price: price, isBuyOrder: true,quantity: node['quantity'],executedQuantity:node['executedQuantity']}
        this.order[id] = {struct:orderStruct,rem:rem}
        if (rem >0){
          this.buyHeap.push({id:id,price:price});
        }
      }
    }
    if ('sell' in json){
      for (var index = 0; index < json['sell'].length;index++){
        var node = json['sell'][index];
        var rem = node['quantity'] - node['executedQuantity'];
        if (rem < 0){
          rem = 0;
        }
        var id = node['id'];
        this.currentOrder = Math.max(this.currentOrder,id+1);
        var price = node['price'];
        var orderStruct = {id: id, price: price, isBuyOrder: false,quantity: node['quantity'],executedQuantity:node['executedQuantity']}
        this.order[id] = {struct:orderStruct,rem:rem}
        if (rem >0){
          this.sellHeap.push({id:id,price:price});
        }
      }
    }

    // TODO
  }

 


  getQuantityAtPrice(price) {
    var tolQuantity = 0;
    var checkId = []
    this.buyHeap.content.forEach(returnQuant);
    this.sellHeap.content.forEach(returnQuant);
    function returnQuant(node){
      if (node.price == price){
        checkId.push(node.id);
      }
    }
    var i = 0;
    for (i = 0; i < checkId.length;i++){
      tolQuantity += this.order[checkId[i]].rem;
    }


    
    return tolQuantity;
    
    // TODO
  }

  getOrder(id) {
    if (this.order[id] == undefined){
      return {};
    }
    return this.order[id].struct;
    // TODO
  }
  
    

    // TODO
  buy(quantity, price) {
    var orderStruct = {id:this.currentOrder,isBuyOrder:true,quantity:quantity,price:price,executedQuantity:0};
    this.currentOrder += 1;
    if (this.sellHeap.length == 0){
      this.buyHeap.push({id:orderStruct.id,price:price});
      this.order[orderStruct.id] = {struct:orderStruct,rem:quantity};

      return orderStruct;
    }
    while (this.sellHeap.length > 0 && this.sellHeap.peek().price <= price && quantity > 0){
      var topValId = this.sellHeap.peek().id;
      var topVal = this.order[topValId];

      if (topVal.rem <= quantity){
          this.sellHeap.pop();
          
          quantity -= topVal.rem;
          orderStruct.executedQuantity += topVal.rem;
          this.order[topValId].struct.executedQuantity += topVal.rem;
      }
      else{
        this.order[topValID].rem -= quantity;
        this.order[topValID].struct.executedQuantity += quantity;
        orderStruct.executedQuantity += quantity;
        quantity = 0;
      }


    }
    if (quantity > 0){
      this.buyHeap.push({id:orderStruct.id,price:price})
    }
    this.order[orderStruct.id] = {struct:orderStruct,rem:quantity};
    return orderStruct;

    // TODO
  }
  sell(quantity, price) {
    var orderStruct = {id:this.currentOrder,isBuyOrder:false,quantity:quantity,price:price,executedQuantity:0};
    this.currentOrder += 1;
    if (this.buyHeap.length==0){
      this.sellHeap.push({id:orderStruct.id,price:price});
      this.order[orderStruct.id] = {struct:orderStruct,rem:quantity};
      return orderStruct;
    }
    while (this.buyHeap.length > 0 && this.buyHeap.peek().price >= price && quantity >0){
      var topValId = this.buyHeap.peek().id;
      
      if(this.order[topValId].rem <= quantity){
        this.buyHeap.pop()
        var topVal = this.order[topValId];
        
        quantity -= topVal.rem;
        orderStruct.executedQuantity += topVal.quantity;
        this.order[topValId].struct.executedQuantity += topVal.quantity; 
      }
      else{
        this.order[topValId].rem -= quantity 
        this.order[topValId].struct.executedQuantity += quantity;
        orderStruct.executedQuantity += quantity;
        quantity = 0;
      }
    }
    if (quantity > 0){
      this.sellHeap.push({id:orderStruct.id,price:price});
    }
    this.order[orderStruct.id] = {struct:orderStruct,rem:quantity};
    return orderStruct;

    // TODO
  }


}

module.exports = Exchange;
