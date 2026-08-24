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
			icon: icons["home"],
			to: "/student",
		},
		{
			label: "Queue",
			description: "Join or view your queue status",
			icon: icons["queue"],
			to: "/student/queue",
		},
		{
			label: "Shopping",
			description: "Browse available items",
			icon: icons["shopping"],
			to: "/student/shopping",
		},
	],

	volunteer: [
		{
			label: "Dashboard",
			description: "View volunteer tools and activity",
			icon: icons["home"],
			to: "/volunteer",
		},
		{
			label: "Inventory Management",
			description: "Manage stock and items",
			icon: icons["inventory"],
			to: "/volunteer/inventory",
		},
		{
			label: "Verify Cart",
			description: "Check and confirm carts",
			icon: icons["verifyCart"],
			to: "/volunteer/verify-cart",
		},
		{
			label: "Manage Queue",
			description: "Monitor and adjust the queue",
			icon: icons["queue"],
			to: "/volunteer/queue",
		},
		{
			label: "Manage Emergency Bags",
			description: "View Emergency Bags",
			icon: icons["management"],
			to: "/volunteer/emergency-bag/manage",
		},
	],
	admin: [
		{
			label: "Dashboard",
			description: "Administrative overview",
			icon: icons["home"],
			to: "/admin",
		},
		{
			label: "Management",
			description: "Administrative configuration tools",
			icon: icons["management"],
			children: [
				{
					label: "Manage Roles",
					description: "Add, edit, or remove roles",
					icon: icons["volunteer"],
					to: "/admin/manage/roles",
				},
				{
					label: "Manage Categories",
					description: "Add or edit categories",
					icon: icons["categories"],
					to: "/admin/manage/categories",
				},
				{
					label: "Manage Sources",
					description: "Add or edit data sources",
					icon: icons["sources"],
					to: "/admin/manage/sources",
				},
				{
					label: "Manage Locations",
					description: "Add or edit locations",
					icon: icons["locations"],
					to: "/admin/manage/locations",
				},
				{
					label: "Manage Tutorials",
					description: "Add or edit tutorials",
					icon: icons["tutorials"],
					to: "/admin/manage/tutorials",
				},
				{
					label: "Manage Announcements",
					description: "Create and manage announcements",
					icon: icons["announcements"],
					to: "/admin/announcements",
				},
			],
		},

		{
			label: "Past Inventory Intake Sessions",
			description: "View past inventory intake sessions",
			icon: icons["inventory"],
			to: "/admin/intake-sessions/historical",
		},
	],
	headAdmin: [
		{
			label: "Dashboard",
			description: "Head administrative overview",
			icon: icons["home"],
			to: "/head-admin",
		},
		{
			label: "Data",
			description: "View and analyze system data",
			icon: icons["data"],
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
