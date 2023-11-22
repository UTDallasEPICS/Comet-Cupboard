<!-- this is displayed instead of Checkout History if user selects a category from Category Tab -->
<script>
  // sends this as a prop to ItemPopup
  export let open = false;  // bool for if ItemPopUp should be open/displayed to user

  // receives this as a prop from PantryStaples - for next semester to implement
//   export let category;      // category of items to display to user

  // import from stores.js
  import { inventory,
           itemClickedName, 
           itemClickedImageSrc, 
           itemClickedDeal, 
           itemClickedSizes, 
           itemClickedExpDates, 
           itemClickedCat,
           itemClickedId,
            categoryClicked,
        } from '../stores.js';

  // imports from SMUI
  import Select, { Option } from '@smui/select';
  import Icon from '@smui/select/icon';
  import Wrapper from '@smui/touch-target';
  import Button, { Label, Icon as ButtonIcon } from '@smui/button';

  // importing components
  import ItemCard from './ItemCard.svelte';
  import ItemPopUp from './ItemPopUp.svelte';
  import ShopForItems from '../routes/ShopForItems.svelte';
    import ShopItemGrid from './ShopItemGrid.svelte';

  let sorts = ['Alphabetical','Frequent'];  /* different sorts displayed in Sort button */

  let value = '';
  let valueLeadingIcon = 'Alphabetical'; // sets default value of sort to "Alphabetical"

  if (valueLeadingIcon == 'Alphabetical') {
   
  }
  if (valueLeadingIcon == 'Frequent') {

  }
 
  
  // @param:
  //	  obj - item to display to user in pop up
  function handleItemCardClick(obj) { /* sets and updates the item clicked's attributes to store into store.js */
    // item_clicked = obj.name;
    let str = JSON.stringify(obj, null, 4); // outputs object into a formatted string for debugging
    console.log(str); // Logs output to dev tools console.
    console.log(obj.image_src);
    itemClickedName.set(obj.name);
    itemClickedImageSrc.set(obj.image_src);
    itemClickedDeal.set(obj.deal);
    itemClickedSizes.update(sizes => sizes = obj.sizes.slice(0));
    itemClickedExpDates.update(expDates => expDates = obj.expiration_dates.slice(0));
    itemClickedCat.set(obj.category);
    itemClickedId.set(obj.id);

    open = true; // sets open to true to open the pop up once it knows which item to open
  }

  const handleCardClick = (e) => {
    let str = JSON.stringify(e, null, 4); // outputs object into a formatted string for debugging
    console.log(str); // Logs output to dev tools console.
    console.log(e.image_src);
    itemClickedName.set(e.name);
    itemClickedImageSrc.set(e.image_src);
    itemClickedDeal.set(e.deal);
    itemClickedSizes.update(sizes => sizes = e.sizes.slice(0));
    itemClickedExpDates.update(expDates => expDates = e.expiration_dates.slice(0));
    itemClickedCat.set(e.category);
    itemClickedId.set(e.id);

    open = true; // sets open to true to open the pop up once it knows which item to open
  }

</script>

<div class="container">
    <h1>{$categoryClicked.name}</h1>

    <!-- TODO: make popular items a component  -->
  <div class="popular-items-container">
    <h2>Popular Items</h2>
    <div class="item-grid"> <!-- displays current popular items in category -->
        <ShopItemGrid inv={[$inventory[0],$inventory[1],$inventory[2]]} on:itemCardClicked={(e) => handleCardClick(e)} />
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <!-- <ItemCard on:click={() => (handleItemCardClick($inventory[0]))} bind:item={$inventory[0]} /> -->
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <!-- <ItemCard on:click={() => (handleItemCardClick($inventory[1]))} bind:item={$inventory[1]} /> -->
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <!-- <ItemCard on:click={() => (handleItemCardClick($inventory[2]))} bind:item={$inventory[2]} /> -->
    </div> 
  </div>
  <div class="organization-bar">

    <div class="back-button-container">
        <a href="#/"> <!-- back button (takes user back to their Checkout History) -->
          <Button class="back-button" variant="raised">
            <ButtonIcon class="material-icons">arrow_back_ios</ButtonIcon>
            <Label>Checkout History</Label>
          </Button>
        </a>
    </div>

      <div class="select-button">
        <Select
          class="shaped-outlined"
          variant="outlined"
          bind:value={valueLeadingIcon}
          label="Sort"
        >
          <Icon class="material-icons" slot="leadingIcon">sort</Icon>
          <Option value="" />
          {#each sorts as sortOption}
            <Option value={sortOption}>{sortOption}</Option>
          {/each}
        </Select>
  </div>
  </div>
  <ShopItemGrid on:itemCardClicked={(e) => handleCardClick(e)} />

</div>

<!-- binds open value to ItemPopUp component so that parent component's open is updated when child component updates open -->
<ItemPopUp bind:open={open} />

<style>
  .container {
    /* centers popular items section */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .side-by-side { /* contains h1 and Checkout History button */
    text-align: center;

    /* positions both elements side-by-side */
    display: flex;
    justify-content: space-between;
  }

  h1 {
    font-size: 30px;
  }

  /* styles Checkout History button */
  * :global(.back-button) {
    width: 120px;
    height: 50px;
    line-height: normal;
  }

  * :global(.mdc-button--raised) {
      font-weight: bold !important;
      font-family: Inter, sans-serif !important;
      letter-spacing: normal !important;
      text-transform: none !important;
  }
  
  .back-button-container {
    /* positions Checkout History button to the left of h1 at all times */
    margin-left: 15px;
    margin-top: 10px;
  }

  /* styles Checkout History back button */
  * :global(.mdc-button--raised:not(:disabled)) {
      background-color: #D9D9D9 !important;
      color: #154734 !important;
      border-radius: 10px;
  }

  .popular-items-container {
    background-color: #F5F4F4;
    border-radius: 25px;
    box-shadow: 0 0 3px 2px rgb(0 0 0 / 0.2);

    display: flex;
    flex-direction: column;
    align-items: center; /* centers item cards inside */

    width: 95%;
  }

  .popular-items-container h2 {
    font-size: 25px;
  }

  .popular-items-container .item-grid {
    width: 90%; /* aligns this item grid with other item grid */
    align-content: space-evenly;

    /* fixes spacing issues */
    margin-top: 10px;
    margin-bottom: 10px;

    /* justify-content: space-evenly; */
  }

  .select-button {
    margin-top: 30px; /* adds spacing above select button */
  }

  /* temp css for organization bar. just wanted to move it away from side bar */
  .organization-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

</style>