import ExcelJS from "exceljs"

export default defineEventHandler(async (event) => {
	const itemCountChanges = await event.context.prisma.itemCountChange.findMany({
		include: {
			Item: true,
		},
	})
	const orderItems = await event.context.prisma.orderItem.findMany({
		include: {
			Order: true,
			Item: true,
		},
	})
	const workbook = new ExcelJS.Workbook()
	const worksheetInventory = workbook.addWorksheet("Inventory Count Changes")
	worksheetInventory.columns = [
		{ header: "Change ID", key: "id", width: 20 },
		{ header: "Timestamp", key: "timestamp", width: 20 },
		{ header: "Item ID", key: "item_id", width: 20 },
		{ header: "Item Name", key: "item_name", width: 20 },
		{ header: "Source", key: "source", width: 20 },
		{ header: "Amount Changed", key: "amount_changed", width: 20 },
		{ header: "Field Map", key: "field_map", width: 20 },
	]
	itemCountChanges.forEach((itemCountChange) => {
		worksheetInventory.addRow({
			id: itemCountChange.countChangeID,
			timestamp: itemCountChange.date,
			item_id: itemCountChange.itemID,
			item_name: itemCountChange.Item.name,
			source: itemCountChange.sourceName,
			amount_changed: itemCountChange.amountChanged,
			field_map: itemCountChange.fieldMap,
		})
	})
	const worksheetOrders = workbook.addWorksheet("Orders")
	worksheetOrders.columns = [
		{ header: "Timestamp", key: "timestamp", width: 20 },
		{ header: "Order ID", key: "order_id", width: 20 },
		{ header: "User", key: "user", width: 20 },
		{ header: "Item ID", key: "item_id", width: 20 },
		{ header: "Item Name", key: "item_name", width: 20 },
		{ header: "Amount Taken", key: "amount_ordered", width: 20 },
	]
	orderItems.forEach((orderItem) => {
		worksheetOrders.addRow({
			timestamp: orderItem.Order.date,
			order_id: orderItem.orderID,
			user: orderItem.Order.netID,
			item_id: orderItem.itemID,
			item_name: orderItem.Item.name,
			amount_ordered: orderItem.count,
		})
	})

	const buffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	return buffer
})
