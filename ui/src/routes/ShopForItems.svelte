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

  .header {
    position: sticky;
    top:0;
    z-index: 2;
    width:100vw;
  }

  .content {
    z-index: 0;  
  }

  .footer {
    margin-top: auto; /* push footer to the bottom when content overflows the page and when content is short */  
}

  .container {
    text-align: center;

    display: grid;
    grid-template-columns: 3fr 9fr;

    height:100%;
    width:100%;
  }

  #category-tab {
    position: sticky;
    top:101.85px;
    right: 0;

    background: #154734;

    height: 90vh;
  }

  .display-section {
    overflow-y: scroll;
    width:100%;
    height:100%;
  }
  </style>