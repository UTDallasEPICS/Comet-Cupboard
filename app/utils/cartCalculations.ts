export const cartCountAdjustment = (cart: any) => {
	return Object.values(cartItemFinalCounts(cart)).reduce((total: number, count: number) => total + count, 0)
}

export const cartItemAdjustedCount = (cartItem: { count: number; countAdjustment: number }) => cartItem.count + cartItem.countAdjustment

const applyDeal = (count: number, deal: { actualCount: number; adjustedCount: number } | null | undefined) => {
	if (deal) {
		const leftover = count % deal.actualCount
		return Math.trunc(count / deal.actualCount) * deal.adjustedCount + leftover
	}
	return count
}

export const cartItemFinalCounts = (cart: any): Record<string, number> => {
	if (!cart?.cartItems) return {}
	const groupedItems = Object.groupBy(cart.cartItems, (cartItem: any) => cartItem.specificItem?.itemID ?? cartItem.specificItem?.item?.itemID)
	return Object.fromEntries(
		Object.entries(groupedItems).map(([itemID, groupedCartItems]) => {
			const cartItems = groupedCartItems ?? []
			const adjustedCount = cartItems.reduce((total: number, cartItem: any) => total + cartItemAdjustedCount(cartItem), 0)
			const deal = cartItems[0]?.specificItem?.item?.deal
			return [itemID, applyDeal(adjustedCount, deal)]
		})
	)
}

export const pendingCartWarnings = (cart: any) => {
	const warnings: Array<string> = []
	if (!cart?.cartItems) {
		return warnings
	}

	if (cartCountAdjustment(cart) > 6) {
		warnings.push("Cart exceeds 6 item limit")
	}
	if (cart.cartItems.filter((cartItem: any) => cartItem.countAdjustment != 0).length > 0) {
		const adjustedItems = cart.cartItems.filter((cartItem: any) => cartItem.countAdjustment != 0)
		const adjustedItemsnames = adjustedItems.map((cartItem: any) => cartItem.specificItem.item.itemName).join(", ")
		warnings.push("Cart has expired / damaged / overstocked items: " + adjustedItemsnames)
	}
	const categories: { [key: string]: number } = {}
	const warningCategories: Set<string> = new Set()
	const itemFinalCounts = cartItemFinalCounts(cart)
	const processedItemIDs = new Set<string>()
	for (let i = 0; i < cart.cartItems.length; i++) {
		const itemID = cart.cartItems[i].specificItem?.itemID ?? cart.cartItems[i].specificItem?.item?.itemID
		if (!itemID || processedItemIDs.has(itemID)) continue
		processedItemIDs.add(itemID)
		const categoryName = cart.cartItems[i].specificItem?.item?.category?.categoryName ?? "Uncategorized"
		if (!categories[categoryName]) {
			categories[categoryName] = 0
		}
		categories[categoryName] += itemFinalCounts[itemID] ?? 0
		if (categories[categoryName]! > 1) {
			warningCategories.add(categoryName)
		}
	}
	if (warningCategories.size > 0) {
		const warningCategoriesArray = Array.from(warningCategories)
		const categoryNames = warningCategoriesArray.map((category) => category).join(", ")
		warnings.push("Cart exceeds 1 item per category: " + categoryNames)
	}
	return warnings
}
