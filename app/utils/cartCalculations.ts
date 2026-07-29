export const cartCountAdjustment = (cart) => {
	if (!cart || "CartItems" in cart === false) {
		return 0
	}
	return cart.CartItems.map((cartItem) => {
		return cartItemCountAdjustment(cartItem).count
	}).reduce((a, b) => a + b, 0)
}

export const cartItemCountAdjustment = (cartItem: {
	count: number
	countAdjustment: number
	Item: { Deal: { actualCount: number; adjustedCount: number } }
}) => {
	// apply adjustments like expired/damaged/overstocked first
	let count = cartItem.count - cartItem.countAdjustment
	let dealCount = 0
	// apply deals if present
	if ("Item" in cartItem && "Deal" in cartItem.Item && cartItem.Item.Deal) {
		const leftover = count % cartItem.Item.Deal.actualCount
		const finalCount = Math.trunc(count / cartItem.Item.Deal.actualCount) * cartItem.Item.Deal.adjustedCount + leftover
		dealCount = count - finalCount
		count = finalCount
	}
	return { count: count, dealCount: dealCount, adjustedCount: cartItem.countAdjustment }
}

export const pendingCartWarnings = (cart) => {
	const warnings: Array<string> = []
	if (cartCountAdjustment(cart) > 6) {
		warnings.push("Cart exceeds 6 item limit")
	}
	if (cart.CartItems.filter((cartItem) => cartItem.countAdjustment != 0).length > 0) {
		const adjustedItems = cart.CartItems.filter((cartItem) => cartItem.countAdjustment != 0)
		const adjustedItemsnames = adjustedItems.map((item) => item.Item.name).join(", ")
		warnings.push("Cart has expired/damaged/overstocked items: " + adjustedItemsnames)
	}
	const categories: { [key: string]: number } = {}
	const warningCategories: Set<string> = new Set()
	for (let i = 0; i < cart.CartItems.length; i++) {
		if (!categories[cart.CartItems[i].Item.categoryName]) {
			categories[cart.CartItems[i].Item.categoryName] = 0
		}
		categories[cart.CartItems[i].Item.categoryName] += cartItemCountAdjustment(cart.CartItems[i]).count
		if (categories[cart.CartItems[i].Item.categoryName] > 1) {
			warningCategories.add(cart.CartItems[i].Item.categoryName)
		}
	}
	if (warningCategories.size > 0) {
		const warningCategoriesArray = Array.from(warningCategories)
		const categoryNames = warningCategoriesArray.map((category) => category).join(", ")
		warnings.push("Cart exceeds 1 item per category: " + categoryNames)
	}
	return warnings
}
