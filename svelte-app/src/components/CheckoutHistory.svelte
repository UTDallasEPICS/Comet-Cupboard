<!-- displays user's checkout history -->
<script lang="ts">
  // sends this as a prop to ItemPopup
  export let open = false;  // bool for if ItemPopup should be open/displayed to user

  // imports from SMUI
  import Select, { Option } from '@smui/select';
  import Icon from '@smui/select/icon';
  import Wrapper from '@smui/touch-target';

  // importing components
  import ItemCard from './ItemCard.svelte';
  import ItemPopUp from './ItemPopUp.svelte';

  let sorts = ['Alphabetical','Frequent'];

  let value = '';
  let valueHelperText = '';
  let valueLeadingIcon = 'Alphabetical'; // sets default value of sort to "Alphabetical"
  let valueInvalid = '';

  if (valueLeadingIcon == 'Alphabetical') {

  }
  if (valueLeadingIcon == 'Frequent') {

  }
</script>

<!-- binds open value to ItemPopUp component so that parent 
	component's open is updated when child component updates open -->
<ItemPopUp bind:open={open} />

<div>
    <h1>Checkout History</h1>
    <!-- <Select variant="filled" bind:value={valueLeadingIcon} label="Sort">
        <!- - <img src={SortIcon} class="sort-icon" alt="Sort icon." /> - ->
        <Icon class="material-icons" slot="leadingIcon">sort</Icon>
        <Option value="" />
        {#each sorts as sort}
          <Option value={sort}>{sort}</Option>
        {/each}
      </Select>
  
      <pre class="status">Selected: {valueLeadingIcon}</pre> -->

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
  
      <!-- <pre class="status">Selected: {valueLeadingIcon}</pre> -->
    </div>
    <div class="item-grid">
      <Wrapper>
        <ItemCard on:click={() => (open = true)} /> <!-- on click, set open to true so ItemPopUp is displayed -->
      </Wrapper>
      <Wrapper>
      <ItemCard on:click={() => (open = true)} />
      </Wrapper>
      <Wrapper>
      <ItemCard on:click={() => (open = true)} />
      </Wrapper>
      <Wrapper>
      <ItemCard on:click={() => (open = true)} />
      </Wrapper>
      <Wrapper>
      <ItemCard on:click={() => (open = true)} />
      </Wrapper>
      <Wrapper>
      <ItemCard on:click={() => (open = true)} />
      </Wrapper>
      <Wrapper>
      <ItemCard on:click={() => (open = true)} />
      </Wrapper>
    </div>
</div>

<style>
  h1 {
    font-size: 35px;
  }
  .item-grid {
    /* grid styles */
    display: grid;
    column-gap: 1rem;
    row-gap: 2.5rem;
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