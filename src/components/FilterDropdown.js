/**
 * Component to render and control the filter dropdown
 */
export class FilterDropdown {
  /**
   * Create a filter dropdown component
   * @param {Array<string>} products - List of product names
   * @param {Array<string>} stores - List of store names
   * @param {Array<string>} units - List of units
   * @param {Object} currentFilters - Current filter values
   * @param {Function} onApplyFilters - Callback for when filters are applied
   */
  constructor(products, stores, units, currentFilters, onApplyFilters) {
    this.products = products;
    this.stores = stores;
    this.units = units;
    this.currentFilters = currentFilters;
    this.onApplyFilters = onApplyFilters;
    this.element = null;
    this.initialize();
  }

  /**
   * Initialize the dropdown
   */
  initialize() {
    // Remove existing element if present
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // Create filter container
    this.element = document.createElement('div');
    this.element.className = 'filter-dropdown';
    this.element.style.display = 'none';
    
    // Render dropdown content
    this.renderContent();
    
    // Add to document
    document.body.appendChild(this.element);
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.element.style.display !== 'none' && !this.element.contains(e.target) && e.target.id !== 'filter-btn') {
        this.hide();
      }
    });
  }

  /**
   * Render the dropdown content
   */
  renderContent() {
    this.element.innerHTML = `
      <div class="filter-header">
        <h3>Filter Products</h3>
        <button id="clear-filters" class="secondary-button">Clear All</button>
      </div>
      
      <div class="filter-section">
        <label for="filter-product">Product Name</label>
        <input type="text" id="filter-product" placeholder="Filter by product name" value="${this.currentFilters.product || ''}">
      </div>
      
      <div class="filter-section">
        <label for="filter-store">Store</label>
        <select id="filter-store">
          <option value="">All Stores</option>
          ${this.stores.map(store => `
            <option value="${store}" ${this.currentFilters.store === store ? 'selected' : ''}>${store}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="filter-section">
        <label for="filter-unit">Unit</label>
        <select id="filter-unit">
          <option value="">All Units</option>
          ${this.units.map(unit => `
            <option value="${unit}" ${this.currentFilters.unit === unit ? 'selected' : ''}>${unit}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="filter-buttons">
        <button id="cancel-filter" class="secondary-button">Cancel</button>
        <button id="apply-filter" class="primary-button">Apply Filters</button>
      </div>
    `;
    
    // Add event listeners after content is rendered
    setTimeout(() => {
      // Clear filters
      document.getElementById('clear-filters').addEventListener('click', () => {
        this.clearFilters();
      });
      
      // Cancel button
      document.getElementById('cancel-filter').addEventListener('click', () => {
        this.hide();
      });
      
      // Apply filters
      document.getElementById('apply-filter').addEventListener('click', () => {
        this.applyFilters();
      });
    }, 0);
  }

  /**
   * Show the dropdown
   */
  show() {
    // Position the dropdown
    const filterBtn = document.getElementById('filter-btn');
    const rect = filterBtn.getBoundingClientRect();
    
    this.element.style.position = 'absolute';
    this.element.style.top = `${rect.bottom + window.scrollY + 5}px`;
    this.element.style.left = `${rect.left + window.scrollX}px`;
    
    // Show the dropdown
    this.element.style.display = 'block';
  }

  /**
   * Hide the dropdown
   */
  hide() {
    this.element.style.display = 'none';
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    document.getElementById('filter-product').value = '';
    document.getElementById('filter-store').value = '';
    document.getElementById('filter-unit').value = '';
  }

  /**
   * Apply the current filters
   */
  applyFilters() {
    const newFilters = {
      product: document.getElementById('filter-product').value,
      store: document.getElementById('filter-store').value,
      unit: document.getElementById('filter-unit').value
    };
    
    this.currentFilters = newFilters;
    this.onApplyFilters(newFilters);
    this.hide();
  }

  /**
   * Update dropdown options
   * @param {Array<string>} products - Updated list of product names
   * @param {Array<string>} stores - Updated list of store names
   * @param {Array<string>} units - Updated list of units
   */
  updateOptions(products, stores, units) {
    this.products = products;
    this.stores = stores;
    this.units = units;
    this.renderContent();
  }
} 