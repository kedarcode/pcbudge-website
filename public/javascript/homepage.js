

function givecall(prod_type){
    console.log(prod_type)
    window.location='http://localhost:3001/productlist?'+'prod_type='+prod_type.toLowerCase();
}
