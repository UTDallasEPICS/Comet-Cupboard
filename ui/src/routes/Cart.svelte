<!-- This file is for building the Cart Page -->

<script lang="ts">
  //importing components
  //import IconButton from '@smui/icon-button';
  import { Confirm } from 'svelte-confirm'

    import ProfilePage from '../components/ProfilePage.svelte';
    import TopBar from '../components/TopBar.svelte'
    import Footer from '../components/Footer.svelte'
    import ItemCardCart from '../components/ItemCardCart.svelte'
   // export let item;
  //importing from SMUI
    import Wrapper from '@smui/touch-target';
    import Button, { Label, Icon } from '@smui/button';
    let clicked = 0;

  let dropDownOpen = false;

  //importing sample data
  import { cartContents, inventory, itemsInCart, pantryInCart, snacksInCart, grainsInCart,
           breakInCart, soupInCart, proteinInCart, houseInCart, personalInCart, fruitsInCart,
           vegInCart } from '../stores.js';
    import { loop_guard } from 'svelte/internal';
    function confirmation() {
    if (confirm("Hi Volunteer! Are these " + $itemsInCart + " items ready to be checked out?"))
      return true;
    else
      return false;
  }

</script>

<div class="flex-wrapper">
  <div class="header"> <!--header-->
    <TopBar />
  </div>
  <div class="container">
   
    </div>
    <div class="side-by-side">
      <div class="shop-for-items-button" style="display:flex; flex-wrap:wrap; align-items:center;"> <!-- Shop for Items back button -->
        <Wrapper>
          <a href="#/">
            <Button on:click={() => clicked++} variant="raised" touch>
              <Icon class="material-icons">arrow_back_ios</Icon>
              <Label>Shop for Items</Label>
            </Button>
          </a>
        </Wrapper>
      </div>
      <h1>Cart</h1> <!-- title of page-->
      <div class="item-dropdown">
        <button on:click class ="item-button">Item Totals</button>
        <div id="dropdown-list" class="item-dropdown-cat">
          Total: {$itemsInCart} <br>
          Pantry Staples: {$pantryInCart} <br>
          Snacks: {$snacksInCart} <br>
          Grains: {$grainsInCart} <br>
          Breakfast Grains: {$breakInCart} <br>
          Soup: {$soupInCart} <br>
          Protein: {$proteinInCart} <br>
          Household Items: {$houseInCart} <br>
          Personal Care: {$personalInCart} <br>
          Fruits: {$fruitsInCart} <br>
          Vegetables: {$vegInCart}
        </div>
      </div>
    </div> 
   
      {#each $cartContents as cartItem, index (cartItem.id)} <!--adds sample data  from stores.js-->
        <!--<ItemCardCart bind:item={$cartContents[index]}/>-->
        <ItemCardCart bind:item={$cartContents[index]}></ItemCardCart>
        <p hidden>{$cartContents = $cartContents}</p> <!--updates cartContents array-->
      {/each}
  </div>
   
  <div class="checkoutbutton">
   <button on:click={confirmation}>
    Checkout
    </button>
  </div>
  
  <div class="footer"> <!-- footer -->
    <Footer />
  </div>
  


  <style>
    /*styles flex box*/
     .flex-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 74vh;
    }
    /*styles header*/
    .header {
      position: sticky; /* make header stay on top of page at all times */
      top: 0;
      z-index: 2;       /* make header stay in front of all items */
    }
    /*holds all of the content on page*/
    .container {
      z-index: 0;             /* make header stay in front of all items */
      display: flex;          /* using flex box to align items to center */
      flex-direction: column;
      align-items: center;
    }
    /*makes everything within it lay side-by-side w/o interference w/ each other*/
    .side-by-side {
      text-align: center;
      /*display: flex;                  /* positions both elements side-by-side */
      justify-content: space-between;
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
   /*styles Cart title*/
   h1 {
      text-align: center;
      margin-top: 25px;
    }
   
   /*styles footer*/
   .footer {
     /* margin-top: auto; */
     position: sticky;
    }

    /*styles checkout button*/
  .checkoutbutton {
    padding: 15px;
    padding-left: 35px;
  
  }

  .item-dropdown {
    display: block;
    position: relative;
    text-align: center;
    background-color: #d9d9d900;
    color: #154734;
    font-weight: bold;
    font-family: Inter, sans-serif;
    letter-spacing: normal;
    text-transform: none;
    line-height: 45px;
    border-radius: 35px;
  }

  .item-dropdown-cat {
    display: none;
    margin: auto;
    width: 175px;
    text-align: left;
    z-index: 2;
    display: none;
    overflow: auto;
    background-color:#fff;
    border-radius: 25px;
    box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.4);
    padding: 10px;
  }

  .item-dropdown:hover .item-dropdown-cat {
    display: block;
  }

  .item-button {
    display: inline-block;
    text-align: center;
    background-color: #D9D9D9;
    color: #154734;
    font-weight: bold;
    font-family: Inter, sans-serif;
    letter-spacing: normal;
    text-transform: none;
    line-height: 15px;
    border-radius: 35px;
    box-shadow: 0px 2px 4px 0px rgb(169, 169, 169);
  }

  .show {display:block;}
    
  </style>