<!-- item card displayed in checkout history and category section -->
<script>
    import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
    Actions,
    ActionButtons,
    ActionIcons,
  } from '../../node_modules/@smui/card';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';

  // receives this as a prop from CheckoutHistory
  export let item;  
  let itemName = item.name;
  let itemDeal = item.deal;
  let image_url = item.image_src;
</script>

<!-- These are experimental components
     they are still not complete and need to figure out
     what is the best way to design and implement them
     for it to work well in phones, tablets, and desktop/laptop
 -->

<!-- svelte-ignore a11y-click-events-have-key-events (to-do for next semester) -->
<div style="height:100%">
    <Card class="card">
        {#if itemDeal !== ""}
        <div class:dealLabel={itemDeal!==""}>
            <p>{itemDeal}</p>
        </div>
        {/if}
        <PrimaryAction on:click>
            <Media class="itemImage" aspectRatio="16x9" style="
                background-image: url({image_url});
                object-fit: fit;
            "/>
                <!-- <MediaContent>
                    {#if image_url !== ""}
                    <img class="itemImage" src={image_url} alt={itemName}>
                    {:else}
                    <div class="whiteBox">Image Coming Soon</div>
                    {/if}
                </MediaContent> -->
            <Content>
                <p class="item-name"><b>{itemName}</b></p>
            </Content>
        </PrimaryAction>
    </Card>
</div>

<!-- </Card>
<div on:click class="item-card">
    <div class:whiteBox={image_url==""} class="imageWrapper">
        {#if itemDeal !== ""}
            <div class:dealLabel={itemDeal!==""}>
                <p>{itemDeal}</p>
            </div>
        {/if}
        {#if image_url !== "" }
            <img src={image_url} alt={item.name} class="itemImage">
        {:else}
            <div class="whiteBox">Image Coming Soon</div>
        {/if}
    </div>

    <div class="info">
        <p class="item-name"><b>{itemName}</b></p>
    </div>
</div> -->

<style>
    * :global(.card) {
        padding: 0;
        box-sizing: border-box;
        border-radius: 20px;
        background: rgba(238, 238, 238, 0.93);
    }   

    * :global(.itemCard) {
        background-color: blueviolet;
        /* display: grid; */
        /* grid-template-columns: 2fr 1fr; */

        /* display: flex; */

        /* justify-content: center; */
        /* align-items: center; */
        /* gap: 1.5rem;  */
        
        box-sizing: border-box;
        border-radius: 20px;
        border: 1px solid #E9E9E9;
        background: rgba(238, 238, 238, 0.93);
  }     

    *:global(.itemImage) {
        background-repeat: repeat;
        background-size:fit;
        aspect-ratio: 16/9;
        
        
    }
  .whiteBox {
      max-width: 130px;
      max-height: 130px;

    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);

    /* makes deal label in front of white box */
    position: relative;
    z-index: 0;
  }

  .whiteBox p { /* Image Coming Soon text */
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

  .itemImage {

    background-image: url({image_url});
    background-repeat: no-repeat;
    background-size: fit;
    
    
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    
    flex: 1 0 0;
    justify-content: center;
    align-items: center;

    /* makes deal label in front of white box */
    position: relative;
    z-index: 0;
  }

  .itemImage p {
    /* centers deal label text horizontally */
    display: inline-block;
    vertical-align: middle;
  }

  .item-name {
    font-size: 20px;
    word-wrap: break-word;
    width: 130px;
  }

  .dealLabel {
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

    /* positions deal label around halfway above white box */
    transform: translateY(-60%);
  }

  .dealLabel p {
    position: relative;
    font-weight: bold;
    color: white;
    font-size: 15px;
    margin: 0;
  }

  @media screen and (min-width:600px) {

  }
  
</style>