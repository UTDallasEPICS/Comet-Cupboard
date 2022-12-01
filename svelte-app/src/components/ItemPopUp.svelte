<!-- displayed when user clicks on item from Checkout History or Category Section -->
<!-- allows user to select type and size (if applicable), see item's expiration date, and add item to cart -->
<script lang="ts">
    // import MenuSurface from '@smui/menu-surface';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    //export let item;

    // receives this as a prop from CheckoutHistory
    export let open;  // bool for if ItemPopup should be open/displayed to user

    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    function sayHello() {
		dispatch('message', {
			text: 'Hello!'
	    });
    }
</script>

<Dialog
bind:open
aria-labelledby="simple-title"
aria-describedby="simple-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">Dialog Title</Title>
    <Content id="simple-content">Super awesome dialog body text?</Content>
    <Actions>
        <Button on:click={() => (clicked = 'No')}>
        <Label>No</Label>
        </Button>
        <Button on:click={() => (clicked = 'Yes')}>
        <Label>Yes</Label>
        </Button>
    </Actions>
</Dialog>

<style>

</style>