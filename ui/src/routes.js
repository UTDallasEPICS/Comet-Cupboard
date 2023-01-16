import Cart from './routes/Cart.svelte';
import ShopForItems from './routes/ShopForItems.svelte';
import NotFound from './routes/NotFound.svelte';
import PantryStaples from './routes/PantryStaples.svelte';

export default {
    // exact path
    '/': ShopForItems,
    '/cart': Cart,
    '/category/pantry-staples': PantryStaples,
    // The catch-all route must always be last
    '*': NotFound
};