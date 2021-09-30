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
        // console.log(keyword);
        this.query = this.query.find({...keyword}); //sent keyword
        return this;
    }
    filter(){ 
        //category filter
        const queryCopy = {...this.queryStr} //copy of queryStr using spread operator bcz we dont want ref of querystr.
        // console.log(queryCopy); //before remove { keyword: 'product', category: 'laptop' }

        //removing some fields fo category
        const removeFields=["keyword","page","limit"]; 
        
        removeFields.forEach(key=>delete queryCopy[key]) //it will delete keyword,page,limit.
        // console.log(queryCopy); //after remove { category: 'laptop' }

        // Filter for price and rating
        console.log(queryCopy);

        let queryStr = JSON.stringify(queryCopy); 
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
        
        this.query =this.query.find(JSON.parse(queryStr)); //finds only category

        console.log(queryStr);
        return this;
    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage-1);
        // suppose we want to show 10 per page
        // total products =50
        // 1st page->10products (skip-->10*(1-1)=0 product skip).
        //2nd page->10products to show and 1st 10 products(skip-->10*(2-1)=10).

        this.query = this.query.limit(resultPerPage).skip(skip); // limiting in resuktperpage.

        return this;
    }
};

module.exports=ApiFeatures;