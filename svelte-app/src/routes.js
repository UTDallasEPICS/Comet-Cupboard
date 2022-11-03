import Cart from './routes/Cart.svelte';
import Checkout from './routes/ShopForItems.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    // exact path
    '/': Checkout,
    '/cart': Cart,
    // The catch-all route must always be last
    '*': NotFound
};