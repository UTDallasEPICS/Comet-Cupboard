<script>
    import CometCupboardLogo from '../../src/images/CometCupboard_transparent.png';
</script>

<!-- Content in Footer includes contact info and mission statement-->
<footer>
  <div>
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
    padding: 15px;
    margin: 0;
  }
  /* div {
    display: flex;
    flex-direction: column;
    align-items: center;
  } */

  div {
    display: inline-block; /* have both img and contact side by side */
    padding-right: 70px;
  }

  img {
    width: 240px;
  }

  p { /* contact and mission */
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