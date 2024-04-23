<!-- This file is for building the Cart Page 
      Use flex-column for item cards
      make sure that everything is grid aligned and not fixed so the right containter doesnt move 
      add select all and remove button when clicking an item card it should highlight to orange outline
      have a boolean value for isSelected, if true than apply the orange style to the itemcard
      when remove is clicked all the highlighted cards will disappear, updating item count in array and categories
      in the itemcarcard, add the quaitity button file at the top and it should appear in the card
      the quantity should reflect in all the arrays
      have states of selecte or not in the itemcard object itself
      // bugs in documentation, the select button, and the quantity button not updating the items in cart
    -->

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
    let deleted = false ;

  

  //importing sample data
  import { cartContents, itemsInCart, pantryInCart, snacksInCart, grainsInCart,
           breakInCart, soupInCart, proteinInCart, houseInCart, personalInCart, fruitsInCart,
           vegInCart} from '../stores.js'; 

    
    // resets cart for demo
    function confirmation() {
    if (confirm("You're checked out!"))
    {
      $cartContents = [];
      $itemsInCart = 0;
      $pantryInCart = 0;
      $snacksInCart = 0;
      $grainsInCart = 0;
      $breakInCart = 0;
      $soupInCart = 0;
      $grainsInCart = 0;
      $vegInCart = 0;
      $personalInCart = 0;
      $houseInCart = 0;
      $proteinInCart = 0;

      return true;
    }
  }
  // use for quanity button in cart
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

  
let isSelectMode = false;
let isSelectAllActive = false;


// Update selectedItems based on $cartContents
$: selectedItems = $cartContents.map(() => false);

function toggleSelectMode() {
    isSelectMode = !isSelectMode;
    console.log(selectedItems);
    if (isSelectMode) {
        isSelectAllActive = false; 
    }
    else{
      selectedItems.fill(false);
    }
    selectedItems = [...selectedItems]; 
    
}

function toggleSelectAll() {
    isSelectAllActive = !isSelectAllActive;
    console.log($cartContents);
    if (isSelectAllActive) {
        // Activate 'Select All'
        isSelectMode = false; // Deactivate 'Select Mode'
        selectedItems.fill(true); // Set all items as selected
    } else {
        
        selectedItems.fill(false); 
    }

    
    selectedItems = [...selectedItems];

    console.log(selectedItems); // Debugging: Check the state of selectedItems
    console.log($cartContents);
}


function toggleItemSelected(index) { 
  console.log(index,"Test");
    if (isSelectMode) {
        selectedItems[index] = !selectedItems[index];
        selectedItems = [...selectedItems];
    }
    console.log(selectedItems)
}

function removeSelectedItems() { 
  console.log(isSelectAllActive, isSelectMode, selectedItems);
    if (isSelectAllActive) {
        $cartContents = [];
        $itemsInCart = 0;
    } else if (isSelectMode) {
        // let removedItemCount = 0;
      
        $cartContents.forEach((item, index) => {
            if (selectedItems[index]) {
               console.log(item,"Nava test 1");
               handleDelete(item,index);
            } 
        });
        
    }
    console.log("After removal:", $cartContents, $itemsInCart, selectedItems);
    resetSelection();
}
// when clicked, the array for selectedItems doesnt update to true

const handleDelete = (item,index=-1) =>{ // removes item from cart
    // deleted = true;
    // if (deleted == true)
    // {
      console.log(index,"Nava");
      if(index==-1)
      {
        index = $cartContents.indexOf(item, 0);
      }
      if(index!=-1)
      {
        $cartContents.splice(index, 1);
        categorySubtraction(item.category, item.amount);
        itemsInCart.update(n => n - item.amount);
      }
    // }    
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


function resetSelection() { 
    selectedItems.fill(false);
    isSelectMode = false;
    isSelectAllActive = false;
    selectedItems = [...selectedItems]; 
}


  // function that when select button is clicked and then remove button is clicked, it removes the item from the cart
  // function removeItem()

</script>

<div id="op" class="opacity">
  <div class="flex-wrapper">
    <div class="header"> <!--header-->
      <TopBar />
    </div>
  <div class="container">
  </div>
  
    <div class="side-by-side">
      <h1>Cart</h1> <!-- title of page-->
      <div class="buttons-container"> <!-- flexbox for buttons on top -->
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
        <div class="select-button {isSelectMode ? 'selected' : ''}" style="display:flex; flex-wrap:wrap; align-items:center;"> <!-- Select Button -->
          <Wrapper>
            {#if $cartContents.length > 0}
              <Button on:click={toggleSelectMode} variant="raised" touch> <!-- Add functionality later-->
                <Label>Select</Label>
              </Button>
            {/if}
          </Wrapper>
        </div>
        <div class="select-all-button {isSelectAllActive ? 'selected' : ''}" style="display:flex; flex-wrap:wrap; align-items:center;"> <!-- Select All Button -->
          <Wrapper>
            {#if $cartContents.length > 0}
            <Button on:click={toggleSelectAll} variant="raised" touch> <!-- Add functionality later-->
                <Label>Select All</Label>
              </Button>
            {/if}
          </Wrapper>
        </div>
        <div class="remove-button" style="display:flex; flex-wrap:wrap; align-items:center;"> <!-- Select All Button -->
          <Wrapper>
            {#if $cartContents.length > 0}
              <Button class = "remove-button" on:click={removeSelectedItems} variant="raised" touch> <!-- Add functionality later-->
                <Label>Remove</Label>
              </Button>
            {/if}
          </Wrapper>
        </div>
      </div>
      
      
      {#if $cartContents.length > 0}
          <div class="checkout-area"> 
            <div class="category-container">
              <p class="fixed-category-title">Categories</p>
              <div class="scrollable-area">
                <!-- Content of scrollable area -->
                
                <p class="item-style">Pantry Staples: {$pantryInCart}</p>
                <p class="item-style">Snacks: {$snacksInCart}</p>
                <p class="item-style">Grains: {$grainsInCart}</p>
                <p class="item-style">Breakfast Grains: {$breakInCart}</p>
                <p class="item-style">Soup: {$soupInCart}</p>
                <p class="item-style">Protein: {$proteinInCart}</p>
                <p class="item-style">Household Items: {$houseInCart}</p>
                <p class="item-style">Personal Care: {$personalInCart}</p>
                <p class="item-style">Fruits: {$fruitsInCart}</p>
                <p class="item-style">Vegetables: {$vegInCart}</p>
              </div>
              <hr> 
              <div class="white-line"></div>
              
              <p id="total-text">Total: <span id="item-count">{$itemsInCart}</span> <span id="item-text">Item<span id="plural-s">s</span></span></p>

            </div>
            <Confirm
              confirmTitle="Checkout"
              cancelTitle="Cancel"
              themeColor="140" 
              let:confirm="{confirmThis}"
            >  
              <div class="checkoutbutton">
                <button on:click={() => confirmThis(confirmation)}>Verify Checkout</button>
              </div>
              <span slot="title">
                Checkout
              </span>
              <span slot="description">
                Are you ready to checkout?
              </span>
            </Confirm>
          </div>
        {/if}

        {#if $cartContents.length == 0}
          <h2><b> PLEASE ADD ITEMS TO YOUR CART</b></h2>
        {/if}

        {#each $cartContents as cartItem, index (cartItem.id)}
          <ItemCardCart
            bind:item={$cartContents[index]}
            isSelected={selectedItems[index]}
            isSelectMode={isSelectMode}
            on:itemSelected={() => {toggleItemSelected(index); console.log("Test");}}>
            
          </ItemCardCart>
          <p hidden>{$cartContents = $cartContents}</p> <!--updates cartContents array-->
        {/each}
    </div>
</div>


 
  
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
      margin-top: 2em;
      position: relative;
      left: 0;
    }
    .buttons-container {
      display: flex;
      align-items: center; /* Aligns items vertically in the center */
      /* Additional styling as needed */
    }

    .select-button {
      margin-left: 0px; /* Adjust this value to set the horizontal distance */
      margin-top: 1em;
      /* Additional styling for the button */
    }

    .select-all-button {
      margin-left: 10px; /* Adjust this value to set the horizontal distance */
      margin-top: 1em;
      /* Additional styling for the button */
    }
    .remove-button {
      margin-left: 10px;   
      margin-top: 1em;
    }
    .checkout-area {
      display: flex;
      flex-direction: column;
      align-items: flex-end; /* Align children to the right */
      position: absolute;
      top: 20%; /* Adjust as needed */
      right: 5%; /* Use percentage for responsiveness */
      width: 20vw; /* Adjust width as needed */
    }
    .category-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20vw;
      height: 50vh;
      top: 60%;
      right: 65%;
      position: relative;
      border-radius: 10px; /* Provides curved edges */
      background-color: #154734; /* Background color for the box */
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */

      min-width: 200px; /* Minimum width */
      max-width: 400px; /* Maximum width */
      min-height: 250px; /* Minimum height */
      max-height: 500px; /* Maximum height */
        
    }
    .scrollable-area {
    height: 55%; /* Adjust to the appropriate height for your layout */
    overflow-y: auto; /* Enable vertical scrolling */
    scrollbar-width: auto; /* Hide scrollbar for Firefox */
    -ms-overflow-style: auto; /* Hide scrollbar for Internet Explorer and Edge */
    color: white; /* Text color */
    font-weight: bold; /* Bold text */
    }
    .scrollable-area::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Webkit browsers */
    
    }
    
    .scrollable-area .item-style {
    color: white;
    font-size: 1.5em;
    text-align: left;
    margin-right: 100px;
    padding: 4px;
}

.fixed-category-title {
    position: sticky;
    
    color: white;
      font-weight: bold;
      font-size: 3em;
      text-align: center;
      margin: 5 px;
      padding: 0;
      position: relative;
}

    

    .white-line {
      width: 100%; /* Spans the entire width of the green box */
      height: 3px; /* Adjust the height of the line */
      background-color: white; /* Sets the color of the line */
      position: absolute;
      top: 82%; /* Adjusts the position vertically */
      transform: translateY(-50%); /* Centers the line */
    }

    .checkoutbutton {
    position: relative;
    padding: 25px;
    font-size: 2.0vw;
    right: 70%;
    color: white;
    font-weight: bold;
    
   }

    #total-text { /*<p id="item-detail-title"> */
      font-size: 2.5em; /* Set the desired font size */
      text-align: center; /* Aligns text in the center */
      position: absolute;
      font-weight: bold; /* Adds bold to the text */
      bottom: 0%; /* Positions the text in the middle */
      transform: translateY(50%);
      width: 100%; /* Spans the entire width */
      color: white
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
    * :global(.remove-button .mdc-button--raised) {
        background-color: red !important;
        color: #D9D9D9 !important;
    }
    
    * :global(.select-button.selected .mdc-button--raised) {
      background-color: #154734 !important; /* New background color when selected */
      color: #D9D9D9 !important; /* New text color when selected */
    }

    * :global(.select-all-button.selected .mdc-button--raised) {
      background-color: #154734 !important; /* New background color when selected */
      color: #D9D9D9 !important; /* New text color when selected */
    }

    
   /*styles Cart title*/
   h1 {
      text-align: center;
      margin-top: 10px;
      position: fixed;
      left: 50%; /* Position 50% from the left side of the viewport */
      transform: translateX(-50%); /* Shift it back 50% of its own width */
      width: 100%; /* Optional: Set a specific width if needed */
    }
   h2{
    text-align: center;
     padding-top: 350px;
     color: #D9D9D9;
   }
   /*styles footer*/
   .footer {
     /* margin-top: auto; */
     position: sticky;
    }

  button {
    display: inline-block;
    text-align: center;
    background-color: #154734;
    color: #D9D9D9;
    font-weight: bold;
    font-family: Inter, sans-serif;
    letter-spacing: normal;
    text-transform: none;
    line-height: 15px;
    border-radius: 35px;
    box-shadow: 0px 2px 4px 0px rgb(169, 169, 169);
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