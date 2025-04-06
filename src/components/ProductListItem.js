import { calculateStandardizedPrice, calculateBaseUnit } from '../utils/calculations.js';
import { convertCurrency } from '../utils/currency.js';

/**
 * Component to render a product item in the list
 */
export class ProductListItem {
  /**
   * Create a product list item component
   * @param {Object} item - The product item data
   * @param {Function} onEdit - Callback for edit action
   * @param {Function} onCompare - Callback for compare action
   */
  constructor(item, onEdit, onCompare) {
    this.item = item;
    this.onEdit = onEdit;
    this.onCompare = onCompare;
    this.element = this.render();
  }

  /**
   * Render the product item
   * @returns {HTMLElement} The product item element
   */
  render() {
    // Create container element
    const element = document.createElement('div');
    element.className = 'product-item';
    
    // Calculate standardized price
    const standardizedPrice = calculateStandardizedPrice(
      this.item.price,
      this.item.quantity,
      this.item.unit
    );
    
    // Get base unit
    const baseUnit = calculateBaseUnit(this.item.unit);
    
    // Format date
    const date = new Date(this.item.purchaseDate).toLocaleDateString();
    
    // Populate element with content
    element.innerHTML = `
      <div class="product-details">
        <div class="product-name">${this.item.productName}</div>
        <div class="product-store">${this.item.storeName}</div>
        <div class="product-date">${date}</div>
      </div>
      <div class="product-price-details">
        <div class="product-price">${this.item.price} ${this.item.currency}</div>
        <div class="standardized-price">${standardizedPrice.toFixed(2)} ${this.item.currency}/${baseUnit}</div>
      </div>
    `;
    
    // Add click handler for editing
    element.addEventListener('click', () => {
      this.onEdit(this.item.id);
    });
    
    // Add long press/right click for comparison
    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.onCompare(this.item.productName);
    });
    
    // Add double click for comparison
    element.addEventListener('dblclick', (e) => {
      e.preventDefault();
      this.onCompare(this.item.productName);
    });
    
    return element;
  }
} 