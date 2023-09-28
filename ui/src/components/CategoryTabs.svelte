<!--The different category tabs that will be on the left side of the screen-->
<script>
  import {catClicked} from '../stores.js';

  let categories = [
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
  function handleCategoryClick(category) {
    $catClicked = category.name;
    window.location.href = category.target;

    // Change the text color of the category text 
    document.getElementById("category-text").style.color = category.color;
  }
</script>

<div>
  {#each categories as category, index}
    <!-- svelte-ignore a11y-click-events-have-key-events - next semester -->
      <p id="category-text" on:click={() => handleCategoryClick(categories[index])}>{category.name}</p>
    <!-- color coding list for colored rectangles under category text -->
      {#if category.name === "Pantry Staples"}
        <div class="pantry"></div>
      {:else if category.name === "Snacks"}
        <div class="snacks"></div>
      {:else if category.name === "Grains"}
        <div class="grains"></div>
      {:else if category.name === "Breakfast Grains"}
        <div class="breakfast"></div>
      {:else if category.name === "Soup"}
        <div class="soup"></div>
      {:else if category.name === "Protein"}
        <div class="protein"></div>
      {:else if category.name === "Household Items"}
        <div class="house"></div>
      {:else if category.name === "Personal Care"}
        <div class="care"></div>
      {:else if category.name === "Fruits"}
        <div class="fruit"></div>
      {/if}
    
  {/each}
</div>
 
<style>
  p {
      text-align: center;
      color: white;
      cursor: pointer;

      padding: 5px;
  }

  .pantry {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #38B6FF;
  }

  .snacks {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #9EDBFF;
  }

  .grains {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #FED111;
  }

  .breakfast {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #FFEB95;
  }

  .soup {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #E57528;
  }

  .protein {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #DC4631;
  }

  .house {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #F6F6ED;
  }

  .care {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #929292;
  }

  .fruit {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: #DA6F61;
  }
</style>