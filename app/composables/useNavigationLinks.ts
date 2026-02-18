export const useNavigationLinks = () => {
	type Role = "student" | "volunteer" | "admin"

	interface AppLink {
		label: string
		description?: string
		icon: string
		to?: string
		children?: AppLink[]
	}

	const roleLinks: Record<Role, AppLink[]> = {
		student: [
			{
				label: "Dashboard",
				description: "View your overview and activity",
				icon: "i-lucide-home",
				to: "/student",
			},
			{
				label: "Shopping",
				description: "Browse available items",
				icon: "i-lucide-shopping-cart",
				to: "/student/shopping",
			},
			{
				label: "Queue",
				description: "Join or view your queue status",
				icon: "i-lucide-clock",
				to: "/student/queue",
			},
		],

		volunteer: [
			{
				label: "Dashboard",
				description: "View volunteer tools and activity",
				icon: "i-lucide-home",
				to: "/volunteer",
			},
			{
				label: "Inventory Management",
				description: "Manage stock and items",
				icon: "i-lucide-box",
				to: "/volunteer/inventory",
			},
			{
				label: "Verify Cart",
				description: "Check and confirm carts",
				icon: "i-lucide-check-circle",
				to: "/volunteer/verify-cart",
			},
			{
				label: "Manage Queue",
				description: "Monitor and adjust the queue",
				icon: "i-lucide-clock",
				to: "/volunteer/queue",
			},
		],

		admin: [
			{
				label: "Dashboard",
				description: "Administrative overview",
				icon: "i-lucide-home",
				to: "/admin",
			},
			{
				label: "Data",
				description: "View and analyze system data",
				icon: "i-heroicons-chart-bar",
				to: "/admin/data-analytics",
			},
			{
				label: "Management",
				description: "Administrative configuration tools",
				icon: "i-lucide-settings",
				children: [
					{
						label: "Manage Volunteers",
						description: "Add, edit, or remove volunteers",
						icon: "i-lucide-users",
						to: "/admin/manage/volunteers",
					},
					{
						label: "Manage Sources",
						description: "Add or edit data sources",
						icon: "i-lucide-database",
						to: "/admin/manage/sources",
					},
				],
			},
		],
	}

	return { roleLinks }
}
