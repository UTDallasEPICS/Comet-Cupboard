<script>
    import CometCupboardLogo from '../../src/images/CometCupboard_transparent_orange.png';
    import CartIcon from "../../src/images/cart-icon.png"
    import AccountIcon from "../../src/images/account-circle-icon.png"
</script>

<header class="flex-container">
  <div class="header-left">
    <a href="#/"> <!-- takes user to Shop for Items page (home page) -->
      <img src={CometCupboardLogo} class="logo" alt="Comet Cupboard logo." />
    </a>
  </div>

  <div class="header-right">

    <a href="#/cart"> <!-- takes user to cart page -->
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

  /* div {
    display: inline-block;
  } */

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
  </style>