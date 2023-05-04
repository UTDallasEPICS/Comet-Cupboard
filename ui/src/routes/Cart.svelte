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
  import { cartContents, itemsInCart, pantryInCart, snacksInCart, grainsInCart,
           breakInCart, soupInCart, proteinInCart, houseInCart, personalInCart, fruitsInCart,
           vegInCart } from '../stores.js';

    function confirmation() {
    if (confirm("Hi Volunteer! Are these " + $itemsInCart + " items ready to be checked out?"))
      return true;
    else
      return false;
  }

  function dropDown()
  {
    if (dropDownOpen == false)
    {
      document.getElementById("dropdown-list").style.display = "block";
      dropDownOpen = true;
    }
    else
    {
      document.getElementById("dropdown-list").style.display = "none";
      dropDownOpen = false;
    }
  }

  /*function checkoutPop()
  {
    if (checkOutOpen == false)
    {
      document.getElementById("checkout-box").style.display = "block";
      document.getElementById("op").style.background = "black, 0, 0, 0, 0.5";
      checkOutOpen = true;
    }
    else
    {
      document.getElementById("checkout-box").style.display = "none";
      document.getElementById("op").style.background = "black, 0, 0, 0, 1";
      checkOutOpen = false;
    }
  }*/

</script>

<div id="op" class="opacity">
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
      {#if $cartContents.length != 0}
      <div class="item-dropdown">
        <button on:click={() => dropDown()} class ="item-button">Item Totals</button>
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
      {/if}
    </div> 
    {#if $cartContents.length==0}
    <h3><b> PLEASE ADD ITEMS TO YOUR CART</b></h3> 
    
    {/if}
 
      {#each $cartContents as cartItem, index (cartItem.id)} <!--adds sample data  from stores.js-->
        <!--<ItemCardCart bind:item={$cartContents[index]}/>-->
        
        <ItemCardCart bind:item={$cartContents[index]}></ItemCardCart>
        <p hidden>{$cartContents = $cartContents}</p> <!--updates cartContents array-->
      {/each}
</div>

{#if $cartContents.length!=0}

<!-- ignore error squiggles on themeColor, it is working-->
<Confirm
          confirmTitle="Checkout"
          cancelTitle="Cancel"
          themeColor="140"

          let:confirm="{confirmThis}"
>  
          <div class="checkoutbutton"> <!--checkout button-->
            <button on:click={() => confirmThis()}>Checkout</button>
          </div>
          
          <span slot="title">
            Checkout
          </span>
          <span slot="description">
            Are you ready to checkout?
          </span>
        </Confirm>
{/if}
 
  
  <div class="footer"> <!-- footer -->
    <Footer />
  </div>
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
   h3{
    text-align: center;
     padding-top: 150px;
     color: gray;
   }
   /*styles footer*/
   .footer {
     /* margin-top: auto; */
     position: sticky;
    }

  button {
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
    /*styles checkout button*/
  .checkoutbutton {
    display: hidden;
    padding: 15px;
    padding-left: 35px;
  }

  .item-dropdown {
    display: block;
    position: relative;
    line-height: 45px;
    border-radius: 35px;
  }

  .item-dropdown-cat {
    display: none;
    font-weight: bold;
    margin: auto;
    position: absolute;
    width: 175px;
    text-align: left;
    z-index: 2;
    overflow: auto;
    background-color:#fff;
    border-radius: 25px;
    box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.4);
    padding: 10px;
  }

  .item-button {
    display: inline-block;
    text-align: center;
    position: absolute;
    right: 81vw;
    bottom: .5vw;
  }   
  
  /*
  If making a custom checkout button format, here is a white box that pops up on top of the cart page

  .checkout-popup
  {
    display: none;
    vertical-align: middle;
    position: absolute;

    line-height: normal; /* fixes spacing of text */
    /*
    left: 0;
    right: 0;

    box-shadow: 0px 0px 100px 30px rgba(0.4,0.4,0.4,0.4);
    margin-left: auto;
    margin-right: auto;
    border:rgb(180, 180, 180);
    border-width: 10px;
    border-radius: 25px;

    transform: translateY(-180%);

    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
    /* makes text have 1 word per line */
    /*
    padding-left: 15px;
    padding-right: 15px;

    color: rgb(182, 60, 60);

    background-color: #F5F4F4;
    font-size: 20px;
    z-index: 4;
  }*/

  .opacity
  {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black, 0, 0, 0, 1;
    z-index: 10;
  }

  </style>