import { useEffect, useState } from "react";

import {
  getProducts,
  getCart,
  addToCart,
  removeFromCart,
} from "./api";


const FRUIT_INFO = {

mango:{
name:"Mango",
image:
"https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=500&q=80",
emoji:"🥭"
},

apple:{
name:"Apple",
image:
"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&q=80",
emoji:"🍎"
},

banana:{
name:"Banana",
image:
"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80",
emoji:"🍌"
},

orange:{
name:"Orange",
image:
"https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80",
emoji:"🍊"
},

strawberry:{
name:"Strawberry",
image:
"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80",
emoji:"🍓"
},

grape:{
name:"Grape",
image:
"https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80",
emoji:"🍇"
},

pineapple:{
name:"Pineapple",
image:
"https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&q=80",
emoji:"🍍"
},

watermelon:{
name:"Watermelon",
image:
"https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=500&q=80",
emoji:"🍉"
},

cherry:{
name:"Cherry",
image:
"https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500&q=80",
emoji:"🍒"
},

kiwi:{
name:"Kiwi",
image:
"https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=500&q=80",
emoji:"🥝"
}

};



const FRUIT_ORDER=[
"mango",
"apple",
"banana",
"orange",
"strawberry",
"grape",
"pineapple",
"watermelon",
"cherry",
"kiwi"
];


const DEFAULT_IMG=
"https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80";



const normalizeName=(name)=>{

return String(name || "")
.trim()
.toLowerCase();

};



export default function UserHome({setIsAuth}){


const [tab,setTab]=useState("shop");

const [cart,setCart]=useState([]);

const [products,setProducts]=useState([]);

const [loading,setLoading]=useState(null);

const [productsLoading,setProductsLoading]=useState(true);

const [search,setSearch]=useState("");


// NEW BUY MESSAGE

const [purchaseMessage,setPurchaseMessage]=useState("");





const fetchProducts=async()=>{


try{


const response=await getProducts();


const backendProducts=
Array.isArray(response.data)
?
response.data
:
[];




const orderedProducts=

FRUIT_ORDER.map((fruitKey)=>{


const info=FRUIT_INFO[fruitKey];


const backendProduct=

backendProducts.find(
(product)=>
normalizeName(product.name)
===fruitKey
);



if(!backendProduct)
return null;



return {

...backendProduct,

price:Number(
backendProduct.price ?? 0
),

stock:Number(
backendProduct.stock ?? 0
),

image:
info?.image || DEFAULT_IMG,

emoji:
info?.emoji || "🍉"


};



})
.filter(Boolean);



setProducts(orderedProducts);



}
catch(err){

console.log(err);

}
finally{

setProductsLoading(false);

}


};





const fetchCart=async()=>{


try{


const response=await getCart();


setCart(
Array.isArray(response.data)
?
response.data
:
[]
);


}
catch(err){

console.log(err);

}


};





useEffect(()=>{


fetchProducts();

fetchCart();


},[]);






const filteredProducts=

products.filter((product)=>

product.name
.toLowerCase()
.includes(
search.toLowerCase()
)

);





const cartCount=

cart.reduce(

(total,item)=>

total+
Number(item.quantity || 0),

0

);






const handleAdd=async(id)=>{


const product=

products.find(

(p)=>

Number(p.id)
===Number(id)

);



if(!product)
return;



if(Number(product.stock)<=0){

alert("Product is out of stock");

return;

}



setLoading(id);



try{


await addToCart(id,1);

await fetchCart();

await fetchProducts();


}
catch(err){

console.log(err);

}
finally{

setLoading(null);

}


};






const handleRemove=async(id)=>{


try{


await removeFromCart(id);

await fetchCart();

await fetchProducts();



}
catch(err){

console.log(err);

}


};





const handleBuy=()=>{


if(cart.length===0){

alert("Your cart is empty");

return;

}



setPurchaseMessage(
"🎉 Thank you for buying from Fruit Shop!"
);



setTimeout(()=>{


setPurchaseMessage("");

setTab("shop");


},3000);



};





const logout=()=>{


localStorage.removeItem("token");

setIsAuth(false);

window.location.reload();


};





return (

<div>


{/* HEADER */}


<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:16
}}
>


<h2>
🍓 Fruit Shop
</h2>


<button
className="btn-red"
onClick={logout}
>

Logout

</button>


</div>
      {/* TABS */}

      <div className="tabs">


        <button
          className={`tab ${
            tab==="shop"
            ?
            "active"
            :
            ""
          }`}
          onClick={()=>setTab("shop")}
        >

          🛒 Shop

        </button>



        <button
          className={`tab ${
            tab==="cart"
            ?
            "active"
            :
            ""
          }`}
          onClick={()=>setTab("cart")}
        >

          🧺 Cart


          {
            cartCount>0 &&
            (
              <span className="cart-badge">
                {cartCount}
              </span>
            )
          }


        </button>


      </div>





{/* ================= SHOP ================= */}


{
tab==="shop" && (


<div>



<div
style={{
display:"flex",
justifyContent:"center",
marginBottom:"20px"
}}
>


<input

type="text"

placeholder="🔍 Search fruits..."

value={search}

onChange={(e)=>setSearch(e.target.value)}


style={{
width:"320px",
padding:"12px",
borderRadius:"8px",
border:"1px solid #ccc",
fontSize:"16px"
}}


/>


</div>





{
productsLoading ?

(
<p className="empty">
Loading products...
</p>
)

:

(

<div className="fruit-grid">


{

filteredProducts.length===0 ?

(

<p
className="empty"
style={{
width:"100%",
textAlign:"center"
}}
>

❌ No fruits found

</p>

)

:


filteredProducts.map((product)=>(


<div
className="fruit-card"
key={product.id}
>



<div className="fruit-img-wrap">


<img

src={
product.image || DEFAULT_IMG
}

alt={product.name}

className="fruit-img"


onError={(e)=>{

e.currentTarget.src=DEFAULT_IMG;

}}


/>


</div>





<div className="name">

{product.emoji}
{" "}
{product.name}

</div>




<div className="price">

৳
{Number(product.price).toFixed(2)}

</div>




<div className="stock">


{

Number(product.stock)>0

?

(
<>
Stock:
{" "}
<strong>
{product.stock}
</strong>
</>
)

:

(

<strong
style={{
color:"red"
}}
>

❌ Out of Stock

</strong>

)


}


</div>






<button


disabled={
loading===product.id ||
Number(product.stock)<=0
}


onClick={()=>handleAdd(product.id)}


>


{

loading===product.id

?

"Adding..."

:

Number(product.stock)<=0

?

"❌ Out of Stock"

:

"🛒 Add to Cart"


}


</button>




</div>


))


}



</div>

)

}



</div>


)

}






{/* ================= CART ================= */}



{

tab==="cart" && (


<div>



{

cart.length===0 &&

(

<p className="empty">

Your cart is empty 🛒

</p>

)


}





{

cart.map((item)=>{


const product=

products.find(

(p)=>

Number(p.id)

===

Number(item.product_id)

);





return (


<div
className="cart-item"
key={item.id}
>



<img

src={
product?.image || DEFAULT_IMG
}

className="cart-thumb"

alt="fruit"

/>





<div className="cart-info">


<div className="cart-name">


{product?.emoji || "🍉"}

{" "}

{product?.name || "Product"}


</div>



<div className="cart-qty">

Qty:
{" "}
{item.quantity}

</div>



</div>






<div className="cart-right">


<div className="cart-price">


৳

{

(

Number(product?.price || 0)

*

Number(item.quantity || 0)

).toFixed(2)


}


</div>





<button

className="btn-red"

onClick={()=>handleRemove(item.product_id)}

>

❌

</button>




</div>




</div>



)



})

}



{/* TOTAL */}



{

cart.length>0 &&

(

<div className="cart-total">


<span>

Total

</span>



<span className="total-price">


৳

{

cart.reduce(

(total,item)=>{


const product=

products.find(

(p)=>

Number(p.id)

===

Number(item.product_id)

);



return (

total +

(

Number(product?.price || 0)

*

Number(item.quantity || 0)

)

);


},

0


).toFixed(2)


}



</span>


</div>


)

}





{/* BUY BUTTON */}



{

cart.length>0 &&

(

<div
style={{
textAlign:"center",
marginTop:"20px"
}}
>


<button

onClick={handleBuy}


style={{
background:"#28a745",
color:"white",
padding:"12px 35px",
border:"none",
borderRadius:"8px",
fontSize:"18px",
cursor:"pointer"
}}

>


💳 Buy Now


</button>



</div>


)

}





{/* THANK YOU MESSAGE */}



{

purchaseMessage &&

(

<div

style={{
marginTop:"20px",
padding:"15px",
background:"#d4edda",
color:"#155724",
borderRadius:"10px",
textAlign:"center",
fontSize:"20px"
}}

>


{purchaseMessage}


</div>


)

}





</div>


)

}



</div>


);

}