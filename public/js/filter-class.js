export default class FilterClass{
    constructor(){
        this.make = [];
        this.minPrice = 0;
        this.maxPrice = 999999;
    }
    setMake(makeArray)
    {
        this.make = makeArray;
    }
    setMinPrice(minPrice)
    {
        this.minPrice = minPrice;
    }
    setMaxPrice(maxPrice){
        this.maxPrice = maxPrice;
    }
}