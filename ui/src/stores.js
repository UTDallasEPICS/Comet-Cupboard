// this is where next semester can get items from database
// used for EPICS exhibit to store demo inventory

import { writable } from 'svelte/store';    // allows for setting and updating

export const itemsInCart = writable(0);     // quantity of items in cart
export const cartContents = writable([]);   // items in the cart
export const inventory = writable([         // items in demo inventory
  {
      "name": "Canned Tuna",
      "image_src": './demo_item_images/canned-tuna.svg',
      "deal": "Deal: 2 for 1",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Snacks",
      "id": "1"
  },
  {
      "name": "Mac n Cheese",
      "image_src": "./demo_item_images/mac-n-cheese.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Pantry Staples",
      "id": "2"
  },
  {
      "name": "Mayonnaise",
      "image_src": "./demo_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Pantry Staples",
      "id": "3"
  },
  {
      "name": "Oatmeal",
      "image_src": "./demo_item_images/oatmeal.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Breakfast Grains",
      "id": "4"
  },
  {
      "name": "Ramen Pack",
      "image_src": "./demo_item_images/ramen-pack.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Pantry Staples",
      "id": "5"
  },
  {
      "name": "Razor",
      "image_src": "./demo_item_images/razor.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Personal Care",
      "id": "6"
  },
  {
      "name": "Toilet Paper",
      "image_src": "./demo_item_images/toilet-paper.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Household Items",
      "id": "7"
  }
]);

export const pantry_staples_inventory = writable([
{
      "name": "Mac n Cheese",
      "image_src": "./demo_item_images/mac-n-cheese.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Pantry Staples",
      "id": "8"
},
{
      "name": "Mayonnaise",
      "image_src": "./demo_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Pantry Staples",
      "id": "9"
},
{
      "name": "Ramen Pack",
      "image_src": "./demo_item_images/ramen-pack.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Pantry Staples",
      "id": "10"
}    
]);

// information about the item the user clicked in Checkout History
export const itemClickedName = writable("");
export const itemClickedImageSrc = writable("");
export const itemClickedDeal = writable("");
export const itemClickedSizes = writable([]);
export const itemClickedExpDates = writable(["n/a"]);
export const itemClickedCat = writable("");
export const itemClickedId = writable("-1");