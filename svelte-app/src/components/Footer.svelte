<script>
    //let src = "images/CometCupboard_transparent.png";
    //let src = 'C:/Users/sophi/Desktop/F22CometCupboard/Comet-Cupboard/svelte-app/public/CometCupboard_transparent.png';
    //let src = 'https://icon-library.com/images/22224-tiger-icon_5825.png';
    import CometCupboardLogo from '../../public/images/CometCupboard_transparent.png';
    //import CometCupboardLogo from '../assets/CometCupboard_transparent.png'
</script>

<footer>
  <div>
      <!-- <img src="images/CometCupboard_transparent.png" alt="JYgjhgGjJHJA." /> -->
      <img src={CometCupboardLogo} alt="Comet Cupboard logo." />
  </div>

  <div class="contact">
    <p>
      <b>Office Telephone:</b> 972-883-6613
    </p>

    <p>
      <b>Email:</b> cupboard@utdallas.edu
    </p>

    <p>
      <b>Location:</b> MC 1.604
    </p>
  </div>

  <p class="mission">
    <b><i>
    The Comet Cupboard is a UT Dallas food pantry initiative dedicated to helping students in need. Its primary mission is to provide necessary food and personal care items to members of the UT Dallas community.
    </i></b>
  </p>

</footer>

<style>
  footer {
    background: #626262;
    /* min-width: 810px; */
    padding: 15px;
    margin: 0;
  }
  /* div {
    display: flex;
    flex-direction: column;
    align-items: center;
  } */

  div {
    display: inline-block;
    padding-right: 70px;
  }

  img {
    width: 240px;
  }

  p {
    color: white;
    font-size: 15px;
  }

  .contact {
    text-align: left;
  }

  .mission {
    font-size: 14px;
  }
  </style>