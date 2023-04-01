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

export const snacks_inventory = writable([         // items in demo Snacks category
  {
      "name": "Chips",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Snacks"
  },
  {
      "name": "not chips",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Snacks"
  },
  {
      "name": "snack3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Snacks"
  },
  {
      "name": "snack4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Snacks"
  },
  {
      "name": "snack5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Snacks"
  },
  {
      "name": "snack6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Snacks"
  },
  {
      "name": "snack7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Snacks"
  },
  {
      "name": "snack8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Snacks"
  },
  {
      "name": "snack9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Snacks"
  }
]);

export const grains_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "grain1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Grains"
  },
  {
      "name": "grain2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Grains"
  },
  {
      "name": "grain3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Grains"
  },
  {
      "name": "grain4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Grains"
  },
  {
      "name": "grain5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Grains"
  },
  {
      "name": "grain6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Grains"
  },
  {
      "name": "grain7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Grains"
  },
  {
      "name": "grain8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Grains"
  },
  {
      "name": "grain9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Grains"
  }
]);

export const breakfast_grains_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "bgrain1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Breakfast Grains"
  },
  {
      "name": "bgrain9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Breakfast Grains"
  }
]);

export const soup_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "soup1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Soup"
  },
  {
      "name": "soup2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Soup"
  },
  {
      "name": "soup3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Soup"
  },
  {
      "name": "soup4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Soup"
  },
  {
      "name": "soup5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Soup"
  },
  {
      "name": "soup6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Soup"
  },
  {
      "name": "soup7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Soup"
  },
  {
      "name": "soup8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Soup"
  },
  {
      "name": "soup9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Soup"
  }
]);

export const protein_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "protein1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Protein"
  },
  {
      "name": "protein2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Protein"
  },
  {
      "name": "protein3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Protein"
  },
  {
      "name": "protein4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Protein"
  },
  {
      "name": "protein5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Protein"
  },
  {
      "name": "protein6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Protein"
  },
  {
      "name": "protein7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Protein"
  },
  {
      "name": "protein8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Protein"
  },
  {
      "name": "protein9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Protein"
  }
]);

export const household_items_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "house1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Household Items"
  },
  {
      "name": "house2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Household Items"
  },
  {
      "name": "house3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Household Items"
  },
  {
      "name": "house4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Household Items"
  },
  {
      "name": "house5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Household Items"
  },
  {
      "name": "house6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Household Items"
  },
  {
      "name": "house7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Household Items"
  },
  {
      "name": "house8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Household Items"
  },
  {
      "name": "house9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Household Items"
  }
]);

export const personal_care_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "person1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Personal Care"
  },
  {
      "name": "person2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Personal Care"
  },
  {
      "name": "person3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Personal Care"
  },
  {
      "name": "person4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Personal Care"
  },
  {
      "name": "person5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Personal Care"
  },
  {
      "name": "person6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Personal Care"
  },
  {
      "name": "person7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Personal Care"
  },
  {
      "name": "person8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Personal Care"
  },
  {
      "name": "person9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Personal Care"
  }
]);

export const fruits_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "fruit1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Fruits"
  },
  {
      "name": "fruit2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Fruits"
  },
  {
      "name": "fruit3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Fruits"
  },
  {
      "name": "fruit4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Fruits"
  },
  {
      "name": "fruit5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Fruits"
  },
  {
      "name": "fruit6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Fruits"
  },
  {
      "name": "fruit7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Fruits"
  },
  {
      "name": "fruit8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Fruits"
  },
  {
      "name": "fruit9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Fruits"
  }
]);

export const vegetables_inventory = writable([         // items in demo Pantry Staples category
  {
      "name": "veg1",
      "image_src": './demo_pantry_staples_item_images/cake-mix.svg',
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Vegetables"
  },
  {
      "name": "veg2",
      "image_src": "./demo_pantry_staples_item_images/cooking-oil.svg",
      "deal": "",
      "sizes": ["S", "M"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Vegetables"
  },
  {
      "name": "veg3",
      "image_src": "./demo_pantry_staples_item_images/flour.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Vegetables"
  },
  {
      "name": "veg4",
      "image_src": "./demo_pantry_staples_item_images/ground-coffee.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Vegetables"
  },
  {
      "name": "veg5",
      "image_src": "./demo_pantry_staples_item_images/ketchup.svg",
      "deal": "",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Vegetables"
  },
  {
      "name": "veg6",
      "image_src": "./demo_pantry_staples_item_images/mayonnaise.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2024", "02/02/2024", "03/03/2024"],
      "category": "Vegetables"
  },
  {
      "name": "veg7",
      "image_src": "./demo_pantry_staples_item_images/mustard.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["01/01/2024"],
      "category": "Vegetables"
  },
  {
      "name": "veg8",
      "image_src": "./demo_pantry_staples_item_images/powder-milk.svg",
      "deal": "",
      "sizes": ["S", "M", "L"],
      "expiration_dates": ["01/01/2023", "02/02/2023", "03/03/2023"],
      "category": "Vegetables"
  },
  {
      "name": "veg9",
      "image_src": "./demo_pantry_staples_item_images/tea-bags.svg",
      "deal": "Deal: 2 for 1",
      "sizes": ["One Size"],
      "expiration_dates": ["N/A"],
      "category": "Vegetables"
  }
]);





// information about the item the user clicked in Checkout History
export const itemClickedName = writable("");
export const itemClickedImageSrc = writable("");
export const itemClickedDeal = writable("");
export const itemClickedSizes = writable([]);
export const itemClickedExpDates = writable(["n/a"]);
export const itemClickedCat = writable("");