
Device screens to test design for:

Mobile: Samsung Galaxy S8+ (360 x 740), iPhone 14 Pro Max (430 x 932). Make sure to flip too.

Tablet: iPad (768 x 1024), iPad Pro (1024 x 1366). Make sure to flip too.

Computer/Laptop: Desktop (1920 x 1080). Macbook Air (1280 x 832)

```json
/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        screens: {
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        }
    }
}
```

```json
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    theme: {
        screens: {
            'xs': '475px',
            ...defaultTheme.screens,
        },
    },
    plugins: [],
}
```

Honestly, I just use Samsung for vertical/horizontal and Desktop. Maybe occasional checks with tablet.
3 tabs in Chrome Dev tools
