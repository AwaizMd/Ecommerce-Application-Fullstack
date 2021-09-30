class ApiFeatures{
    constructor(query,queryStr){ //product.find
        this.query=query;
        this.queryStr=queryStr;  //keyword=laptop(queryStr)
    }

    //search feature
    search(){
        const keyword = this.queryStr.keyword ? {//we will get keyword.
              name:{
                  $regex:this.queryStr.keyword,
                  $options:"i", //case insensitive (if we search ABC it will find abc too.)

              },
        }:{}
        console.log(keyword);
        this.query = this.query.find({...keyword}); //sent keyword
        return this;
    }
};

module.exports=ApiFeatures;