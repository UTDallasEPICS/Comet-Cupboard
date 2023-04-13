<!-- this is displayed instead of Checkout History if user selects a category from Category Tab -->
<script>
  // sends this as a prop to ItemPopup
  export let open = false;  // bool for if ItemPopUp should be open/displayed to user

  // receives this as a prop from PantryStaples - for next semester to implement
  export let category;      // category of items to display to user

  // import from stores.js
  import { inventory,
           pantry_staples_inventory,
           itemClickedName, 
           itemClickedImageSrc, 
           itemClickedDeal, 
           itemClickedSizes, 
           itemClickedExpDates, 
           itemClickedCat,
           itemClickedId} from '../stores.js';

  // imports from SMUI
  import Select, { Option } from '@smui/select';
  import Icon from '@smui/select/icon';
  import Wrapper from '@smui/touch-target';
  import Button, { Label, Icon as ButtonIcon } from '@smui/button';

  // importing components
  import ItemCard from './ItemCard.svelte';
  import ItemPopUp from './ItemPopUp.svelte';

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

    // console.log("after handleitem", $itemClickedImageSrc);
    open = true; // sets open to true to open the pop up once it knows which item to open
    // console.log("after open", $itemClickedImageSrc);
  }
</script>

<div class="container">
  <div class="side-by-side">
    <div class="back-button-container">
      <a href="#/"> <!-- back button (takes user back to their Checkout History) -->
        <Button class="back-button" variant="raised">
          <ButtonIcon class="material-icons">arrow_back_ios</ButtonIcon>
          <Label>Checkout History</Label>
        </Button>
      </a>
    </div>
    <h1>{category}</h1>
  </div>
  <div class="popular-items-container">
    <h2>Popular Items</h2>
    <div class="item-grid"> <!-- displays current popular items in category -->
      <Wrapper>
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <ItemCard on:click={() => (handleItemCardClick($inventory[0]))} bind:item={$inventory[0]} />
      </Wrapper>
      <Wrapper>
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <ItemCard on:click={() => (handleItemCardClick($inventory[1]))} bind:item={$inventory[1]} />
      </Wrapper>
      <Wrapper>
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <ItemCard on:click={() => (handleItemCardClick($inventory[2]))} bind:item={$inventory[2]} />
      </Wrapper>
    </div>
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
    <!-- debugging -->
    <!-- <pre class="status">Selected: {valueLeadingIcon}</pre> -->
  </div>
  {#if category == "Pantry Staples"}
  <div class="item-grid"> <!-- displays all items in category -->
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Pantry Staples"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Snacks"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Snacks"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Grains"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Grains"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Breakfast Grains"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Breakfast Grains"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Soup"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Soup"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Protein"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Protein"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Household Items"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Household Items"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Personal Care"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Personal Care"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {:else if category == "Fruits"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Fruits"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
    </div>
  {:else if category == "Vegetables"}
  <div class="item-grid">
    {#each $inventory as _, index}
      {#if $inventory[index].category == "Vegetables"}
        <Wrapper>
          <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
          <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
        </Wrapper>
      {/if}
    {/each}
  </div>
  {/if}
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
    position: absolute;
    left: 250px;

    margin-left: 15px;
    margin-top: 10px;
  }

  /* styles Checkout History back button */
  * :global(.mdc-button--raised:not(:disabled)) {
      background-color: #D9D9D9 !important;
      color: #154734 !important;
      border-radius: 10px;
  }

  .item-grid {
    /* grid styles */
    display: grid;
    column-gap: 1rem;
    row-gap: 2rem;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    /* grid-template-rows: repeat(4, 1fr); */
    grid-auto-flow: dense;
    /* grid-gap: 2rem; */
    width: 90%;
    /* place-items: baseline normal; */
    align-items: start;
    justify-items: center;
    /* justify-content: space-between; */
    margin: 40px;
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
</style>