export const cartCountAdjustment = (cart) => {
	return cart.CartItems.map((cartItem) => {
		return cartItemCountAdjustment(cartItem).count
	}).reduce((a, b) => a + b, 0)
}

export const cartItemCountAdjustment = (cartItem) => {
	// apply expired items first
	let count = cartItem.count - cartItem.expiredCount
	let dealCount = 0
	// apply deals if present
	if (cartItem.Item.Deal) {
		const leftover = count % cartItem.Item.Deal.actualCount
		const finalCount = Math.trunc(count / cartItem.Item.Deal.actualCount) * cartItem.Item.Deal.adjustedCount + leftover
		dealCount = count - finalCount
		count = finalCount
	}
	return { count: count, dealCount: dealCount, expiredCount: cartItem.expiredCount }
}

export const pendingCartWarnings = (cart) => {
	const warnings: Array<string> = []
	if (cartCountAdjustment(cart) > 6) {
		warnings.push("Cart exceeds 6 item limit")
	}
	if (cart.CartItems.filter((cartItem) => cartItem.expiredCount > 0).length > 0) {
		warnings.push("Cart has expired items")
	}
	const categories: { [key: string]: number } = {}
	for (let i = 0; i < cart.CartItems.length; i++) {
		if (!categories[cart.CartItems[i].categoryName]) {
			categories[cart.CartItems[i].categoryName] = 0
		}
		categories[cart.CartItems[i].categoryName] += cartItemCountAdjustment(cart.CartItems[i]).count

		if (categories[cart.CartItems[i].categoryName] > 1) {
			warnings.push("Cart exceeds 1 item per category")
			break
		}
	}
	return warnings
}
