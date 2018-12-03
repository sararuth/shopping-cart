(function() {
  $(document).ready(function (){
    renderProducts();
    renderCart();
    
    
  function renderProducts() {
    var url = "http://localhost:3000/products";
      
    $.ajax({method: "GET", url:url, dataType: "json"})
    .done(function(products) {
      for(var product of products) {
        $('<div></div>')
        .addClass('product')
        .append($('<img>').attr('src', product.image))
        .append($('<div></div>').addClass('productInfo').text(product.name))
        .append($('<div></div>').addClass('productPrice').text(product.price))
        .append($('<button></button>').addClass('addToCart').text('Add to Cart').click(product, addToCart))
        .appendTo($('.products'));
      }
    });
  }
  

  function addToCart(evt) {
    var cartData=getCartData();
    var product;
    
    for (var prod of cartData) {
      if (prod.id === evt.data.id) {
        product = prod;
        break;
      }
    }
    
    if (product) {
      ++product.quantity;
    } else {
      product=evt.data;
      product.quantity = 1;
      cartData.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    renderCart();
  }
  
  function getCartData() {
    return JSON.parse(localStorage.getItem('cart')||'[]');    
  }
  
  function renderCart() {
    var cart = $('.cart ul').empty();
    for(var product of getCartData()) {
      $('<li></li>')
      .addClass('cartItem')
        .append($('<span></span>').addClass('productInfo').text(product.name))
        .append($('<span></span>').addClass('productPrice').text(product.price + '$'))
        .append($('<span></span>').addClass('productqu').text('quantity'+product.quantity))
        .appendTo(cart);
      }
      $('#totalPrice').text(calculateTotalPrice());
    }  
  
  function calculateTotalPrice() {
    return getCartData().reduce(function(acc, x) { return acc + x.price * x.quantity; }, 0); 
  }

  // Registers order to the database.
  $('#order').click(function() {
    var url = "http://localhost:3000/orders";
    
    var order = {
      'productIds': getCartData().map(function(item) { return item.id; }),
      'totalPrice': calculateTotalPrice()
    };
  
    $.ajax({method: "POST", url: url, dataType: "json",
      contentType: "application/json; charset=utf-8", data: JSON.stringify(order)})
      .done(function() {
        localStorage.removeItem('cart');
        renderCart();
      });
  });
  });
})();