<script>
    import CometCupboardLogo from '../../public/images/CometCupboard_transparent.png';
    import CartIcon from "../../public/images/cart-icon.png"
    //import HeaderImage from "../../public/images/header-image.jpg"
    import AccountIcon from "../../public/images/account-circle-icon.png"
</script>

<header class="flex-container">
  <div class="header-left">
      <img src={CometCupboardLogo} class="logo" alt="Comet Cupboard logo." />
  </div>

  <div class="header-right">

    <img src={CartIcon} class="cart" alt="Cart icon." />
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
  }

  .flex-container {
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
  }

  .header-left {
    /* flex: 2 1 0%; */
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