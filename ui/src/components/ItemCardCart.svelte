<!--item cards for each item on the Cart page-->

<script>
// @ts-nocheck

   import { Confirm } from 'svelte-confirm'
   import {cartContents, itemsInCart, pantryInCart, snacksInCart, grainsInCart,
           breakInCart, soupInCart, proteinInCart, houseInCart, personalInCart, fruitsInCart, vegInCart} from '../stores'
   //import from SMUI
   import IconButton from '@smui/icon-button'
   // @ts-ignore
   

  let deleted = false ;
// passed as a prop from Cart
export let item;  // item inside the cart

  let itemName = item.name;

  let hasDeal;        // does the item have a deal
  let itemDeal = "";  // deal for item text
  if (item.deal != "")  // if item has a deal label
  {
    hasDeal = true;
    itemDeal = item.deal;
  }
  else
  {
    hasDeal = false;
  }

  let hasImage = false; // does item have an image
  let image_url = "";   // image url
  if (item.image_src != "") // if item has an image url
  {
    hasImage = true;
    image_url = item.image_src;
  }
  else
  {
    hasImage = false;
  }
  const handleDelete = () =>{
    deleted = true;
    if (deleted == true)
    {
      let index = $cartContents.indexOf(item, 0);
      $cartContents.splice(index, 1);
      $cartContents = $cartContents;
      categorySubtraction(item.category, item.amount);
      itemsInCart.update(n => n - item.amount);
    }
    console.log($cartContents);
    
  }

  // subtracts from category count
  function categorySubtraction(cat, N)
  {
    if (cat === "Pantry Staples")
    {
      $pantryInCart -= N;
    }
    else if (cat === "Snacks")
    {
      $snacksInCart -= N;
    }
    else if (cat === "Grains")
    {
      $grainsInCart -= N;
    }
    else if (cat === "Breakfast Grains")
    {
      $breakInCart -= N;
    }
    else if (cat === "Soup")
    {
      $soupInCart -= N;
    }
    else if (cat === "Protein")
    {
      $proteinInCart -= N;
    }
    else if (cat === "Household Items")
    {
      $houseInCart -= N;
    }
    else if (cat === "Personal Care")
    {
      $personalInCart -= N;
    }
    else if (cat === "Fruits")
    {
      $fruitsInCart -= N;
    }
    else if (cat === "Vegetables")
    {
      $vegInCart -= N;
    }   
  }
</script>

<div> <!--item card-->
  <div class="item-card-container"> <!--item card background-->
    <div class="side-by-side">
      <div class="left"> <!--item photo on cards-->
        {#if hasImage == true}<!-- if item does have an image, then apply class 'item-image' to show it -->
        <div class="white-box" class:item-image={hasImage}>
          <div class="item-image" style="--image: url({image_url});"> <!-- passes image_url as a variable -->
            {#if hasDeal}<!-- if item has a deal, then show its deal label -->
              <div class="deal-label">
                <p>{itemDeal}</p>
              </div>
            {/if}
          </div>
        </div>
        {:else if hasImage == false} <!-- if item does not have an image, then display placeholder text -->
          <div class="white-box"> 
            {#if hasDeal}<!-- if item has a deal, then show its deal label -->
              <div class="deal-label">
                <p>{itemDeal}</p>
              </div>
            {/if}
            <p>Image Coming Soon</p>
          </div>
        {/if}
      </div>
      <div class="right"> <!--text + icons on item card-->
        <div class="side-by-side">
          <div class="item-text">
            <p id="item-detail-title"><strong>Item Name: </strong><br>Size: <br>Expiration Date: <br>Amount: </p>
            <p id="item-details"><strong>{itemName}</strong><br>{item.sizes}<br>{item.expiration_dates[0]}<br>{item.amount}</p>
          </div>
        </div>
        <Confirm
          confirmTitle="Delete"
          cancelTitle="Cancel"
          themeColor="140"

          let:confirm="{confirmThis}"
>  
          <div class="remove-button" style="display: flex; align-items: center;"> <!--remove button-->
            <IconButton class="material-icons" on:click={() =>  confirmThis(handleDelete, item)} ripple={false}>close</IconButton>
          </div>
          
          <span slot="title">
            Delete
          </span>
          <span slot="description">
            Are you sure you want to delete this item?
          </span>
        </Confirm>
      </div>
    </div>
  </div>
</div>
<style>
  /*styles item card background*/
  .item-card-container {
      background-color: #F5F4F4;
      border-radius: 10px;
      border-color: #A9A8A8;
      border-width: 1px;
      border-style: solid;
      box-shadow: 2px 3px 5px 2px rgb(0 0 0 / 0.2);
      display: flex;
      flex-direction: column;
      /* align-items: center; centers item cards inside */
      place-items: stretch stretch; /*combines align-items and justify-items*/
      width: 90vw;
      height: 15vh;
      margin-block-end: 25px;
      margin-top: 20px;
      margin-left: auto;
      margin-bottom: auto;
      margin-right: auto;
  }
  /*makes everything within it lay side-by-side w/o interference w/ each other*/
  .side-by-side {
      text-align: center;
      /* align-items: center; */
      /* positions both elements side-by-side */
      display: flex;
      justify-content: space-between;
    }
  /*styles item photo*/
  .left {
    display: flex;
    flex-shrink: 2;
    width: 100%;
    position: relative;
    top: 10px;
    left: 10px;
    justify-content: center;
  }
  .white-box {
      width: 130px;
      height: 130px;
      line-height: 130px; /* centers text horizontally */
      background-color: white;
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      /* makes deal label in front of white box */
      position: relative;
      z-index: 0;
      margin: 0;
    }
  .white-box p { /* Image Coming Soon text */
    /* centers text vertically */
    display: inline-block;
    vertical-align: middle;
    line-height: normal; /* fixes spacing of text */
    
    /* makes text have 1 word per line */
    padding-left: 15px;
    padding-right: 15px;
    color: rgb(139, 139, 139);
    font-size: 20px;
  }
  .item-image {
    width: 130px;
    height: 130px;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: var(--image); /* displays background image from url stored in 'image' */
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    /* makes deal label in front of white box */
    position: relative;
    z-index: 0;
    margin: 0;
    /* padding-top: 10px; */
  }
  .item-image p {
    /* centers deal label text horizontally */
    display: inline-block;
    vertical-align: middle;
  }
  /*styles deal label*/
  .deal-label {
    background-color: #E87500;
    border-radius: 35px;
    box-shadow: 0 3px 4px rgb(0 0 0 / 0.2);
    line-height: 1.7;  /* centers line height for text */
    height: 30px;
    width: 125px;
    top: 0;
    /* makes deal label in front of white box */
    position: absolute;
    z-index: 1;
    /* positions deal label around halfway above white box */
    transform: translateY(-60%);
  }
  .deal-label p {
    position: relative;
    font-weight: bold;
    color: white;
    font-size: 15px;
    margin: 0;
  }
  /*styled right side of the content in item cards (text, icons)*/
  .right {
    /*paragraph text style*/
    font-size: 15pt;
    display: flex;
    flex-direction: row;
    margin: 0;
    align-content: flex-end;
    width: 100%;
  }
  /*styles the text on the item card*/
  .item-text {
    position: relative;
    top: 15px;
    white-space: normal;
  }
  #item-detail-title {
    text-align: right;
    right: 0px;
  }
  #item-details {
    box-sizing: border-box;
    width: 100%;
    word-break: break-word;
    text-align: left;
    position: inherit;
    left: 170px;
    bottom: 116px;
  }
  /*styles remove button*/
  .remove-button {
    position: relative;
    left: 290px;
    bottom: 100px;
  }
  :global(.mdc-icon-button) {
    font-size: 36px !important;
  }
  </style>