<!--The different category tabs that will be on the left side of the screen-->
<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  import {catClicked} from '../stores.js';

  let categories = [
    {
        "name": "All",
        "color": "#000",
        "target": "#/all"
    },
    {
      "name": "Pantry Staples",
      "color": "#38B6FF",
      "target": "#/categories"
    },
    {
      "name": "Snacks",
      "color": "#9EDBFF",
      "target": "#/categories",
    },
    {
      "name": "Grains",
      "color": "#FED111",
      "target": "#/categories",
    },
    {
      "name": "Breakfast Grains",
      "color": "#FFEB95",
      "target": "#/categories",
    },
    {
      "name": "Soup",
      "color": "#E57528",
      "target": "#/categories",
    },
    {
      "name": "Protein",
      "color": "#DC4631",
      "target": "#/categories",
    },
    {
      "name": "Household Items",
      "color": "#F6F6ED",
      "target": "#/categories",
    },
    {
      "name": "Personal Care",
      "color": "#929292",
      "target": "#/categories",
    },
    {
      "name": "Fruits",
      "color": "#DA6F61",
      "target": "#/categories",
    },
    {
      "name": "Vegetables",
      "color": "#929292",
      "target": "#/categories",
    }
  ];
  const handleCategoryClick = (category) => {
    $catClicked = category.name;
    window.location.href = category.target;
    // Change the text color of the category text 
    document.getElementById("category-text").style.color = category.color;
    dispatch('category-clicked', category);
  }
</script>

<div>
    {#each categories as category, index}
        <!-- on:keypress is redundant and used to get rid of warning -->
        <div class="category-box" style="border-bottom:3px solid {category.color}"
            on:click={() => handleCategoryClick(catClicked[index])}  on:keypress={() => category}> 
              <p id="category-text">{category.name}</p>
        </div>
        
    {/each}
</div>
 
<style>
    p {
        text-align: center;
        color: white;
        padding: 32px;
        padding-bottom: 0;
        margin: 0px;
    }

    .category-box {
        cursor: pointer;
    }
    .category-box:hover {
        background-color: #255744;
    }
    .category-box:active {
        background-color: #053724;
    }
</style>