<!-- 
  This file is for building the Cart Page
-->

<!--JAVASCRIPT HERE-->
<script lang="ts">
  //components that are imported from src/components
    import TopBar from '../components/TopBar.svelte'
    import Footer from '../components/Footer.svelte'

  //imports elements needed for buttons from SMUI
    import Wrapper from '@smui/touch-target';
    import Button, { Label, Icon } from '@smui/button';
    let clicked = 0;
</script>

<!-- HTML HERE-->
<div class="flex-wrapper">

  <!--header-->
  <div class="header">
    <TopBar />
  </div>

  <!-- Shop for Items back button -->
  <div class="shop-for-items-button" style="display:flex; flex-wrap:wrap; align-items:center;">
    <Wrapper>
      <a href="#/">
      <Button on:click={() => clicked++} variant="raised" touch>
        <Icon class="material-icons">arrow_back_ios</Icon>
        <Label>Shop for Items</Label>
      </Button>
      </a>
    </Wrapper>
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

<!-- CSS HERE -->
<style>

  /*styles header*/
  .header {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  /*styles footer*/
  .footer {
    margin-top: auto; 
  }

  /*styles Cart title*/
  h1{
    position: relative;
    left: -90px;
  }

  /*styles Shop for Items button*/
  .shop-for-items-button {
    float: left;
    margin: 20px 15px;
  }

  :global(.mdc-button--raised:not(:disabled)) {
      background-color: #D9D9D9 !important;
      color: #154734 !important;
  }

  :global(.mdc-button--raised) {
      font-weight: bold !important;
      font-family: Inter, sans-serif !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      line-height: 45px !important;
  }

</style>