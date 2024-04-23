// this is where next semester can get items from database
// used for EPICS exhibit to store demo inventory

import { writable } from 'svelte/store';    // allows for setting and updating

export const itemsInCart = writable(0);     // quantity of items in cart
export const pantryInCart = writable(0);    // num of items in cart per category
export const snacksInCart = writable(0);
export const grainsInCart = writable(0);
export const breakInCart = writable(0);
export const soupInCart = writable(0);
export const proteinInCart = writable(0);
export const houseInCart = writable(0);
export const personalInCart = writable(0);
export const fruitsInCart = writable(0);
export const vegInCart = writable(0);       // end of num of items in cart per category
export const check = writable(false);       
export const cartContents = writable([]);   // items in the cart     // remaining items in the cart
export const inventory = writable([         // items in demo inventory
  {
      "name": "Canned Tuna",
      "image_src": './demo_item_images/canned_tuna.png',
      "deal": "Deal: 2 for 1",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Protein",
      "id": "1"
      
  },
  {
      "name": "Mac n Cheese",
      "image_src": "./demo_item_images/mac-n-cheese.png",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Pantry Staples",
      "id": "2"
  },
  {
      "name": "Mayonnaise",
      "image_src": "./demo_item_images/mayonnaise.png",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Pantry Staples",
      "id": "3"
  },
  {
      "name": "Oatmeal",
      "image_src": "./demo_item_images/oatmeal.png",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Breakfast Grains",
      "id": "4"
  },
  {
      "name": "Ramen Pack",
      "image_src": "./demo_item_images/ramen.png",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Pantry Staples",
      "id": "5"
  },
  {
      "name": "Razor",
      "image_src": "./demo_item_images/razor-2.png",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Personal Care",
      "id": "6"
  },
  {
      "name": "Toilet Paper",
      "image_src": "./demo_item_images/toilet_paper.png",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Household Items",
      "id": "7"
  },
  {
    "name": "Ground Beef",
    "image_src": "./demo_item_images/ground_beef.png",
    "deal": "",
    "sizes": ["S", "M", "L"],
    "expiration_dates": ["01/01/2099"],
    "category": "Protein",
    "id": "8"
  },
  {
    "name": "Potato Chips",
    "image_src": "./demo_item_images/potato_chips.png",
    "deal": "",
    "sizes": ["One Size"],
    "expiration_dates": ["01/01/2099"],
    "category": "Snacks",
    "id": "9"
  },
  {
    "name": "White Bread",
    "image_src": "./demo_item_images/white_bread.png",
    "deal": "",
    "sizes": ["One Size"],
    "expiration_dates": ["01/01/2099"],
    "category": "Grains",
    "id": "10"
  },
  {
    "name": "Chicken Noodle",
    "image_src": "./demo_item_images/chicken_noodle.png",
    "deal": "",
    "sizes": ["One Size"],
    "expiration_dates": ["01/01/2099"],
    "category": "Soup",
    "id": "11"
  },
  {
    "name": "Apple",
    "image_src": "./demo_item_images/apple.png",
    "deal": "",
    "sizes": ["One Size"],
    "expiration_dates": ["01/01/2099"],
    "category": "Fruits",
    "id": "12"
  },
  {
    "name": "Green Beans",
    "image_src": "./demo_item_images/green_beans.png",
    "deal": "Deal: 3 for 1",
    "sizes": ["One Size"],
    "expiration_dates": ["01/01/2099"],
    "category": "Vegetables",
    "id": "13"
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


// Used to to keep track of the category to display
export const categoryClicked = writable({
    name:"All",
    color:"#000",
    target:"#/all",
});