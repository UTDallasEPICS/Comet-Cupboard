<script>
    import { cartContents, pantryInCart, snacksInCart, grainsInCart, breakInCart, soupInCart, proteinInCart, houseInCart, personalInCart, fruitsInCart, vegInCart, itemsInCart } from '../stores.js';

    let showDropdown = false;
    export let quantity = 1; //equal to value in cartContents
    const maxQuantity = 10;

    function toggleDropdown() {
        showDropdown = !showDropdown;
        if (showDropdown) {
            window.addEventListener('click', handleClickOutside, true);
        }
    }

    function handleClickOutside(event) {
        if (!event.target.closest('.quantity-dropdown')) {
            showDropdown = false;
            window.removeEventListener('click', handleClickOutside, true);
        }
    }

    function selectQuantity(qty) {
        quantity = qty;
        showDropdown = false;
        window.removeEventListener('click', handleClickOutside, true);
    }

    export let itemId;
    export let category;

    function updateQuantity(newQuantity) {
        cartContents.update(contents => {
            const itemIndex = contents.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                const item = contents[itemIndex];
                const quantityChange = newQuantity - item.quantity;
                item.quantity = newQuantity;

                itemsInCart.update(count => count + quantityChange);
                updateCategoryCount(category, quantityChange);
            }
            return contents;
        });
    }

    function updateCategoryCount(cat, change) {
        switch (cat) {
            case "Pantry Staples": pantryInCart.update(count => count + change); break;
            case "Snacks": snacksInCart.update(count => count + change); break;
            case "Grains": grainsInCart.update(count => count + change); break;
            case "Breakfast Grains": breakInCart.update(count => count + change); break;
            case "Soup": soupInCart.update(count => count + change); break;
            case "Protein": proteinInCart.update(count => count + change); break;
            case "Household Items": houseInCart.update(count => count + change); break;
            case "Personal Care": personalInCart.update(count => count + change); break;
            case "Fruits": fruitsInCart.update(count => count + change); break;
            case "Vegetables": vegInCart.update(count => count + change); break;
        }
    }
</script>

<div class="component">
    <div class="quantity-dropdown" on:click|stopPropagation={toggleDropdown}>
        <div class="quantity-display">
            <span class="text">Quantity:</span>
            <span class="number">{quantity}</span>
            <button class="chevron-button">
                <div class="chevron-down"></div>
            </button>
        </div>
        {#if showDropdown}
            <div class="dropdown-menu show">
                {#each Array(maxQuantity) as _, index}
                    <div class="dropdown-item" on:click={() => selectQuantity(index + 1)}>
                        {index + 1}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
  
  <style>



    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0px;
        z-index: 1;
        display: none;
        background-color: white; /* Background color for the dropdown */
        border: 1px solid #ddd; /* Border for the dropdown */
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); /* Shadow for dropdown */
        min-width: 50px; /* Minimum width of the dropdown */
    }

    .show {
        display: block;
    }

    .dropdown-item {
        padding: 8px 16px;
        text-align: center;
        border-bottom: 1px solid #ddd; /* Border between items */
        cursor: pointer;
    }

    /* Remove border from the last item */
    .dropdown-item:last-child {
        border-bottom: none;
    }

    /* Style for hovering over an item */
    .dropdown-item:hover {
        background-color: #81B4F0;
    }
    
    .component .text {
    margin-right: 2em; /* Adjust the value as needed */
    margin-left: 1em;
    }
    .component .number {
      margin-right: 2em;
    }

    .quantity-dropdown {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0.5vw;
      border-radius: 10px; /* Adjust for rounded corners */
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); /* Optional: for some shadow */
      background-color: #beb9b9; /* Background color */
      right: 1.5em;
    }
  
    .quantity-display {
     
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  
    .chevron-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .chevron-down {
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid black; /* Chevron color */
    }
  
    /* ... other styles ... */
  </style>
  