import ExcelJS from "exceljs"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const { intakeItems, orderItems } = await prisma.$transaction(async (tx) => {
		const intakeItems = await tx.completedInventoryIntakeSessionItem.findMany({
			include: {
				completedInventoryIntakeSession: true,
				specificItem: { include: { item: true } },
			},
		})

		const orderItems = await tx.orderItem.findMany({
			include: {
				order: true,
				specificItem: { include: { item: true } },
			},
		})

		return { intakeItems, orderItems }
	})

	const workbook = new ExcelJS.Workbook()
	const worksheetInventory = workbook.addWorksheet("Inventory Count Changes")
	worksheetInventory.columns = [
		{ header: "Change ID", key: "id", width: 20 },
		{ header: "Timestamp", key: "timestamp", width: 20 },
		{ header: "Specific Item ID", key: "specific_item_id", width: 20 },
		{ header: "Item Name", key: "item_name", width: 20 },
		{ header: "Source", key: "source", width: 20 },
		{ header: "Amount Changed", key: "amount_changed", width: 20 },
	]
	intakeItems.forEach((itemChange, index) => {
		worksheetInventory.addRow({
			id: `${itemChange.completedInventoryIntakeSessionID}-${index + 1}`,
			timestamp: itemChange.completedInventoryIntakeSession.intakeDate,
			specific_item_id: itemChange.specificItemID,
			item_name: itemChange.specificItem.item.itemName,
			source: itemChange.completedInventoryIntakeSession.sourceName,
			amount_changed: itemChange.amountChanged,
		})
	})
	const worksheetOrders = workbook.addWorksheet("Orders")
	worksheetOrders.columns = [
		{ header: "Timestamp", key: "timestamp", width: 20 },
		{ header: "Order ID", key: "order_id", width: 20 },
		{ header: "User", key: "user", width: 20 },
		{ header: "Specific Item ID", key: "specific_item_id", width: 20 },
		{ header: "Item Name", key: "item_name", width: 20 },
		{ header: "Amount Taken", key: "amount_ordered", width: 20 },
	]
	orderItems.forEach((orderItem) => {
		worksheetOrders.addRow({
			timestamp: orderItem.order.createdAt,
			order_id: orderItem.orderID,
			user: orderItem.order.userID,
			specific_item_id: orderItem.specificItemID,
			item_name: orderItem.specificItem.item.itemName,
			amount_ordered: orderItem.count,
		})
	})

	const buffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	setHeader(event, "Content-Disposition", 'attachment; filename="mycupboard-report.xlsx"')
	return buffer
})
