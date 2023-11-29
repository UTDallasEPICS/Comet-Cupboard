<!-- This file is for building the Inventory Page -->

<script lang='ts'>
// @ts-nocheck

  //importing components
    import TopBar from '../components/TopBar.svelte'
    import Footer from '../components/Footer.svelte'
    import Table from '../components/InventoryTable.svelte'
    import { inventory } from '../stores.js'
    import ItemDetails from '../components/ItemDetails.svelte';
    import AddItemDialog from '../components/AddItemDialog.svelte';
    import EditItemDialog from '../components/EditItemDialog.svelte';
    import RemoveItemDialog from '../components/RemoveItemDialog.svelte';
    
    //importing from SMUI 
    import Button, { Label, Icon } from '@smui/button';
    import DataTable,{Body,Cell,Head,Row} from "@smui/data-table/";
    import Checkbox from '@smui/checkbox';
    import Dialog, { Actions, Content, Title } from "@smui/dialog";

    // modal listeners
    let detailOpen = false;
    let addOpen = false;
    let removeOpen = false;
    let editOpen = false;

    let cometStyle = "cometTable";
    let selected:item[];
</script>

<div class="flex-wrapper">
  <div class="header"> <!--header-->
    <TopBar />
  </div>
  <div class="container">
    <div class="side-by-side">
      <div class="shop-for-items-button" style="display:flex; flex-wrap:wrap; align-items:center;"> <!-- Shop for Items back button -->
        <!-- <Button on:click={() => clicked++} variant="raised" touch>
            <Icon class="material-icons">arrow_back_ios</Icon>
            <Label>Shop for Items</Label>
        </Button> -->
      </div>
      <h1>Inventory</h1> <!-- title of page-->
    </div> 
</div>


<div class="buttonRow">
    <!-- display each row button and write a function for each button -->
    <Button on:click={() => (addOpen = true)} ><Label>Add Item</Label></Button>
    {#if selected && selected.length==1}
        <Button on:click={() => (detailOpen = true)} ><Label>Details</Label>    </Button>
        <Button on:click={() => (removeOpen = true)}><Label>Remove Item</Label></Button>
        <Button on:click={() => (editOpen = true)}><Label>Edit Item</Label></Button>
    {:else}
        <Button disabled ><Label>Details</Label></Button>
        <Button disabled><Label>Remove Item</Label></Button>
        <Button disabled><Label>Edit Item</Label></Button>
    {/if}
</div>

<Table bind:selected tableData={$inventory} style={cometStyle}/>
<div>
    <Dialog
        bind:open={addOpen}
        class = "addDialog"
        surface$style="width: 80%; max-width: calc(100vw - 2rem);"
    >
        <AddItemDialog />
    </Dialog>
    <Dialog bind:open={detailOpen}>
        <ItemDetails bind:selected={selected} />
    </Dialog>
    <Dialog bind:open={removeOpen}>
        <RemoveItemDialog />
    </Dialog>
    <Dialog bind:open={editOpen}>
        <EditItemDialog />
    </Dialog>
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
    min-height: 100vh;
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
    display: flex;                  /* positions both elements side-by-side */
    justify-content: space-between;
  }

  /*styles Shop for Items button*/
  .shop-for-items-button {
    margin: 20px 15px;
    position: absolute;
    left: 0;
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

    * :global(.addDialog) {
        width:80%;
    }
    
    /*styles Cart title*/
    h1 {
        text-align: center;
        margin-top: 25px;
    }
    
 /*styles footer*/
 .footer {
     margin-top: auto; 
    }
</style>