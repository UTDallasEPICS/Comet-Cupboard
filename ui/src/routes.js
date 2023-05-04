import Cart from './routes/Cart.svelte';
import ShopForItems from './routes/ShopForItems.svelte';
import NotFound from './routes/NotFound.svelte';
import AllCategories from './routes/AllCategories.svelte';
import ProfilePage from './components/ProfilePage.svelte';
import Inventory from './routes/Inventory.svelte'

export default {
    // exact path
    '/': ShopForItems,
    '/inventory': Inventory,
    '/cart': Cart,
    '/profilePage': ProfilePage,
    '/categories': AllCategories,
    // The catch-all route must always be last
    '*': NotFound
};