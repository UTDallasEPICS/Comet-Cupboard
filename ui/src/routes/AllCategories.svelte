<!-- shows demo page for Breakfast Grains category -->

<script>
    // importing components
    import TopBar from '../components/TopBar.svelte';
    import HeaderImage from '../components/HeaderImage.svelte';
    import Footer from '../components/Footer.svelte';
    import CategorySection from '../components/CategorySection.svelte';
    import CategoryTabs from '../components/CategoryTabs.svelte';
    import { catClicked } from '../stores.js';

    </script>

<div class="flex-wrapper">
    <div class="header">
      <TopBar />
    </div>
    <div class="content">
      <HeaderImage />
      <div class="container">
        <div id="category-tab">
          <CategoryTabs />
        </div>
        <div class="display-section">
          {#if $catClicked === "Breakfast Grains"}
          <CategorySection category={"Breakfast Grains"} />
          {:else if $catClicked === "Fruits"}
          <CategorySection category={"Fruits"} />
          {:else if $catClicked === "Grains"}
          <CategorySection category={"Grains"} />
          {:else if $catClicked === "Household Items"}
          <CategorySection category={"Household Items"} />
          {:else if $catClicked === "Pantry Staples"}
          <CategorySection category = "Pantry Staples" />
          {:else if $catClicked === "Personal Care"}
          <CategorySection category = "Personal Care" />
          {:else if $catClicked === "Protein"}
          <CategorySection category = "Protein" />
          {:else if $catClicked === "Snacks"}
          <CategorySection category = "Snacks" />
          {:else if $catClicked === "Soup"}
          <CategorySection category = "Soup" />
          {:else if $catClicked === "Vegetables"}
          <CategorySection category = "Vegetables" />
        {/if}
        </div>
      </div>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
  
  <style>  
    .flex-wrapper {
      display: flex;
      min-height: 100vh;
      flex-direction: column;
    }
  
    .header {
      /* make header stay on top of page at all times */
      position: sticky;
      top: 0;
  
      /* make header stay in front of all items */
      z-index: 2;
    }
  
    .content {
      z-index: 0;  /* make header stay in front of all items */
    }
  
    .footer {
      margin-top: auto; /* push footer to the bottom when content overflows the page and when content is short */
    }
  
    .container { /* contains category tab and checkout history */
      text-align: center;
  
      /* positions category tab and checkout history side-by-side */
      display: flex;
      flex-direction: row;
    justify-content: space-between;
    /* flex: 1; */

    /* flex: 1 1 auto; */
    height:100%;    }
  
    #category-tab {
      width: 250px;    /* this is needed in order to get flex-grow to work */
      background: #154734;

      align-self: flex-start;

    display: flex;
    flex-direction: column;
    flex-grow: 1000;
    }
  
    .display-section {
      flex-grow: 100;   /* expands the width of checkout history to fill the remaining width  */
    }
    </style>