import React,{Fragment} from 'react';
import {CgMouse} from 'react-icons/all';
import './Home.css'
import Product from './Product.js'

const product={
    name:"Blue T-Shirt",
    images:[{url:"https://cdn.shopify.com/s/files/1/1222/3190/products/Basics_Royal_Blue_grande.jpg?v=1495270250"}],
    price:'3000',
    _id:"btshrt"
}

const Home = () => {
    return ( 
    
    <Fragment>
         <div className="banner">
             <p>Welcome to Ecommerce</p>
             <h1>FIND AMAZING PRODUCTS BELOW</h1>

             <a href="#container">
                 <button>
                     Scroll <CgMouse/>
                 </button>
             </a>

         </div>
        
         <h2 className="homeHeading">Featured Products</h2>

         <div className="container" id="container">
             <Product product={product}/>
             <Product product={product}/>
             <Product product={product}/>
             <Product product={product}/>
             <Product product={product}/>
             <Product product={product}/>
             <Product product={product}/>
             <Product product={product}/>
         </div>
         
             

         
        
    </Fragment>
    
    );
}
 
export default Home;