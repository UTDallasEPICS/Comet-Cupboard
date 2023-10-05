<!-- shop for items page -->
<script>
  // importing components
  import TopBar from '../components/TopBar.svelte';
  import HeaderImage from '../components/HeaderImage.svelte';
  import Footer from '../components/Footer.svelte';
  import CheckoutHistory from '../components/CheckoutHistory.svelte';
  import CategoryTabs from '../components/CategoryTabs.svelte';

    $: categoryItemClicked = {};
    const handleCategoryClick = (e) => {
      console.log(e.detail);
      categoryItemClicked = e.detail;
    }

</script>

<div class="flex-wrapper">
  <div class="header">
    <TopBar />
  </div>
  <div class="content">
    <HeaderImage />
    <div class="container">
      <div id="category-tab">
        <CategoryTabs on:category-clicked(handleCategoryClick)/>
      </div>
      <div class="display-section">
        <CheckoutHistory category={categoryItemClicked} />
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

/* contains category tab and checkout history */
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