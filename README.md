# Raw Vegan Food Price Tracker

A Progressive Web Application (PWA) for tracking and comparing prices of raw vegan food products across different stores and currencies.

## Features

- Track product prices with standardized calculations
- Compare prices across different stores
- Support for multiple currencies (DKK, EUR, USD)
- Calculate standardized prices per base unit (kg, L, piece)
- Maintain a running total of expenses in Danish Kroner (DKK)
- Filter and sort product entries
- Works offline with local data storage
- Mobile-friendly responsive design

## Installation and Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/raw-food-tracker.git
   cd raw-food-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   This will launch the application at http://localhost:8080

### Production Build

To create a production build:

```
npm run build
```

The optimized files will be in the `dist/` directory.

### PWA Icons

The project includes an SVG icon that serves as a placeholder. For a production deployment, you should generate PNG icons in the following sizes:
- icon-192x192.png
- icon-512x512.png

You can use tools like https://realfavicongenerator.net/ to create PNG icons from the provided SVG.

## Deployment

### Manual Deployment

To manually deploy to GitHub Pages:

```
cd ..  # Go to the parent directory
./deploy-gh-pages.sh
```

This script builds the project and deploys it to the gh-pages branch.

### Automated Deployment

This project uses GitHub Actions for CI/CD. When you push to the main branch, the workflow will:
1. Install dependencies
2. Run tests
3. Build the project
4. Deploy to GitHub Pages

## Usage

The application allows you to:

1. **Add new food items** - Click the "Add Item" button to enter details about a new purchase
2. **View your items** - All items are displayed in a list with basic information
3. **Edit items** - Click on any item to edit or delete it
4. **Filter items** - Use the filter button to show specific items
5. **Sort items** - Use the dropdown to sort by name, date, or price
6. **Compare prices** - Double-click or right-click on an item to see price comparisons for the same product across different stores

## Standardized Price Calculations

The application calculates standardized prices by converting different package sizes to a common base unit:
- Weight items (g, kg) → price per kilogram
- Volume items (ml, L) → price per liter
- Count items (piece, bunch) → price per piece

This allows you to easily compare prices across different stores, package sizes, and currencies.

## Data Storage

The application uses:
- IndexedDB for primary data storage
- localStorage as a backup/fallback mechanism
- Service workers for offline capabilities

All data is stored locally on your device.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 