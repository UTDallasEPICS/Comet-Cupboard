<!-- item card displayed in checkout history -->
<script>
  let itemName = 'Item name'; /* placeholder */
  let hasDeal = true;         /* placeholder ; does the item have a deal */
  let hasImage = false;       /* placeholder; does item have an image */
  let itemDeal = 'Deal: 2 for 1'; /* placeholder ; deal for item */
</script>

<div>
    <div class="white-box">
      <div class="deal-label">
        <p>{itemDeal}</p>
      </div>
      <p>Image Coming Soon</p>
    </div>
    <p class="item-name"><b>{itemName}</b></p>
</div>

<style>
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