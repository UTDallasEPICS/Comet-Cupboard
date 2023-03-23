<!--The different category tabs that will be on the left side of the screen-->

<script>
  let categories = [
    {
      "name": "Pantry Staples",
      "color": "#38B6FF",
      "target": "#/category/pantry-staples"
    },
    {
      "name": "Snacks",
      "color": "#9EDBFF",
      "target": "",
    },
    {
      "name": "Grains",
      "color": "#FED111",
      "target": "",
    },
    {
      "name": "Breakfast Grains",
      "color": "#FFEB95",
      "target": "",
    },
    {
      "name": "Soup",
      "color": "#E57528",
      "target": "",
    },
    {
      "name": "Protein",
      "color": "#DC4631",
      "target": "",
    },
    {
      "name": "Household Items",
      "color": "#F6F6ED",
      "target": "",
    },
    {
      "name": "Personal Care",
      "color": "#929292",
      "target": "",
    },
    {
      "name": "Fruits",
      "color": "#DA6F61",
      "target": "",
    },
    {
      "name": "Vegetables",
      "color": "#929292",
      "target": "",
    }
  ];
  function handleCategoryClick(category) {
    window.location.href = category.target;
    document.getElementById("category-text").style.color = category.color;
  }
</script>

<div>
  {#each categories as category, index}
    <!-- svelte-ignore a11y-click-events-have-key-events - next semester -->
      <p id="category-text" on:click={() => handleCategoryClick(categories[index])}>{category.name}</p>
    <!-- rough color coding list for colored rectangles under category text, change colors to preferred and ensure color blind can see differences -->
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
      background-color: rgb(36, 100, 180);
  }

  .snacks {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(114, 204, 223);
  }

  .grains {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(209, 193, 19);
  }

  .breakfast {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(172, 177, 99);
  }

  .soup {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(255, 170, 0);
  }

  .protein {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(255, 0, 0);
  }

  .house {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(255, 255, 255);
  }

  .care {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(52, 196, 83);
  }

  .fruit {
      margin: auto;
      height: 5px;
      width: 65%;
      background-color: rgb(205, 118, 156);
  }
</style>