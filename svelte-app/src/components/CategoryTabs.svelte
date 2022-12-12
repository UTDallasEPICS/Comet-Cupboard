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
  {/each}
</div>
 
<style>
  p {
      text-align: center;
      color: white;
      cursor: pointer;
  }
</style>