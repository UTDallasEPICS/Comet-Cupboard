import * as z from "zod"
import { getLocalTimeZone, today } from "@internationalized/date"
import { imageSchema } from "~/utils/validateImage"

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
 * - Required/optional state
 * - Error messages
 *
 * The form fields object is the source of truth for:
 * - Labels
 * - Descriptions
 * - Placeholders
 * - Other presentation-related field metadata
 *
 * Keep validation rules in the schema rather than duplicating them
 * in the field metadata.
 */

export type FormFieldConfig = {
	label: string
	description?: string
	placeholder?: string
}

// ============================================================================
// Source
// ============================================================================

export const sourceSchema = z.object({
	sourceName: z
		.string()
		.min(1, "Source name is required")
		.max(20, "Source name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Source name must only contain letters and spaces"),
})

export type SourceForm = z.infer<typeof sourceSchema>

export const sourceFormFields = {
	sourceName: {
		label: "Source Name",
		description: "Source name must be at most 20 characters and only contain letters and spaces",
		placeholder: "Enter source name",
	},
} satisfies Record<keyof SourceForm, FormFieldConfig>

export const sourceDetailsSchema = sourceSchema.extend({
	archived: z.boolean(),
})

export type SourceDetailsForm = z.infer<typeof sourceDetailsSchema>

export const sourceFieldSchema = z.object({
	fieldName: z.string().trim().min(1, "Field name is required"),
	type: z.enum(["TEXT", "NUMBER", "DATE", "BOOLEAN", "CHOICE"]),
	optional: z.boolean(),
	choices: z.array(z.string().trim().min(1, "Choice values cannot be empty")).default([]),
})

export type SourceFieldForm = z.infer<typeof sourceFieldSchema>

// ============================================================================
// Inventory
// ============================================================================

export const inventoryItemNameSchema = z
	.string()
	.min(1, "Item name is required")
	.max(100, "Item name must be at most 100 characters")
	.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces")

export const createInventoryItemSchema = z.object({
	itemName: inventoryItemNameSchema,
})

export type CreateInventoryItemForm = z.infer<typeof createInventoryItemSchema>

export const inventoryItemDetailsSchema = z.object({
	itemName: inventoryItemNameSchema,
	categoryID: z.string().min(1, "Category is required"),
	archived: z.boolean(),
})

export type InventoryItemDetailsForm = z.infer<typeof inventoryItemDetailsSchema>

export const intakeSessionSchema = z.object({
	sourceID: z.string().min(1, "Source is required"),
	inventoryIntakeSessionName: z.string().min(1, "Session name is required"),
	intakeDate: z.string().min(1, "Intake date is required"),
	notes: z.string(),
})

export type IntakeSessionForm = z.infer<typeof intakeSessionSchema>

// ============================================================================
// Tutorial
// ============================================================================

export const tutorialNameSchema = z.object({
	name: z
		.string()
		.min(1, "Item name is required")
		.max(30, "Item name must be at most 30 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
})

export type TutorialNameForm = z.infer<typeof tutorialNameSchema>

export const tutorialStepSchema = imageSchema.extend({
	description: z.string().min(1, "Description is required"),
})

export type TutorialStepForm = z.infer<typeof tutorialStepSchema>

// ============================================================================
// Dashboard Links
// ============================================================================

export const dashboardLinkSchema = z.object({
	displayName: z.string().trim().min(1),
	url: z
		.string()
		.trim()
		.refine((value) => value.startsWith("/") || URL.canParse(value), "Enter a valid URL"),
	description: z.string(),
	dashboardRolePage: z.enum(["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"]),
	displayOrder: z.number().int().min(0),
})

export type DashboardLinkForm = z.infer<typeof dashboardLinkSchema>

// ============================================================================
// Announcements
// ============================================================================

export const announcementSchema = z.object({
	message: z.string().trim().min(1, "Message is required"),
	startsDate: z.any(),
	endsDate: z.any(),
	startsTime: z.any(),
	endsTime: z.any(),
})

export type AnnouncementForm = z.infer<typeof announcementSchema>

// ============================================================================
// Categories
// ============================================================================

export const categoryNameSchema = z
	.string()
	.min(1, "Category name is required")
	.max(20, "Category name must be at most 20 characters")
	.regex(/^[A-Za-z ]+$/, "Category name must only contain letters and spaces")

export const createCategorySchema = imageSchema.extend({
	categoryName: categoryNameSchema,
})

export type CreateCategoryForm = z.infer<typeof createCategorySchema>

export const editCategorySchema = createCategorySchema.extend({ archived: z.boolean().default(false) }).partial({
	image: true,
	categoryName: true,
	archived: true,
})

export type EditCategoryForm = z.infer<typeof editCategorySchema>

// ============================================================================
// Locations
// ============================================================================

export const locationNameSchema = z
	.string()
	.min(1, "Location name is required")
	.max(20, "Location name must be at most 20 characters")
	.regex(/^[A-Za-z ]+$/, "Location name must only contain letters and spaces")

export const createLocationSchema = imageSchema.extend({
	locationName: locationNameSchema,
	description: z.string().or(z.literal("")),
	mapEmbedUrl: z
		.string()
		.regex(/^https:\/\/map\.concept3d\.com\/\?id=1772#!m\/\d+$/, "Use a valid UTD Concept3D map URL")
		.or(z.literal("")),
})

export type CreateLocationForm = z.infer<typeof createLocationSchema>

export const editLocationSchema = createLocationSchema.extend({ archived: z.boolean().default(false) }).partial({
	image: true,
	locationName: true,
	description: true,
	archived: true,
})

export type EditLocationForm = z.infer<typeof editLocationSchema>

// ============================================================================
// Emergency Bags
// ============================================================================

export const emergencyBagDetailsSchema = z.object({
	expirationDate: z
		.any()
		.refine((value) => value !== null && value !== undefined, { message: "Please select an expiration date" })
		.refine((value) => value === null || value.compare(today(getLocalTimeZone())) > 0, { message: "Please select a valid expiration date" }),
})

export type EmergencyBagDetailsForm = z.infer<typeof emergencyBagDetailsSchema>
