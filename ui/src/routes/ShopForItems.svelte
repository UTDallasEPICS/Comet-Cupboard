<!-- shop for items page -->
<script>
  // importing components
  import TopBar from '../components/TopBar.svelte';
  import HeaderImage from '../components/HeaderImage.svelte';
  import Footer from '../components/Footer.svelte';
  import CheckoutHistory from '../components/CheckoutHistory.svelte';
  import CategoryTabs from '../components/CategoryTabs.svelte';
</script>

<!-- sample code from Svelte to get started
  <main>
  <div>
    <a href="https://vitejs.dev" target="_blank"> 
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Comet Cupboard</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main> -->

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
        <CheckoutHistory />
      </div>
    </div>
  </div>
  <div class="footer">
    <Footer />
  </div>
</div>

<style>

  .flex-wrapper {
    /* min-height: 100%;
    position: relative;
    height: 100%; */

    display: flex;
    min-height: 100vh;
    flex-direction: column;
    
    /*this doesn't work*/
    /* justify-content: flex-start; */ 
    /* box-sizing: border-box; */
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
    margin-top: auto; /* push footer to the bottom when content overflows the page and when content is short */  }

  .container { /* contains category tab and checkout history */
    text-align: center;

    /* positions category tab and checkout history side-by-side */
    display: grid;
    grid-template-columns: 2fr 10fr;

    height:100%;
    width:100%;
  }

  /*Invisible flex box under category tab */
  #category-tab {
    position: sticky;
    top:150px;
    right: 0;

    background: #154734;

    height: 100%;
    width: 100%;
  }

  .display-section {

  }
  </style>