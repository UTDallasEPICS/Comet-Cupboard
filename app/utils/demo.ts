import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

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