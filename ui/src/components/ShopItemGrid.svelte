<script>
    import {
        inventory,
        categoryClicked
    } from "../stores"
    
    import ItemCard from './ItemCard.svelte';
    import { createEventDispatcher } from "svelte";
    import LayoutGrid, {Cell} from "@smui/layout-grid"
    const dispatch = createEventDispatcher();

    export let inv = $inventory;

    const handleItemCardClick = (clickItem) => {
        dispatch("itemCardClicked",clickItem);
    }

</script>

<!-- Maybe a dedicated grid components and the props would be how many columns you want there to be or it asks for a label thingy    -->
<div>
    <LayoutGrid class="lGrid">
        {#each inv as item, index}
            {#if $categoryClicked.name == "All" || item.category == $categoryClicked.name}
            <Cell span={4} class = "itemCell">
                <ItemCard on:click={(e) => (handleItemCardClick(item))} {item} />
            </Cell>
            {/if}
        {/each}
    </LayoutGrid>
</div>
<!-- <div id="shop-grid"  style="grid-template-columns: repeat(auto-fit, 1fr);">
            <ItemCard on:click={() => (handleItemCardClick(item))} bind:item={item} />
</div> -->

<style>

div {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

* :global(.lGrid) {
    margin: 0;
    width:100%;
}

* :global(.itemCell) {
    padding: 0;
    margin: 0;
    width:100%;
    height:100%;
}
/* #shop-grid {
    background-color: aqua;
    box-sizing: border-box;
    width:100%;
    height: 100%;

    margin: 3px auto;   
    padding: 2rem;

    display:grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); 
    grid-gap: 2rem;

} */



</style>