const ROOT_NODE = document.querySelector('[data-root]');
const PRODUCTS_NODE = document.querySelector('[data-root]');
const COUNTER_NODE = document.querySelector('[data-counter]');
let lScounter = window.localStorage.getItem('favProductsCounter');

// Store
const store = {
  products: [
    {
      id: '1',
      name: 'product 1'
    },
    {
      id: '2',
      name: 'product 2'
    },
    {
      id: '3',
      name: 'product 3'
    },
    {
      id: '4',
      name: 'product 4'
    },
    {
      id: '5',
      name: 'product 5'
    },
  ],
  favProducts: []
};

// Set localstorage
const setLocalStorage = (data) => {
  window.localStorage.setItem('products', JSON.stringify(data));
  window.localStorage.setItem('favProductsCounter', store.favProducts.length);
}

// Check if favProductsCounter is in localstorage
const checkStorage = () => {
  if (window.localStorage.getItem('favProductsCounter') !== null) {
    return true;
  }
  return false;
}

if(!checkStorage()) {
  setLocalStorage(store);
}

// Render products to DOM
const PRODUCTS = store.products;

function addProductsToDOM(products) {
  COUNTER_NODE.innerHTML = lScounter;
  products.forEach(product => {
    let newProductNode = document.createElement('li');
    newProductNode.innerHTML = 
        `<span>${product.name}</span> 
        <button data-fav="${product.id}">&#9829;</button>
        <button data-unfav="${product.id}">unfav</button>`;
    PRODUCTS_NODE.appendChild(newProductNode);
  });
}

addProductsToDOM(PRODUCTS);

// Event emitter
class EventEmitter {
  constructor() {
    this.events = {};
    this.called = false;
  }

  emit(eventName, data) {
    const event = this.events[eventName];
    if(event) {
      event.forEach(fn => {
         fn.call(null, data);
       });
     }
  }

  once(eventName, data) {
    const event = this.events[eventName];
    if(event && !this.called) {
      this.called = true;
      event.forEach(fn => {
         fn.call(null, data);
       });
     }
  }

  subscribe(eventName, fn) {
    if(!this.events[eventName] ) {
       this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
}

// Set listeners/emitters
let emitter = new EventEmitter();

function setEmitListener() {
  ROOT_NODE.addEventListener('click', function(event) {
    let favID = event.target.dataset.fav;
    let unFavID = event.target.dataset.unfav;
    let counter = event.target.dataset.counter;

    if(favID != undefined) {
      emitter.emit('event:fav', {id: favID});
      return;
    }
    if(counter != undefined) {
      emitter.emit('event:once', {data: 'once'});
      return;
    }
    if(unFavID != undefined) {
      emitter.emit('event:unfav', {id: unFavID});
      return;
    }
  });
}

setEmitListener();

// Set subscribers
emitter.subscribe('event:fav', data => {
  PRODUCTS.forEach(product => {
    if(product.id === data.id && !store.favProducts.includes(product)) {
      store.favProducts.push(product);
    }
  });
  setLocalStorage(store);
  let counter = window.localStorage.getItem('favProductsCounter');
  COUNTER_NODE.innerHTML = counter;
});

emitter.subscribe('event:unfav', data => {
  store.favProducts = store.favProducts.filter((product) => product.id !== data.id);
  setLocalStorage(store);
  let counter = window.localStorage.getItem('favProductsCounter');
  COUNTER_NODE.innerHTML = counter;
});

emitter.subscribe('event:once', data => {
  console.log(data);
});
