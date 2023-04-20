<script>
    // importing components
    import TopBar from '../components/TopBar.svelte';
   
    import Footer from '../components/Footer.svelte';
</script>
<div class="flex-wrapper">
    <div class="header">
      <TopBar />
    </div>
    
      </div>
      <div class="profilepage">
<h1>Your Profile Page</h1>
<p>Name: Unkown Unknown</p>
<p>Netid: UUU12345</p>
<p>Email: unkown@utdallas.edu</p>
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
    .profilepage{
        padding-bottom: 200px;
    }
    </style>