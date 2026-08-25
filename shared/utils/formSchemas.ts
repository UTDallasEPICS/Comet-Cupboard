import * as z from "zod"
import { getLocalTimeZone, today } from "@internationalized/date"

/**
 * Expected structure for every form:
 *
 * export const exampleSchema = z.object({
 *     exampleField: z.string(),
 * })
 *
 * export type ExampleForm = z.infer<typeof exampleSchema>
 *
 * export const exampleFormFields = {
 *     exampleField: {
 *         label: "Example Field",
 *         description: "Description shown below the field",
 *         placeholder: "Enter example field",
 *     },
 * } satisfies Record<keyof ExampleForm, FormFieldConfig>
 *
 *
 * The schema is the source of truth for:
 * - Field names
 * - Validation
 * - Required and optional fields
 * - Validation messages
 *
 * The form fields object is the source of truth for:
 * - Labels
 * - Descriptions
 * - Placeholders
 * - Other presentation-related metadata
 *
 * Keep validation rules in the schema rather than duplicating them
 * in the field metadata.
 */

export type FormFieldConfig = {
	id: string
	label: string
	description?: string
	placeholder?: string
}

const MAX_FILE_SIZE = 2 * 1024 * 1024
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }

const checkImageDimensions = async (file: File): Promise<boolean> => {
	const dataUrl = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (event) => resolve(event.target?.result as string)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})

	return await new Promise<boolean>((resolve, reject) => {
		const image = new Image()
		image.onload = () =>
			resolve(
				image.width >= MIN_DIMENSIONS.width &&
					image.height >= MIN_DIMENSIONS.height &&
					image.width <= MAX_DIMENSIONS.width &&
					image.height <= MAX_DIMENSIONS.height
			)
		image.onerror = reject
		image.src = dataUrl
	})
}

const imageSchema = z.object({
	image: z
		.file()
		.mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], { message: "Invalid image type (JPG/PNG/WEBP only)" })
		.max(MAX_FILE_SIZE, { message: "Image is too large (max 2MB)" })
		.refine(
			async (file) =>
				checkImageDimensions(file).then(
					(valid) => valid,
					() => false
				),
			{
				message: `Image dimensions must be between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels`,
			}
		),
})

// ============================================================================
// Shared Validation
// ============================================================================

/**
 * Allows:
 * - Letters
 * - Numbers
 * - Spaces
 * - Periods
 * - Commas
 * - Apostrophes
 * - Parentheses
 * - Ampersands
 * - Forward slashes
 * - Hyphens
 *
 * The value must start with a letter or number.
 *
 * Examples:
 * - Room 101
 * - Shelf A-2
 * - Comet Cupboard 2026
 * - Food & Drinks
 * - Men's Clothing
 * - Tutorial (Volunteer)
 * - Building A/B
 * - Item, Large
 */
export const namePattern = /^[A-Za-z0-9][A-Za-z0-9 .,'()&/-]*$/

/**
 * Standard schema for names and titles.
 */
export const nameSchema = (fieldName: string, maxLength = 100) =>
	z
		.string()
		.trim()
		.min(1, `${fieldName} is required`)
		.max(maxLength, `${fieldName} must be ${maxLength} characters or fewer`)
		.regex(namePattern, `${fieldName} can only contain letters, numbers, spaces, and common punctuation`)

/**
 * Standard schema for descriptions.
 */
export const descriptionSchema = z.string().trim().max(500, "Description must be 500 characters or fewer")

/**
 * Standard schema for longer notes.
 */
export const notesSchema = z.string().trim().max(2_000, "Notes must be 2,000 characters or fewer")

/**
 * Standard schema for required IDs.
 */
export const requiredIDSchema = (fieldName: string) => z.string().trim().min(1, `${fieldName} is required`)

// ============================================================================
// Source
// ============================================================================

export const sourceSchema = z.object({ sourceName: nameSchema("Source name") })
export type SourceForm = z.infer<typeof sourceSchema>
export const sourceFormFields = { sourceName: { id: "sourceName", label: "Source Name", placeholder: "Enter source name" } } satisfies Record<
	keyof SourceForm,
	FormFieldConfig
>

export const sourceDetailsSchema = sourceSchema.extend({ archived: z.boolean() })
export type SourceDetailsForm = z.infer<typeof sourceDetailsSchema>
export const sourceDetailsFormFields = {
	sourceName: { id: "sourceName", label: "Source Name", description: "Use up to 100 letters and common punctuation", placeholder: "Enter source name" },
	archived: { id: "archived", label: "Archived", description: "Hide this source from active intake options" },
} satisfies Record<keyof SourceDetailsForm, FormFieldConfig>

export const sourceFieldSchema = z.object({
	fieldName: nameSchema("Field name"),
	type: z.enum(["TEXT", "NUMBER", "DATE", "BOOLEAN", "CHOICE"]),
	optional: z.boolean(),
	choices: z
		.array(z.string().trim().min(1, "Choice value cannot be empty").max(100, "Choice value must be 100 characters or fewer"))
		.max(50, "A field can have at most 50 choices")
		.default([]),
})
export type SourceFieldForm = z.infer<typeof sourceFieldSchema>
export const sourceFieldFormFields = {
	fieldName: { id: "fieldName", label: "Field Name", placeholder: "Enter field name" },
	type: { id: "type", label: "Field Type", placeholder: "Select field type" },
	optional: { id: "optional", label: "Optional field" },
	choices: { id: "choices", label: "Choice Values", placeholder: "Choice value" },
} satisfies Record<keyof SourceFieldForm, FormFieldConfig>

// ============================================================================
// Inventory
// ============================================================================

export const inventoryItemNameSchema = nameSchema("Item name")
export const createInventoryItemSchema = z.object({ itemName: inventoryItemNameSchema })
export type CreateInventoryItemForm = z.infer<typeof createInventoryItemSchema>
export const createInventoryItemFormFields = {
	itemName: { id: "itemName", label: "Item Name", description: "Use up to 100 letters and common punctuation", placeholder: "Enter item name" },
} satisfies Record<keyof CreateInventoryItemForm, FormFieldConfig>

export const inventoryItemDetailsSchema = z.object({ itemName: inventoryItemNameSchema, categoryID: requiredIDSchema("Category"), archived: z.boolean() })
export type InventoryItemDetailsForm = z.infer<typeof inventoryItemDetailsSchema>
export const inventoryItemDetailsFormFields = {
	itemName: { id: "itemName", label: "Item Name", description: "Use up to 100 letters and common punctuation", placeholder: "Enter item name" },
	categoryID: { id: "categoryID", label: "Category", description: "Select the category for this item", placeholder: "Select category" },
	archived: { id: "archived", label: "Availability", description: "Hide this item from active inventory and shopping" },
} satisfies Record<keyof InventoryItemDetailsForm, FormFieldConfig>

export const intakeSessionSchema = z.object({
	sourceID: requiredIDSchema("Source"),
	inventoryIntakeSessionName: nameSchema("Session name"),
	intakeDate: z.string().trim().min(1, "Intake date is required"),
	notes: notesSchema,
})
export type IntakeSessionForm = z.infer<typeof intakeSessionSchema>
export const intakeSessionFormFields = {
	sourceID: { id: "sourceID", label: "Source", placeholder: "Select source" },
	inventoryIntakeSessionName: { id: "inventoryIntakeSessionName", label: "Session Name", placeholder: "Enter session name" },
	intakeDate: { id: "intakeDate", label: "Intake Date" },
	notes: { id: "notes", label: "Notes", placeholder: "Optional notes" },
} satisfies Record<keyof IntakeSessionForm, FormFieldConfig>

// ============================================================================
// Tutorial
// ============================================================================

export const tutorialNameSchema = z.object({ tutorialName: nameSchema("Tutorial name") })
export type TutorialNameForm = z.infer<typeof tutorialNameSchema>
export const tutorialNameFormFields = {
	tutorialName: {
		id: "tutorialName",
		label: "Tutorial Name",
		description: "Use up to 100 letters and common punctuation",
		placeholder: "Enter tutorial name",
	},
} satisfies Record<keyof TutorialNameForm, FormFieldConfig>

export const tutorialStepSchema = imageSchema.extend({
	description: z.string().trim().min(1, "Description is required").max(1_000, "Description must be 1,000 characters or fewer"),
})
export type TutorialStepForm = z.infer<typeof tutorialStepSchema>
export const tutorialStepFormFields = {
	image: { id: "image", label: "Step Image", description: "JPG or PNG. 2MB Max. Image should be 16:9" },
	description: {
		id: "description",
		label: "Step Description",
		description: "Describe what the user should do in this step",
		placeholder: "Enter step description",
	},
} satisfies Record<keyof TutorialStepForm, FormFieldConfig>

// ============================================================================
// Dashboard Links
// ============================================================================

export const dashboardLinkSchema = z.object({
	displayName: nameSchema("Display name"),
	url: z
		.string()
		.trim()
		.min(1, "URL is required")
		.max(2_048, "URL must be 2,048 characters or fewer")
		.refine((value) => value.startsWith("/") || URL.canParse(value), "Enter a valid URL or internal path"),
	description: descriptionSchema,
	dashboardRolePage: z.enum(["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"]),
	displayOrder: z.number().int("Display order must be a whole number").min(0, "Display order cannot be negative").max(10_000, "Display order is too large"),
})
export type DashboardLinkForm = z.infer<typeof dashboardLinkSchema>
export const dashboardLinkFormFields = {
	displayName: { id: "displayName", label: "Display Name", placeholder: "Enter display name" },
	url: { id: "url", label: "URL", description: "Enter an external URL or internal path", placeholder: "Enter URL" },
	description: { id: "description", label: "Description", placeholder: "Enter description" },
	dashboardRolePage: { id: "dashboardRolePage", label: "Dashboard Role Page", placeholder: "Select dashboard role page" },
	displayOrder: { id: "displayOrder", label: "Display Order", placeholder: "Enter display order" },
} satisfies Record<keyof DashboardLinkForm, FormFieldConfig>

// ============================================================================
// Announcements
// ============================================================================

export const announcementSchema = z.object({
	message: z.string().trim().min(1, "Message is required").max(2_000, "Message must be 2,000 characters or fewer"),
	startsDate: z.any(),
	endsDate: z.any(),
	startsTime: z.any(),
	endsTime: z.any(),
})
export type AnnouncementForm = z.infer<typeof announcementSchema>
export const announcementFormFields = {
	message: { id: "message", label: "Message", description: "Enter the announcement shown to users", placeholder: "Enter announcement message" },
	startsDate: { id: "startsDate", label: "Start date" },
	endsDate: { id: "endsDate", label: "End date" },
	startsTime: { id: "startsTime", label: "Start time" },
	endsTime: { id: "endsTime", label: "End time" },
} satisfies Record<keyof AnnouncementForm, FormFieldConfig>

// ============================================================================
// Categories
// ============================================================================

export const categoryNameSchema = nameSchema("Category name").refine((value) => value.toLowerCase() !== "all items", "all items is reserved")
export const createCategorySchema = imageSchema.extend({ categoryName: categoryNameSchema })
export type CreateCategoryForm = z.infer<typeof createCategorySchema>
export const createCategoryFormFields = {
	image: { id: "image", label: "Category Image", description: "JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels" },
	categoryName: {
		id: "categoryName",
		label: "Category Name",
		description: "Use up to 100 letters and common punctuation",
		placeholder: "Enter category name",
	},
} satisfies Record<keyof CreateCategoryForm, FormFieldConfig>

export const editCategorySchema = createCategorySchema
	.extend({ archived: z.boolean().default(false) })
	.partial({ image: true, categoryName: true, archived: true })
export type EditCategoryForm = z.infer<typeof editCategorySchema>
export const editCategoryFormFields = {
	image: { id: "image", label: "Category Image", description: "JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels" },
	categoryName: {
		id: "categoryName",
		label: "Category Name",
		description: "Use up to 100 letters and common punctuation",
		placeholder: "Enter category name",
	},
	archived: { id: "archived", label: "Archived", description: "Check if the category is archived" },
} satisfies Record<keyof EditCategoryForm, FormFieldConfig>

// ============================================================================
// Locations
// ============================================================================

export const locationNameSchema = nameSchema("Location name")
export const createLocationSchema = imageSchema.extend({
	locationName: locationNameSchema,
	description: descriptionSchema,
	mapEmbedUrl: z
		.string()
		.trim()
		.max(2_048, "Map URL must be 2,048 characters or fewer")
		.refine((value) => value === "" || /^https:\/\/map\.concept3d\.com\/\?id=1772#!m\/\d+$/.test(value), "Enter a valid UTD Concept3D map URL"),
})
export type CreateLocationForm = z.infer<typeof createLocationSchema>
export const createLocationFormFields = {
	image: { id: "image", label: "Location Image", description: "JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels" },
	locationName: {
		id: "locationName",
		label: "Location Name",
		description: "Use up to 100 letters and common punctuation",
		placeholder: "Enter location name",
	},
	description: { id: "description", label: "Description", placeholder: "Enter description" },
	mapEmbedUrl: {
		id: "mapEmbedUrl",
		label: "Optional UTD Campus Map Embed URL",
		description: "Use https://map.concept3d.com/?id=1772#!m/<map-id>",
		placeholder: "https://map.concept3d.com/?id=1772#!m/551906",
	},
} satisfies Record<keyof CreateLocationForm, FormFieldConfig>

export const editLocationSchema = createLocationSchema
	.extend({ archived: z.boolean().default(false) })
	.partial({ image: true, locationName: true, description: true, archived: true })
export type EditLocationForm = z.infer<typeof editLocationSchema>
export const editLocationFormFields = {
	image: { id: "image", label: "Location Image", description: "JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels" },
	locationName: {
		id: "locationName",
		label: "Location Name",
		description: "Use up to 100 letters and common punctuation",
		placeholder: "Enter location name",
	},
	description: { id: "description", label: "Description", placeholder: "Enter description" },
	mapEmbedUrl: {
		id: "mapEmbedUrl",
		label: "Optional UTD Campus Map Embed URL",
		description: "Use https://map.concept3d.com/?id=1772#!m/<map-id>",
		placeholder: "https://map.concept3d.com/?id=1772#!m/551906",
	},
	archived: { id: "archived", label: "Archived", description: "Check if the location is archived" },
} satisfies Record<keyof EditLocationForm, FormFieldConfig>

// ============================================================================
// Emergency Bags
// ============================================================================

export const emergencyBagDetailsSchema = z.object({
	expirationDate: z
		.any()
		.refine((value) => value !== null && value !== undefined, "Please select an expiration date")
		.refine((value) => value === null || value === undefined || value.compare(today(getLocalTimeZone())) > 0, "Expiration date must be in the future"),
})
export type EmergencyBagDetailsForm = z.infer<typeof emergencyBagDetailsSchema>
export const emergencyBagDetailsFormFields = {
	expirationDate: { id: "expirationDate", label: "Expiration Date", placeholder: "Select expiration date" },
} satisfies Record<keyof EmergencyBagDetailsForm, FormFieldConfig>

export const emergencyBagSchema = z.object({
	expiryDate: z.coerce.date(),
	labels: z.array(z.string().trim().min(1)).default([]),
	private: z.boolean().default(false),
	bagDescription: notesSchema.default(""),
	items: z
		.array(
			z.object({
				specificItemID: requiredIDSchema("Specific item"),
				count: z.int().positive(),
			})
		)
		.min(1),
})

export const emergencyBagDisplayFields = {
	selectedCategory: { id: "selectedCategory", label: "Select Labels" },
	isPrivate: { id: "isPrivate", label: "Privacy" },
	bagDescription: { id: "bagDescription", label: "Bag Description", placeholder: "Please enter a bag description..." },
} satisfies Record<"selectedCategory" | "isPrivate" | "bagDescription", FormFieldConfig>
export const dealFormFields = {
	actualCount: { id: "actualCount", label: "Actual Count" },
	adjustedCount: { id: "adjustedCount", label: "Adjusted Count" },
} satisfies Record<"actualCount" | "adjustedCount", FormFieldConfig>
export const specificProductFormFields = {
	productName: { id: "productName", label: "Product Name", placeholder: "Enter product name" },
	productImage: { id: "productImage", label: "Product Image", description: "JPG, PNG, or WEBP. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels" },
	itemLabels: { id: "itemLabels", label: "Item Labels", placeholder: "Select labels" },
} satisfies Record<"productName" | "productImage" | "itemLabels", FormFieldConfig>

export const specificProductSchema = z.object({
	productName: nameSchema("Product name"),
	itemLabels: z.array(nameSchema("Item label")).default([]),
})

export const dealSchema = z
	.object({
		actualCount: z.number().int().positive(),
		adjustedCount: z.number().int().nonnegative(),
	})
	.refine((data) => data.actualCount > data.adjustedCount, { error: "Adjusted count must be less than actual count" })
