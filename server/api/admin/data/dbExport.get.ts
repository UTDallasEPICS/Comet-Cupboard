import ExcelJS from "exceljs"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const { itemCountChanges, orderItems, fields } = await prisma.$transaction(async (tx) => {
		const itemCountChanges = await tx.itemCountChange.findMany({
			include: {
				Item: true,
				Source: {
					include: {
						Fields: true,
					},
				},
			},
		})
		
		const orderItems = await tx.orderItem.findMany({
			include: {
				Order: true,
				Item: true,
			},
		})
		
		const fields = await tx.field.findMany()
		
		return { itemCountChanges, orderItems, fields }
	})
	
	const allFieldNames = new Set<string>()
	itemCountChanges.forEach((change) => {
		change.Source.Fields.forEach((field) => {
			allFieldNames.add(field.name)
		})
	})
	const fieldKeys = fields.map((field) => ({
		key: `(${field.sourceName})_${field.name}`,
		name: field.name,
		source: field.sourceName,
	}))
	const workbook = new ExcelJS.Workbook()
	const worksheetInventory = workbook.addWorksheet("Inventory Count Changes")
	worksheetInventory.columns = [
		{ header: "Change ID", key: "id", width: 20 },
		{ header: "Timestamp", key: "timestamp", width: 20 },
		{ header: "Item ID", key: "item_id", width: 20 },
		{ header: "Item Name", key: "item_name", width: 20 },
		{ header: "Source", key: "source", width: 20 },
		{ header: "Amount Changed", key: "amount_changed", width: 20 },
		...fieldKeys.map((f) => ({
			header: f.key,
			key: f.key,
			width: 20,
		})),
	]
	itemCountChanges.forEach((itemCountChange) => {
		const fieldMap = itemCountChange.fieldMap as Record<string, any> | null
		const baseRow: { [key: string]: any } = {
			id: itemCountChange.countChangeID,
			timestamp: itemCountChange.date,
			item_id: itemCountChange.itemID,
			item_name: itemCountChange.Item.name,
			source: itemCountChange.sourceName,
			amount_changed: itemCountChange.amountChanged,
			field_map: JSON.stringify(itemCountChange.fieldMap),
		}
		fieldKeys.forEach((field) => {
			if (itemCountChange.sourceName === field.source) {
				baseRow[field.key] = fieldMap?.[field.name] ?? ""
			} else {
				baseRow[field.key] = ""
			}
		})
		worksheetInventory.addRow(baseRow)
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
	setHeader(event, "Content-Disposition", 'attachment; filename="mycupboard-report.xlsx"')
	return buffer
})
