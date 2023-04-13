<!-- displays user's checkout history -->
<script lang="ts">
  // sends this as a prop to ItemPopup
  export let open = false;  // bool for if ItemPopUp should be open/displayed to user

  // import from stores.js
  import { inventory, 
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
		// let str = JSON.stringify(obj, null, 4); // outputs object into a formatted string for debugging
		// console.log(str); // Logs output to dev tools console.
		// console.log(obj.image_src);
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

<div>
  <h1>Checkout History</h1>
  <div>
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
  <div class="item-grid">
    {#each $inventory as _, index}
      <Wrapper>
        <!-- binds the correct item to display to each ItemCard component and sends it into function to handle click -->
        <ItemCard on:click={() => (handleItemCardClick($inventory[index]))} bind:item={$inventory[index]} />
      </Wrapper>
    {/each}
  </div>
</div>

<!-- binds open value to ItemPopUp component so that parent component's open is updated when child component updates open -->
<ItemPopUp bind:open={open} />

<style>
  h1 {
    font-size: 35px;
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
    /* place-items: baseline normal; */
    align-items: start;
    justify-items: center;
    /* justify-content: space-between; */
    margin: 40px;
  }

  /* changes color of selected text option in menu */
  :global(.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text) {
      color: #154734 !important;
  }

  /* changes color of select menu's label when focused */
  :global(.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label) {
    color: #154734 !important;
  }
</style>