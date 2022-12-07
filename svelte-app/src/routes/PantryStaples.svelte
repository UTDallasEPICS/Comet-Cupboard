<!-- shows demo page for Pantry Staples category -->

<script>
    // importing components
    import TopBar from '../components/TopBar.svelte';
    import HeaderImage from '../components/HeaderImage.svelte';
    import Footer from '../components/Footer.svelte';
    import CategorySection from '../components/CategorySection.svelte';
    import CategoryTabs from '../components/CategoryTabs.svelte';
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
          <CategorySection category={"Pantry Staples"} />
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
      justify-content: space-between;
    }
  
    #category-tab {
      width: 250px;    /* this is needed in order to get flex-grow to work */
      background: #154734;
    }
  
    .display-section {
      flex-grow: 100;   /* expands the width of checkout history to fill the remaining width  */
    }
    </style>