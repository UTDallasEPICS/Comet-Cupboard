<script>
  //import svelteLogo from './assets/CometCupboard_transparent.png'
  //import svelteLogo from '../public/vite.svg'
  import TopBar from './components/TopBar.svelte'
  import ShopForItems from './components/ShopForItems.svelte'
  import Footer from './components/Footer.svelte'
  import CheckoutHistory from './components/CheckoutHistory.svelte'

  //var height = document.getElementById('footer').offsetHeight; -- put this in console to find height of footer
  // ^^ 238px = height of footer
</script>

<!-- sample code
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
    <ShopForItems />
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
  </div>
  <div class="footer">
    <Footer />
  </div>
</div>

<style>
  /* sample code
   .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
  */

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
  }

  .footer {
    margin-top: auto; /* push footer to the bottom when content overflows the page and when content is short */
  }
</style>