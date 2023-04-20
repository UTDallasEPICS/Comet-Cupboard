import Cart from './routes/Cart.svelte';
import ShopForItems from './routes/ShopForItems.svelte';
import NotFound from './routes/NotFound.svelte';
import PantryStaples from './routes/PantryStaples.svelte';
import Snacks from './routes/Snacks.svelte';
import Grains from './routes/Grains.svelte';
import BreakfastGrains from './routes/BreakfastGrains.svelte';
import Soup from './routes/Soup.svelte';
import Protein from './routes/Protein.svelte';
import HouseholdItems from './routes/HouseholdItems.svelte';
import PersonalCare from './routes/PersonalCare.svelte';
import Fruits from './routes/Fruits.svelte';
import Vegetables from './routes/Vegetables.svelte';
import ProfilePage from './components/ProfilePage.svelte';
import Inventory from './routes/Inventory.svelte'

export default {
    // exact path
    '/': ShopForItems,
    '/inventory': Inventory,
    '/cart': Cart,
    '/profilePage': ProfilePage,
    '/category/pantry-staples': PantryStaples,
    '/category/snacks': Snacks,
    '/category/grains': Grains,
    '/category/breakfast-grains': BreakfastGrains,
    '/category/soup': Soup,
    '/category/protein': Protein,
    '/category/household-items': HouseholdItems,
    '/category/personal-care': PersonalCare,
    '/category/fruits': Fruits,
    '/category/vegetables': Vegetables,
    // The catch-all route must always be last
    '*': NotFound
};