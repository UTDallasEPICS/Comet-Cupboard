<!-- item card displayed in checkout history and category section -->
<script>
  // receives this as a prop from CheckoutHistory
  export let item;  // item the user clicked on

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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events (to-do for next semester) -->
<div on:click class="item-card"> <!-- forwards the onClick event to CheckoutHistory.svelte -->
  {#if hasImage == true} <!-- if item does have an image, then apply class 'item-image' to show it -->
    <!-- <div class="white-box" class:item-image={hasImage}> -->
    <div class="item-image" style="--image: url({image_url});"> <!-- passes image_url as a variable -->
      {#if hasDeal} <!-- if item has a deal, then show its deal label -->
        <div class="deal-label">
          <p>{itemDeal}</p>
        </div>
      {/if}
    </div>
  {:else if hasImage == false} <!-- if item does not have an image, then display placeholder text -->
    <div class="white-box">
      {#if hasDeal} <!-- if item has a deal, then show its deal label -->
        <div class="deal-label">
          <p>{itemDeal}</p>
        </div>
      {/if}
      <p>Image Coming Soon</p>
    </div>
  {/if}
  <p class="item-name"><b>{itemName}</b></p>
</div>

<style>
  .item-card {
    cursor: pointer;
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
  }

  .item-image p {
    /* centers deal label text horizontally */
    display: inline-block;
    vertical-align: middle;
  }

  .item-name {
    font-size: 20px;
    word-wrap: break-word;
    width: 130px;
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