<!-- 
  This file is for building the Cart Page
-->

<!--JAVASCRIPT HERE-->
<script>
  //components that are imported from Figma designs
    import TopBar from '../components/TopBar.svelte'
    import Footer from '../components/Footer.svelte'
</script>

<!-- HTML HERE-->
<div class="flex-wrapper">
  <!--header-->
  <div class="header">
    <TopBar />
  </div>
  <!-- title of page-->
  <h1>Cart</h1>

  <div class="content">
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
    <p>content</p>
  </div>

  <!-- footer -->
  <div class="footer">
    <Footer />
  </div>
</div>

<!-- CSS HERE-->
<style>
  /* makes header stay on top of page at all times */
  .header {
    position: sticky;
    top: 0;
  }

  /*push footer to the bottom when content overflows the page 
  (aka you need to scroll down the page) and when content is short*/
  .footer {
    margin-top: auto; 
  }
</style>