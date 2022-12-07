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
  <div class="container">
    <div class="side-by-side">
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
      <!-- <div class=""> -->
      <h1>Cart</h1>
      <!-- </div> -->
    </div>
  </div>
  <!-- footer -->
  <div class="footer">
    <Footer />
  </div>
</div>

<!-- CSS HERE -->
<style>
   .flex-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* width: 100%; */
  }

  /*styles header*/
  .header {
    /* make header stay on top of page at all times */
    position: sticky;
    top: 0;

    /* make header stay in front of all items */
    z-index: 2;
  }

  .container {
    z-index: 0;  /* make header stay in front of all items */

    /* using flex box to align items to center */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /*styles footer*/
  .footer {
    margin-top: auto; 
  }

  .side-by-side {
    text-align: center;
    /* align-items: center; */

    /* positions both elements side-by-side */
    display: flex;
    justify-content: space-between;
  }

  /*styles Cart title*/
  h1{
    text-align: center;
    margin-top: 25px;
  }

  /*styles Shop for Items button*/
  .shop-for-items-button {
    margin: 20px 15px;
    position: absolute;
    left: 0;
  }

  * :global(.mdc-button--raised:not(:disabled)) {
      background-color: #D9D9D9 !important;
      color: #154734 !important;
  }

  * :global(.mdc-button--raised) {
      font-weight: bold !important;
      font-family: Inter, sans-serif !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      line-height: 45px !important;
      border-radius: 35px;
  }

</style>