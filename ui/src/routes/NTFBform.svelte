<!-- NTFB form page -->
<script>
    // importing components
    import TopBar from '../components/TopBar.svelte';
    import HeaderImage from '../components/HeaderImage.svelte';
    import Footer from '../components/Footer.svelte';
    import CheckoutHistory from '../components/CheckoutHistory.svelte';
    import CategoryTabs from '../components/CategoryTabs.svelte';
    import CategorySection from '../components/CategorySection.svelte';
    import NorthTexasFoodBankForm from '../components/NorthTexasFoodBankForm.svelte';
  </script>

<div class="flex-wrapper">
  <div class="header">
    <TopBar />
  </div>
  </div>

  <div class="footer">
    <Footer />
  </div>

  <style>
    .header {
      /* make header stay on top of page at all times */
      position: sticky;
      top: 0;
  
      /* make header stay in front of all items */
      z-index: 2;
    }

    .footer {
    margin-top: auto; /* push footer to the bottom when content overflows the page and when content is short */  
    }
  </style>
