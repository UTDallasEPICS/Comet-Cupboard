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

export type CartWarningLink = {
	label: string
	categoryName: string
	itemID?: string
}

export type CartWarning = {
	message: string
	links: CartWarningLink[]
}

export const pendingCartWarnings = (cart: any): CartWarning[] => {
	const warnings: CartWarning[] = []
	if (!cart?.cartItems) {
		return warnings
	}

	if (cartCountAdjustment(cart) > 6) {
		warnings.push({ message: "Cart exceeds 6 item limit", links: [] })
	}

	const adjustedItems = cart.cartItems.filter((cartItem: any) => cartItem.countAdjustment != 0)
	if (adjustedItems.length > 0) {
		const seenItemIDs = new Set<string>()
		const links: CartWarningLink[] = []
		for (const cartItem of adjustedItems) {
			const itemID = cartItem.specificItem?.itemID ?? cartItem.specificItem?.item?.itemID
			if (!itemID || seenItemIDs.has(itemID)) continue
			seenItemIDs.add(itemID)
			links.push({
				label: cartItem.specificItem.item.itemName,
				categoryName: cartItem.specificItem.item.category?.categoryName ?? "Uncategorized",
				itemID,
			})
		}
		warnings.push({ message: "Cart has expired / damaged / overstocked items:", links })
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
		const links = Array.from(warningCategories).map((categoryName) => ({ label: categoryName, categoryName }))
		warnings.push({ message: "Cart exceeds 1 item per category:", links })
	}
	return warnings
}
