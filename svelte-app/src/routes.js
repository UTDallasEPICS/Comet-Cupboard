import Cart from './routes/Cart.svelte';
import ShopForItems from './routes/ShopForItems.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    // exact path
    '/': ShopForItems,
    '/cart': Cart,
    // The catch-all route must always be last
    '*': NotFound
};