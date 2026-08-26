type Role = "student" | "volunteer" | "admin" | "headAdmin"

interface AppLink {
	label: string
	description?: string
	icon: string
	to?: string
	children?: AppLink[]
}

export const roleLinks: Record<Role, AppLink[]> = {
	student: [
		{
			label: "Dashboard",
			description: "View your overview and activity",
			icon: "i-lucide-home",
			to: "/student",
		},
		{
			label: "Queue",
			description: "Join or view your queue status",
			icon: "i-lucide-clock",
			to: "/student/queue",
		},
		{
			label: "Shopping",
			description: "Browse available items",
			icon: "i-lucide-shopping-cart",
			to: "/student/shopping",
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
		{
			label: "Manage Emergency Bags",
			description: "View Emergency Bags",
			icon: "i-lucide-settings",
			to: "/volunteer/emergency-bag/manage",
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
			label: "Management",
			description: "Administrative configuration tools",
			icon: "i-lucide-settings",
			children: [
				{
					label: "Manage Roles",
					description: "Add, edit, or remove roles",
					icon: "i-lucide-users",
					to: "/admin/manage/roles",
				},
				{
					label: "Manage Categories",
					description: "Add or edit categories",
					icon: "i-lucide-tags",
					to: "/admin/manage/categories",
				},
				{
					label: "Manage Sources",
					description: "Add or edit data sources",
					icon: "i-lucide-database",
					to: "/admin/manage/sources",
				},
				{
					label: "Manage Locations",
					description: "Add or edit locations",
					icon: "i-lucide-map-pin",
					to: "/admin/manage/locations",
				},
				{
					label: "Manage Labels",
					description: "Add, edit, or archive labels",
					icon: "i-lucide-bookmark",
					to: "/admin/manage/labels",
				},
				{
					label: "Manage Tutorials",
					description: "Add or edit tutorials",
					icon: "i-lucide-info",
					to: "/admin/manage/tutorials",
				},
				{
					label: "Manage Announcements",
					description: "Create and manage announcements",
					icon: "i-lucide-megaphone",
					to: "/admin/announcements",
				},
			],
		},

		{
			label: "Past Inventory Intake Sessions",
			description: "View past inventory intake sessions",
			icon: "i-lucide-box",
			to: "/admin/intake-sessions/historical",
		},
	],
	headAdmin: [
		{
			label: "Dashboard",
			description: "Head administrative overview",
			icon: "i-lucide-home",
			to: "/head-admin",
		},
		{
			label: "Data",
			description: "View and analyze system data",
			icon: "i-lucide-chart-column-big",
			to: "/head-admin/data-analytics",
		},
		{
			label: "Custom Dashboard Links",
			description: "Manage external dashboard links",
			icon: "i-lucide-external-link",
			to: "/head-admin/dashboard-links",
		},
	],
}
