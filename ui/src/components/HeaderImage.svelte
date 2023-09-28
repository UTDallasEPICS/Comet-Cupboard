<!-- component for Shop For Items image header -->

<script>
  /* implement images later */
    import HeaderImage from "../../src/images/header-image.jpg"
    import SearchIcon from "../../src/images/magnify-icon.png"
    import ScanIcon from "../../src/images/scan-icon.png"
</script>

    <!-- <img src={HeaderImage} class="header-image" alt="Mac and cheese header." /> -->

<div class="image-container">
    <h1>Shop for Items</h1>
    
</div>

<style>
  .image-container {
    width: 100%;
    height: 263px;

    background-image: url("../../src/images/header-image.jpg"); 
    background-repeat: no-repeat;
    background-size: cover;
  }

  .image-container h1 {
    padding-top: 90px;
    margin: 0;

    color: white;
    font-size: 45px;
    text-shadow: rgb(61, 61, 61) 1px 0 10px;
  }
  </style>