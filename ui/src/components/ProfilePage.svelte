<script>
    // importing components
    import TopBar from '../components/TopBar.svelte';
    import HeaderImage from '../components/HeaderImage.svelte';
    import Footer from '../components/Footer.svelte';
</script>
<div class="flex-wrapper">
    <div class="header">
      <TopBar />
    </div>
    <div class="content">
      <HeaderImage />
      </div>
      </div>
<h1>Your Profile Page</h1>
<p>Name: Unkown Unknown</p>
<p>Netid: UUU12345</p>
<p>unkown@utdallas.edu</p>
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
    </style>