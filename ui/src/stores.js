// this is where next semester can get items from database
// used for EPICS exhibit to store demo inventory

import { writable } from 'svelte/store';    // allows for setting and updating

export const itemsInCart = writable(2);     // quantity of items in cart
export const cartContents = writable([]);   // items in the cart
export const inventory = writable([         // items in demo inventory
  {
      "name": "Canned Tuna",
      "image_src": './demo_item_images/canned-tuna.svg',
      "deal": "Deal: 2 for 1",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": ""
  },
  {
      "name": "Mac n Cheese",
      "image_src": "./demo_item_images/mac-n-cheese.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": ""
  },
  {
      "name": "Mayonnaise",
      "image_src": "./demo_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": ""
  },
  {
      "name": "Oatmeal",
      "image_src": "./demo_item_images/oatmeal.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": ""
  },
  {
      "name": "Ramen Pack",
      "image_src": "./demo_item_images/ramen-pack.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": ""
  },
  {
      "name": "Razor",
      "image_src": "./demo_item_images/razor.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": ""
  },
  {
      "name": "Toilet Paper",
      "image_src": "./demo_item_images/toilet-paper.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": ""
  }
]);

export const pantry_staples_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "Cake Mix",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Pantry Staples"
  },
  {
      "name": "Cooking Oil",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Pantry Staples"
  },
  {
      "name": "Flour",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Pantry Staples"
  },
  {
      "name": "Ground Coffee",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Pantry Staples"
  },
  {
      "name": "Ketchup",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Pantry Staples"
  },
  {
      "name": "Mayonnaise",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Pantry Staples"
  },
  {
      "name": "Mustard",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Pantry Staples"
  },
  {
      "name": "Powder Milk",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Pantry Staples"
  },
  {
      "name": "Tea Bags",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Pantry Staples"
  }
]);

// information about the item the user clicked in Checkout History
export const itemClickedName = writable("");
export const itemClickedImageSrc = writable("");
export const itemClickedDeal = writable("");
export const itemClickedSizes = writable([]);
export const itemClickedExpDates = writable(["n/a"]);
export const itemClickedCat = writable("");