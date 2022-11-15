<!-- displays user's checkout history -->
<script lang="ts">
    import Select, { Option } from '@smui/select';
    import SortIcon from '../images/sort-icon.png';
    import Icon from '@smui/select/icon';
    import ItemCard from './ItemCard.svelte';
  
    let fruits = ['Apple', 'Orange', 'Banana', 'Mango'];
  
    let value = '';
    let valueHelperText = '';
    let valueLeadingIcon = '';
    let valueInvalid = '';
  </script>

<div>
    <h1>Checkout History</h1>
    <Select variant="filled" bind:value={valueLeadingIcon} label="Leading Icon">
        <!-- <img src={SortIcon} class="sort-icon" alt="Sort icon." /> -->
        <Icon class="material-icons" slot="leadingIcon">event</Icon>
        <Option value="" />
        {#each fruits as fruit}
          <Option value={fruit}>{fruit}</Option>
        {/each}
      </Select>
  
      <pre class="status">Selected: {valueLeadingIcon}</pre>
    <div class="item-list">
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
    </div>
</div>

<style>
  .item-list {
    /* grid styles */
    display: grid;
    column-gap: 1rem;
    row-gap: 2rem;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    grid-template-rows: repeat(6, 1fr);
    grid-auto-flow: dense;
    /* grid-gap: 2rem; */
    /* place-items: baseline normal; */
    align-items: start;
    justify-items: center;
    /* justify-content: space-between; */
    margin: 40px;
  }

  h1 {
    font-size: 35px;
  }

  .sort-icon {
    width: 25px;
  }
</style>