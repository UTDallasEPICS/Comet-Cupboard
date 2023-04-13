<!-- displayed when user clicks on item from Checkout History or Category Section -->
<!-- allows user to select size, see item's expiration date, and add item to cart -->
<script lang="ts">
  // receives this as a prop from CheckoutHistory or CategorySection
  export let open;  // bool for if ItemPopUp should be open/displayed to user
  //export let item;

  // imports from SMUI
  import Dialog, { Content, Actions } from '@smui/dialog';
  import Button, { Group, Label, Icon } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';

  // imports from stores.js
  import { itemClickedName, itemClickedImageSrc, itemClickedDeal, itemClickedSizes, itemClickedExpDates, itemsInCart, cartContents, itemClickedCat, itemClickedId } from '../stores.js';

  let quantity = 1;           // quantity of item clicked
  let isSizeSelected = false; // bool for if user has selected a size in Dialog
  let item_size = "";         // size of the item that the user selected
  let item_size_index = -1;   // index of the size of the item that the user selected inside itemClickedSizes array ; tracked so Dialog knows which exp date to display

  // handles the Size button click
  function handleClickSize(size, i) {
    item_size = size;
    item_size_index = i;
    isSizeSelected = true;
  }

  // handles the Minus quantity button click
  function handleClickMinus() {
    if (quantity != 1)  // makes sure user doesn't go below 1 for item quantity
    {
      quantity--;
    }
  }

  // handles the Add quantity button click
  function handleClickAdd() {
    if (quantity != 30)  // makes sure user doesn't go over 30 for item quantity
    {
      quantity++;
    }
  }
let reduce=1;
  $: if (quantity >= 2) {
		alert('You cannot add more than 2 items!');
		itemsInCart.update = (n=> -reduce);
	}
  // handles adding the item, quantity, size of item, expiration date, 
  // deal for item, category of item, item image source, and item id to the cart
  function handleClickAddToCart(e, N, itemSize, expDate, itemDeal, itemCategory, itemImage, itemId) {
    isSizeSelected = true;
    let doesNameExist = false;
    let doesSizeExist = false;
    let index = -1;
    let justNameIndex = -1;

    for (let i = 0; i < $cartContents.length; i++)
    {
      if (e == $cartContents[i].name)
      {
        doesNameExist = true;
        justNameIndex = i;
        if (itemSize == $cartContents[i].sizes)
        {
          doesSizeExist = true;
          console.log("Size exists");
          index = i;
        }
      }
    }

    if (doesNameExist == true && doesSizeExist == true)
    {
      $cartContents[index].amount += N;
      itemsInCart.update(n => n + N); // adds items (based on number of one item chosen (ie: chose 2 of an item, adds 2))
    }
    else if (doesNameExist == true && doesSizeExist == false) // executes only if item already exists, but size of item does
    {
      $cartContents[justNameIndex].sizes = [...$cartContents[justNameIndex].sizes, itemSize];
      $cartContents[justNameIndex].amount += N;
      console.log("sizes " + $cartContents[justNameIndex].sizes);
      console.log("Item added: " + e + " Num added: " + N + " Size: " + itemSize);
      console.log("item exp: " + expDate + " item deal: " + itemDeal + " item cat: " + itemCategory + " item id: " + itemId);
      console.log($cartContents);
      itemsInCart.update(n => n + N); // adds items (based on number of one item chosen (ie: chose 2 of an item, adds 2))
    }
    else if (doesNameExist == false)
    {
      $cartContents = [...$cartContents, 
                  {name: e, amount: N, sizes: itemSize, deal: itemDeal, 
                  expiration_dates: expDate, category: itemCategory, 
                  image_src: itemImage, id: itemId}];
      console.log("Item added: " + e + " Num added: " + N + " Size: " + itemSize);
      console.log("item exp: " + expDate + " item deal: " + itemDeal + " item cat: " + itemCategory + " item id: " + itemId);
      console.log($cartContents);
      itemsInCart.update(n => n + N); // adds items (based on number of one item chosen (ie: chose 2 of an item, adds 2))
    }
    
 //  itemsInCart.update(n => n + N); // adds items (based on number of one item chosen (ie: chose 2 of an item, adds 2))
 // itemsInCart.update(n => n + 1); // adds items (based on number of items chosen (ie: chose 2 of an item, adds 1))
  }

  let response = 'Nothing yet.';  // for debugging
 
  function closeHandler(e: CustomEvent<{ action: string }>) { /* runs this handler after closing Dialog */
    switch (e.detail.action) {
      case 'one':
        isSizeSelected = true;
        response = "case 1.";
        break;
      case 'two':
        isSizeSelected = true;
        response = "case 2.";
        break;
      case 'three':
        isSizeSelected = true;
        response = "case 3.";
        break;
      case 'add':
        isSizeSelected = false;
        response = 'Selected add to cart.';
        item_size = "";         // clears item selected when user has added the item to cart
        item_size_index = -1;   // resets index for next item selected
        quantity = 1;           // resets quantity
        break;
      default:
        // This means the user clicked the scrim or pressed Esc to close the dialog.
        // The actions will be "close".
        isSizeSelected = false;    // sets this to false so add to cart button is disabled next time ItemPopUp opens
        item_size = "";            // clears item selected
        item_size_index = -1;      // resets index for next item selected
        quantity = 1;              // resets quantity
        response = "Closed dialog.";
        break;
    }
  }
</script>

<Dialog
  bind:open
  aria-labelledby="event-title"
  aria-describedby="event-content"
  on:SMUIDialog:closed={closeHandler}
>
  <p id="event-title" class="heading-text item-name">{$itemClickedName}</p>
  <div class="container">
    <Content id="event-content">
        {#if $itemClickedImageSrc != ""}    <!-- if item does have an image, then apply class 'item-image' to show it -->
            <div class="item-image" style="--image: url({$itemClickedImageSrc});">   <!-- passes image url of item clicked as a variable -->
                {#if $itemClickedDeal != ""} <!-- if item has a deal, then show its deal label -->
                    <div class="deal-label">
                        <p>{$itemClickedDeal}</p>
                    </div>
                {/if}
            </div>
        {:else if $itemClickedImageSrc == ""} <!-- if item does not have an image, then display placeholder text -->
            <div class="white-box">
                {#if $itemClickedDeal != ""} <!-- if item has a deal, then show its deal label -->
                    <div class="deal-label">
                        <p>{$itemClickedDeal}</p>
                      </div>
                  {/if}
                  <p>Image Coming Soon</p>
            </div>
        {/if}
        <!-- display quantity to user and allow them to edit it -->
        <div class="green-quantity-box">
            <div style="display: flex; align-items: center;">   <!-- styles items in the quantity box in columns instead of rows -->
                <IconButton ripple={false} class="material-icons md-light remove-button" on:click={handleClickMinus}
                >remove</IconButton>
                <Textfield variant="outlined" bind:value={quantity} />
                <IconButton ripple={false} class="material-icons md-light add-button" on:click={handleClickAdd}
                >add</IconButton>
            </div>
        </div>
      </Content>
      <div class="right">
          <!-- display size(s) to user if applicable -->
          {#if $itemClickedSizes.length == 1}    <!-- if item has only 1 size, then display only 1 button -->
              <span class="heading-text">Size</span>
              <Button on:click={(e) => { 
                  e.stopPropagation(); 
                  handleClickSize($itemClickedSizes[0], 0)}}
                  variant="outlined" action="one" width=50px>
                  <Label>{$itemClickedSizes[0]}</Label>
              </Button>
          {:else if $itemClickedSizes.length != 0}    <!-- else if item has multple sizes, then show them using a loop -->
              <span class="heading-text">Size</span>
              <Group variant="outlined">
                  {#each $itemClickedSizes as _, index}
                      <Button on:click={(e) => {
                          e.stopPropagation();
                          handleClickSize($itemClickedSizes[index], index)}}
                          variant="outlined" action="one">
                          <Label>{$itemClickedSizes[index]}</Label>
                      </Button>
                  {/each}
              </Group>
          {/if}
          <!-- display expiration date(s) to user -->
          {#if item_size_index != -1} <!-- if user has selected a size, then display expiration date(s) -->
              <span class="heading-text exp-date-heading">Expiration Date</span>
              {#if $itemClickedExpDates.length == 1}      <!-- if item has only 1 exp date, then display only that -->
                  <span class="exp-date">{$itemClickedExpDates[0]}</span>
              {:else if $itemClickedExpDates.length != 0} <!-- else if item has multiple exp dates and size has been selected, then display the correct one depending on which size the user has selected -->
                      <span class="exp-date">{$itemClickedExpDates[item_size_index]}</span>
              {/if}
          {/if}
          <Actions>
              <!-- display Add to cart button -->
              {#if item_size_index != -1}  <!-- if user has selected a size, then display button -->
                  <Button color="primary" class="add-to-cart-button" on:click={() => 
                            handleClickAddToCart($itemClickedName, quantity, item_size, $itemClickedExpDates, 
                                                 $itemClickedDeal, $itemClickedCat, $itemClickedImageSrc, $itemClickedId)} 
                                                 variant="raised" action="add">
                      <Icon class="material-icons">add</Icon>
                      <Label>Add to cart</Label>
                  </Button>
              {/if}
          </Actions>
      </div>
  </div>
  <!-- debugging -->
  <!-- <pre class="status">Response: {response} ; selected size: {item_size}</pre> -->
  <!-- <pre class="status">selected size: {item_size}</pre> -->
  <!-- <pre class="status">quantity: {quantity}</pre> -->
</Dialog>

<style>
  /* styles the whole Dialog */
  :global(.mdc-dialog__surface) {
      padding: 40px;
      padding-bottom: 25px;
  }

  /* contains Content and .right class */
  .container {
      /* align-items: center;    vertically centers the Content and .right columns */
      display: flex; /* displays Content and .right class as columns */
      flex-direction: row;
      justify-content: center;
      align-content: center;
  }

  /* styles Action of Dialog (just Add to cart button) */
  :global(.mdc-dialog__actions) {
      display: flex !important;
      justify-content: center !important;
      flex-direction: column !important;
      /* align-items: center !important; */
      justify-content:  space-evenly !important;
      /* box-sizing: content-box !important; */

      /* line-height: 0 !important; */
      /* vertical-align: middle !important; */
  }

  /* styles whole right column of Dialog */
  .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      align-self: flex-start;

      margin-left: 25px; /* adds space between Content and right column */
  }

  * :global(.add-to-cart-button) {
      background-color: #154726;
  }

  .white-box {
  width: 200px;
  height: 200px;

  line-height: 130px; /* centers text horizontally */

  background-color: white;
  background-repeat: no-repeat;
  background-size: cover;

  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* makes deal label be in front of white box */
  position: relative;
  z-index: 0;
}

.item-image {
  width: 200px;
  height: 200px;

  background-repeat: no-repeat;
  background-size: cover;
  background-image: var(--image);

  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);

  display: flex;
  justify-content: center;
  align-items: center;

  /* makes deal label in front of white box */
  position: relative;
  z-index: 0;
}

.item-image p {
  /* centers deal label text horizontally */
  display: inline-block;
  vertical-align: middle;
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

.green-quantity-box {
  width: 200px;
  height: 48px;

  /* horizontally centers components inside */
  display: flex;
  justify-content: center;

  background-color: #154734;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgb(0 0 0 / 0.2);

  /* positions iteself around halfway below white box */
  transform: translateY(-30%);
}

  /* set text field outline to not appear */
  :global(.mdc-text-field--outlined .mdc-notched-outline) {
    opacity: 0;
  }

  /* styles text field that displays item quantity to user */
  :global(.mdc-text-field) {
    height: 30px !important;
    background-color: #0F3225 !important;
    border-radius: 10px !important;
  }

  :global(.mdc-text-field .mdc-text-field__input) {
    text-align: center !important;
    caret-color: white !important;
    color: white !important;
  }

  .heading-text {
    font-size: 20px;
    word-wrap: break-word;
    /* width: 130px; */
    font-weight: bold;
    color: black;

    padding-top: 20px;
    padding-bottom: 10px;

    /* centers text vertically */
    display: inline-block;
    vertical-align: middle;
  }

  .item-name {
    font-size: 25px;

    padding-top: 0;
    padding-bottom: 0;

    margin-top: 0;
    margin-bottom: 20px;
  }

  /* undoes 'word-wrap: break-word' */
  .exp-date-heading {
    width: 100%;
    padding-bottom: 5px;
  }

  .exp-date {
    padding-bottom: 10px;
    color: #154734;
  }

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

    /* positions deal label halfway above white box */
    transform: translateY(-50%);
  }

  .deal-label p {
    position: relative;
    font-weight: bold;
    color: white;
    font-size: 15px;
    margin: 0;
  }
</style>