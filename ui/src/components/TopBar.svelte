<script>
    import CometCupboardLogo from '../../src/images/CometCupboard_transparent_orange.png';
    import CartIcon from "../../src/images/cart-icon.png"
    import AccountIcon from "../../src/images/account-circle-icon.png"
    import { itemsInCart } from '../stores.js';
</script>

<header class="flex-container">
  <div class="header-left">
    <a href="#/"> <!-- takes user to Shop for Items page (home page) -->
      <img src={CometCupboardLogo} class="logo" alt="Comet Cupboard logo." />
    </a>
  </div>

  <div class="header-right">

    <a href="#/cart"> <!-- takes user to cart page -->
      {#if $itemsInCart !== 0}
      <span class="cart-items">{$itemsInCart}</span>
      {/if}
      <img src={CartIcon} class="cart" alt="Cart icon." />
    </a>
    <!-- <div> -->
      <img src={AccountIcon} class="account" alt="Account icon." />
    <!-- </div> -->
    <!-- <p>NetID</p> -->
  </div>
  <!-- <div class="header-right">
    <img src={AccountIcon} class="account" alt="Account icon." />
  </div> -->
</header>

<style>
  header {
    background: #154734;
    margin: 0;

    display: flex;
    justify-content: space-between;
  }

  .logo {
    width: 160px;
    padding: 15px;
    padding-top: 20px;

    align-self: flex-start;
  }

  .cart {
    width: 48px;
    padding-right: 15px;
    padding-bottom: 20px;
  }

  .account {
    width: 48px;
    padding-bottom: 20px;
    padding-right: 15px;
  }

  .header-right {
    align-self: flex-end;
    /* flex: 1 1 0%; */
  }

  /*Not connected to cart page yet, will only show 1*/
  .cart-items {
    /* circle shape, size and position */
    position: absolute;
    right: 8.7em;
    top: 1.7em;
    min-width: 1.6em;
    height: 1.6em;
    border-radius: 0.8em;
    border: 0.05em solid white;
    background-color: #E87500;
    /* number size and position */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    color: white;
  }
  </style>