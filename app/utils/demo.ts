import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { nextTick, type Ref, type ComputedRef } from 'vue'


export const StudentDashboardTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#queue',
                popover: {
                    title: 'Queue',
                    description: 'Join the queue here to get access to the food pantry. You can also check your current position in the queue.',
                    side: 'bottom',
                }
            },
            {
                element: '#shopping',
                popover: {
                    title: 'Shopping',
                    description: 'Browse available food and household items here. Add items to your cart and submit your order.',
                    side: 'bottom',
                }
            },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenDashboardTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenDashboardTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const StudentQueueTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#status',
                popover: {
                    title: 'Current Status',
                    description: 'Click Join Queue to get in line. Once joined you can see your position and public display name.',
                    side: 'bottom',
                }
            },
            {
                element: '#queue',
                popover: {
                    title: 'Current Queue',
                    description: 'See everyone currently waiting in the queue. Your row will be highlighted when you join.',
                    side: 'bottom',
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenQueueTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenQueueTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const StudentShoppingTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#category-grid',
                popover: {
                    title: 'Shopping Categories',
                    description: 'Select a category to see what items are available.',
                    side: 'bottom',
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenShoppingTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenShoppingTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const StudentItemsTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '.tour-qty',
                popover: {
                    title: 'Quantity',
                    description: 'This is how many items are available.',
                    side: 'bottom',
                }
            },
            {
                element: '.tour-add',
                popover: {
                    title: 'Add to Cart',
                    description: 'Click this to add the item to your cart.',
                    side: 'bottom',
                }
            },
            {
                element: '#tour-deal',
                popover: {
                    title: 'Deal Filter',
                    description: 'Click this to see items with current deals.',
                    side: 'bottom',
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenItemsTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenItemsTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

//Volunteer Tour Actions
export const VolunteerDashboardTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#inventory-management',
                popover: {
                    title: 'Inventory Management',
                    description: 'Manage the inventory of items available for distribution.',
                    side: 'bottom',
                }
            },
            {
                element: '#verify-cart',
                popover: {
                    title: 'Cart Verification',
                    description: 'Review and verify student orders before they are finalized.',
                    side: 'bottom',
                }
            },
            {
                element: '#manage-queue',
                popover: {
                    title: 'Queue Management',
                    description: 'View and manage the queue of students waiting for assistance.',
                    side: 'bottom',
                }
            },
            {
                element: '#emergency-bags',
                popover: {
                    title: 'Emergency Bags',
                    description: 'Prepare and manage emergency bags.',
                    side: 'bottom',
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenVolunteerDashboardTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenVolunteerDashboardTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

//Emergency Bags
const addSteps = [
    { element: '#tab-add', popover: { title: 'Add', description: 'Add a new emergency bag to the system.', side: 'bottom' } },
    { element: '#product-list', popover: { title: 'Add Products', description: 'Add products to the selected emergency bag.', side: 'bottom' } },
    { element: '#current-bag', popover: { title: 'Current Bag', description: 'View and edit the current items in the emergency bag.', side: 'bottom' } },
    { element: '#category-selection', popover: { title: 'Category Selection', description: 'Select the category for the emergency bag.', side: 'bottom' } },
    { element: '#expiry-date', popover: { title: 'Expiry Date', description: 'Set the expiry date for the emergency bag.', side: 'bottom' } },
    { element: '#confirm-button', popover: { title: 'Confirm Button', description: 'Click to confirm and save the emergency bag details.', side: 'bottom' } },
    { element: '#tab-view', popover: { title: 'View', description: 'View the details of the selected emergency bag.', side: 'bottom' } },

]

const viewSteps = [
    { element: '#manage-search', popover: { title: 'Search', description: 'Search for emergency bags by ID, location, or category.', side: 'bottom' } },
    { element: '#select-bags', popover: { title: 'Selected Bags', description: 'Click multiple bags for bulk movement.', side: 'bottom' } },
    { element: '#bulk-move', popover: { title: 'Bulk Move', description: 'Select one or more bags and choose a location to move them to.', side: 'bottom' } },
    {
        element: '#open-bag button:has(.i-lucide\\:chevron-down)',
        popover: {
            title: 'Open Bag',
            description: 'Click here to expand the bag and see more options.',
            side: 'bottom'
        },
        // Trigger action before moving to the next step
        onNext: async () => {
            const btn = document.querySelector('#open-bag button:has(.i-lucide\\:chevron-down)') as HTMLElement
            if (btn) btn.click()
            await nextTick()
        },
    },
    { element: '#move-bag', popover: { title: 'Change Location', description: 'Choose a location to move the bag to.', side: 'bottom' } },
    { element: '#bag-items', popover: { title: 'Bag Items', description: 'View the items contained in the emergency bag.', side: 'bottom' } },
    { element: '#edit-trigger', popover: { title: 'Edit Bag', description: 'Click to edit the contents and details of the emergency bag.', side: 'bottom' } },
]

export const EmergencyBagsTour = (activeTab: Ref<string>, bagsLength: ComputedRef<number>) => {
    const startTour = async () => {
        let steps: any[] = []

        if (activeTab.value === 'add') {
            steps = addSteps
        } else if (activeTab.value === 'view') {
            steps = bagsLength.value > 0 ? viewSteps : [viewSteps[0]]
        }

        //Return early if no steps match
        if (steps.length === 0) return

        const driverObj = driver({
            showProgress: true,
            steps
        })

        await nextTick()
        driverObj.drive()
    }

    if (import.meta.client) {
        const storageKey = `hasSeenEmergencyBagsTour_${activeTab.value}`
        const hasSeenTour = localStorage.getItem(storageKey)

        if (!hasSeenTour) {
            nextTick().then(() => {
                startTour()
                localStorage.setItem(storageKey, 'true')
            })
        }
    }

    return { startTour }
}

export const InventoryTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#tour-category-selection', popover: { title: 'Category Selection', description: 'Select a category to view its items.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenInventoryTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenInventoryTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const AllItemsInventoryTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '.tour-edit', popover: { title: 'Edit', description: 'Edit this item or manage its deal.' } },
            { element: '.tour-decrement', popover: { title: 'Decrease', description: 'Reduce the quantity.' } },
            { element: '.tour-increment', popover: { title: 'Increase', description: 'Increase the quantity.' } }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenAllItemsInventoryTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenInventoryTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const CategoryInventoryTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '.tour-edit', popover: { title: 'Edit', description: 'Edit this item or manage its deal.' } },
            { element: '.tour-decrement', popover: { title: 'Decrease', description: 'Reduce the quantity.' } },
            { element: '.tour-increment', popover: { title: 'Increase', description: 'Increase the quantity.' } }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenCategoryInventoryTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenCategoryInventoryTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const AddInventoryItemTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#image',
                popover: {
                    title: 'Upload Image',
                    description: 'Start by uploading an image for the item.'
                }
            },
            {
                element: '#itemName',
                popover: {
                    title: 'Item Name',
                    description: 'Enter a clear and recognizable name.'
                }
            },
            {
                element: '#similar',
                popover: {
                    title: 'Similar Items',
                    description: 'Compare to avoid creating duplicates.'
                }
            },
            {
                element: '#submit',
                popover: {
                    title: 'Submit',
                    description: 'Click here to create the new item.'
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenAddInventoryItemTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenAddInventoryItemTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const EditInventoryItemTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#image',
                popover: {
                    title: 'Upload Image',
                    description: 'Edit uploaded image for the item.'
                }
            },
            {
                element: '#itemName',
                popover: {
                    title: 'Item Name',
                    description: 'Change the name of the item.'
                }
            },
            {
                element: '#similar',
                popover: {
                    title: 'Similar Items',
                    description: 'View and avoid creating duplicates.'
                }
            },
            {
                element: '#category',
                popover: {
                    title: 'Category',
                    description: 'Change the category of the item.'
                }
            },
            {
                element: '#archived',
                popover: {
                    title: 'Archived',
                    description: 'Check this box to archive the item.'
                }
            },
            {
                element: '#submit',
                popover: {
                    title: 'Submit',
                    description: 'Click here to save changes to the item.'
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenEditInventoryItemTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenEditInventoryItemTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const DealTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#deal-options', popover: { title: 'Deal', description: 'Edit the deal for this item here. You can choose to have no deal, a free deal, or a custom deal.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenDealTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenDealTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const ManageQueueTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#queue-cart-sessions', popover: { title: 'Cart Sessions', description: 'View active cart sessions here.' } },
            { element: '#volunteer-queue', popover: { title: 'Add', description: 'Add a student to the queue, ping them, or remove them by clicking the three dots.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenVerifyQueueTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenVerifyQueueTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const VerifyCartTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#tour-cart-preview', popover: { title: 'Cart Preview', description: 'View the details of the selected cart.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenVerifyCartTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenVerifyCartTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

//Admin Tours
export const AdminDashboardTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#data', popover: { title: 'Data', description: 'View the data for the selected item.' } },
            { element: '#manage-roles', popover: { title: 'Manage Roles', description: 'View, edit, and manage user roles.' } },
            { element: '#manage-categories', popover: { title: 'Manage Categories', description: 'View and manage item categories.' } },
            { element: '#manage-sources', popover: { title: 'Manage Sources', description: 'View and manage sources.' } },
            { element: '#manage-locations', popover: { title: 'Manage Locations', description: 'View and manage locations.' } },

        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenAdminDashboardTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenAdminDashboardTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const ManageCategoryTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#add-categories', popover: { title: 'Add Category', description: 'Click here to add a new category.' } },
            { element: 'table td:last-child button', popover: { title: 'Edit Category', description: 'Click the edit button to modify category details.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenManageCategoryTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenManageCategoryTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const EditCategoryTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#image',
                popover: {
                    title: 'Upload Image',
                    description: 'Change the uploaded image for the category.'
                }
            },
            {
                element: '#categoryName',
                popover: {
                    title: 'Category Name',
                    description: 'Change the name of the category.'
                }
            },
            {
                element: '#similar',
                popover: {
                    title: 'Similar Categories',
                    description: 'View and avoid duplicates.'
                }
            },
            {
                element: '#archived',
                popover: {
                    title: 'Archived',
                    description: 'Check this box to archive the category.'
                }
            },
            {
                element: '#submit',
                popover: {
                    title: 'Submit',
                    description: 'Click here to save changes to the category.'
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenEditCategoryTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenEditCategoryTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const ManageRolesTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#refresh', popover: { title: 'Refresh', description: 'Click to refresh the page.' } },
            { element: '#manage-pending-requests', popover: { title: 'Pending Requests', description: 'Review and manage pending volunteer requests.' } },
            { element: '#manage-roles', popover: { title: 'Manage Roles', description: 'Edit roles.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenManageRolesTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenManageRolesTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const ManageLocationsTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            { element: '#tour-add-locations', popover: { title: 'Add', description: 'Add a new location here.' } },
            { element: 'table td:last-child button', popover: { title: 'Edit', description: 'Edit location details.' } },
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenManageLocationsTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenManageLocationsTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const AddLocationsTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#image',
                popover: {
                    title: 'Upload Image',
                    description: 'Start by uploading an image for the location.'
                }
            },
            {
                element: '#name',
                popover: {
                    title: 'Location Name',
                    description: 'Enter a clear and recognizable name.'
                }
            },
            {
                element: '#link',
                popover: {
                    title: 'Link',
                    description: 'Provide a link to the website of the location.'
                }
            },
            {
                element: '#address',
                popover: {
                    title: 'Address',
                    description: 'Provide the full address of the location.'
                }
            },
            {
                element: '#similar',
                popover: {
                    title: 'Similar Locations',
                    description: 'These help you avoid creating duplicates.'
                }
            },
            {
                element: '#submit',
                popover: {
                    title: 'Submit',
                    description: 'Click here to create the new location.'
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenAddLocationsTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenAddLocationsTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}

export const EditLocationTour = () => {
    const driverObj = driver({
        showProgress: false,
        steps: [
            {
                element: '#image',
                popover: {
                    title: 'Upload Image',
                    description: 'Edit uploaded image for the location.'
                }
            },
            {
                element: '#name',
                popover: {
                    title: 'Location Name',
                    description: 'Change the name of the location.'
                }
            },
            {
                element: '#link',
                popover: {
                    title: 'Link',
                    description: 'Change the link to the website of the location.'
                }
            },
            {
                element: '#address',
                popover: {
                    title: 'Address',
                    description: 'Change the address of the location.'
                }
            },
            {
                element: '#similar',
                popover: {
                    title: 'Similar Locations',
                    description: 'View and avoid creating duplicates.'
                }
            },
            {
                element: '#archived',
                popover: {
                    title: 'Archived',
                    description: 'Check this box to archive the location.'
                }
            },
            {
                element: '#submit',
                popover: {
                    title: 'Submit',
                    description: 'Click here to save changes to the location.'
                }
            }
        ]
    })

    if (import.meta.client) {
        const hasSeenTour = localStorage.getItem('hasSeenEditLocationsTour')
        if (!hasSeenTour) {
            driverObj.drive()
            localStorage.setItem('hasSeenEditLocationsTour', 'true')
        }
    }

    return { startTour: () => driverObj.drive() }
}
