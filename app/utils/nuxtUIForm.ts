import type { FormError, FormErrorEvent } from "@nuxt/ui"
import type { z } from "zod"

export const createFormBuilder = <T extends z.ZodTypeAny>(schema: T, defaults?: Partial<z.infer<T>> | (() => Partial<z.infer<T>>)) => {
	const initial = typeof defaults === "function" ? defaults() : (defaults ?? {})

	const state = ref<Partial<z.infer<T>>>({
		...initial,
	})

	const validate = async (formState: Partial<z.infer<T>>): Promise<FormError[]> => {
		const errors = []
		const result = await schema.safeParseAsync(formState)
		if (!result.success) {
			errors.push(...result.error.issues.map((err) => ({ name: String(err.path[0]), message: err.message })))
		}
		return errors
	}

	const onError = async (event: FormErrorEvent) => {
		console.log("Form error event errors:", event.errors)
		if (event?.errors?.[0]?.id) {
			const el = document.getElementById(event.errors[0].id)
			el?.focus()
			el?.scrollIntoView({ behavior: "smooth", block: "center" })
		}
	}

	return {
		state,
		schema,
		validate,
		onError,
	}
}
