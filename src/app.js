import { initIndexedDB, getAllItems, addItem, updateItem, deleteItem } from './database/database.js';
import { saveToLocalStorage, loadFromLocalStorage, isLocalStorageAvailable } from './utils/persistence.js';
import { calculateStandardizedPrice, calculateBaseUnit } from './utils/calculations.js';
import { convertCurrency } from './utils/currency.js';
import { ProductListItem } from './components/ProductListItem.js';
import { FilterDropdown } from './components/FilterDropdown.js';

export class App {
  constructor() {
    this.items = [];
    this.currentScreen = 'main-dashboard';
    this.filterOptions = {
      product: '',
      store: '',
      unit: ''
    };
    this.sortOption = 'date';
    this.currentItemId = null;
  }

  async init() {
    // Initialize database
    await initIndexedDB();
    
    // Load data
    await this.loadData();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initial UI rendering
    this.renderProductList();
    this.updateTotal();
  }

  async loadData() {
    try {
      // Try loading from IndexedDB first
      this.items = await getAllItems();
      
      // If no items in DB, try loading from localStorage
      if (this.items.length === 0 && isLocalStorageAvailable()) {
        const localData = loadFromLocalStorage('foodItems');
        if (localData && localData.length > 0) {
          this.items = localData;
          // Save to IndexedDB for future
          for (const item of this.items) {
            await addItem(item);
          }
        } else {
          // Load test data if no data is available
          this.loadTestData();
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to test data
      this.loadTestData();
    }
  }

  loadTestData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.items = [
      {
        id: 1,
        productName: 'Organic Bananas',
        storeName: 'Super Brugsen',
        quantity: 1,
        unit: 'kg',
        price: 24.95,
        currency: 'DKK',
        purchaseDate: today.toISOString().split('T')[0],
        notes: 'Really ripe and sweet'
      },
      {
        id: 2,
        productName: 'Avocados',
        storeName: 'Netto',
        quantity: 3,
        unit: 'piece',
        price: 30,
        currency: 'DKK',
        purchaseDate: yesterday.toISOString().split('T')[0],
        notes: 'On sale this week'
      },
      {
        id: 3,
        productName: 'Organic Almonds',
        storeName: 'Irma',
        quantity: 500,
        unit: 'g',
        price: 12.50,
        currency: 'EUR',
        purchaseDate: yesterday.toISOString().split('T')[0],
        notes: ''
      }
    ];
    
    // Save test data to storage
    if (isLocalStorageAvailable()) {
      saveToLocalStorage('foodItems', this.items);
    }
    
    // Save to IndexedDB
    for (const item of this.items) {
      addItem(item);
    }
  }

  setupEventListeners() {
    // Add item button
    document.getElementById('add-item-btn').addEventListener('click', () => {
      this.showScreen('add-item-screen');
    });
    
    // Cancel add button
    document.getElementById('cancel-add').addEventListener('click', () => {
      this.showScreen('main-dashboard');
    });
    
    // Add item form submission
    document.getElementById('add-item-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddItem();
    });
    
    // Cancel edit button
    document.getElementById('cancel-edit').addEventListener('click', () => {
      this.showScreen('main-dashboard');
    });
    
    // Edit item form submission
    document.getElementById('edit-item-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUpdateItem();
    });
    
    // Delete item button
    document.getElementById('delete-item').addEventListener('click', () => {
      this.handleDeleteItem();
    });
    
    // Close comparison button
    document.getElementById('close-comparison').addEventListener('click', () => {
      this.showScreen('main-dashboard');
    });
    
    // Sort select
    document.getElementById('sort-select').addEventListener('change', (e) => {
      this.sortOption = e.target.value;
      this.renderProductList();
    });
    
    // Filter button
    document.getElementById('filter-btn').addEventListener('click', () => {
      // Create filter dropdown if it doesn't exist yet
      if (!this.filterDropdown) {
        this.filterDropdown = new FilterDropdown(
          this.getUniqueValues('productName'),
          this.getUniqueValues('storeName'),
          this.getUniqueValues('unit'),
          this.filterOptions,
          (newFilters) => {
            this.filterOptions = newFilters;
            this.renderProductList();
          }
        );
      } else {
        // Update options
        this.filterDropdown.updateOptions(
          this.getUniqueValues('productName'),
          this.getUniqueValues('storeName'),
          this.getUniqueValues('unit')
        );
      }
      
      this.filterDropdown.show();
    });
  }

  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.add('active');
    this.currentScreen = screenId;
    
    // Reset forms when showing them
    if (screenId === 'add-item-screen') {
      document.getElementById('add-item-form').reset();
      document.getElementById('purchase-date').valueAsDate = new Date();
    }
  }

  async handleAddItem() {
    const newItem = {
      productName: document.getElementById('product-name').value,
      storeName: document.getElementById('store-name').value,
      quantity: parseFloat(document.getElementById('quantity').value),
      unit: document.getElementById('unit').value,
      price: parseFloat(document.getElementById('price').value),
      currency: document.getElementById('currency').value,
      purchaseDate: document.getElementById('purchase-date').value,
      notes: document.getElementById('notes').value
    };
    
    try {
      // Add to database
      const id = await addItem(newItem);
      newItem.id = id;
      
      // Add to local array
      this.items.push(newItem);
      
      // Save to localStorage
      if (isLocalStorageAvailable()) {
        saveToLocalStorage('foodItems', this.items);
      }
      
      // Update UI
      this.renderProductList();
      this.updateTotal();
      this.showScreen('main-dashboard');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  }

  editItem(id) {
    const item = this.items.find(item => item.id === id);
    if (!item) return;
    
    this.currentItemId = id;
    
    // Populate form fields
    document.getElementById('edit-item-id').value = id;
    document.getElementById('edit-product-name').value = item.productName;
    document.getElementById('edit-store-name').value = item.storeName;
    document.getElementById('edit-quantity').value = item.quantity;
    document.getElementById('edit-unit').value = item.unit;
    document.getElementById('edit-price').value = item.price;
    document.getElementById('edit-currency').value = item.currency;
    document.getElementById('edit-purchase-date').value = item.purchaseDate;
    document.getElementById('edit-notes').value = item.notes || '';
    
    // Show edit screen
    this.showScreen('edit-item-screen');
  }

  async handleUpdateItem() {
    const id = this.currentItemId;
    if (!id) return;
    
    const updatedItem = {
      id: id,
      productName: document.getElementById('edit-product-name').value,
      storeName: document.getElementById('edit-store-name').value,
      quantity: parseFloat(document.getElementById('edit-quantity').value),
      unit: document.getElementById('edit-unit').value,
      price: parseFloat(document.getElementById('edit-price').value),
      currency: document.getElementById('edit-currency').value,
      purchaseDate: document.getElementById('edit-purchase-date').value,
      notes: document.getElementById('edit-notes').value
    };
    
    try {
      // Update in database
      await updateItem(updatedItem);
      
      // Update in local array
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items[index] = updatedItem;
      }
      
      // Save to localStorage
      if (isLocalStorageAvailable()) {
        saveToLocalStorage('foodItems', this.items);
      }
      
      // Update UI
      this.renderProductList();
      this.updateTotal();
      this.showScreen('main-dashboard');
      this.currentItemId = null;
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  }

  async handleDeleteItem() {
    const id = this.currentItemId;
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      // Delete from database
      await deleteItem(id);
      
      // Delete from local array
      this.items = this.items.filter(item => item.id !== id);
      
      // Save to localStorage
      if (isLocalStorageAvailable()) {
        saveToLocalStorage('foodItems', this.items);
      }
      
      // Update UI
      this.renderProductList();
      this.updateTotal();
      this.showScreen('main-dashboard');
      this.currentItemId = null;
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  }

  showComparison(productName) {
    // Filter items by product name
    const matchingItems = this.items.filter(item => 
      item.productName.toLowerCase() === productName.toLowerCase()
    );
    
    if (matchingItems.length === 0) return;
    
    // Set product name in comparison header
    document.getElementById('comparison-product-name').textContent = productName;
    
    // Render comparison list
    const comparisonList = document.getElementById('comparison-list');
    comparisonList.innerHTML = '';
    
    matchingItems.forEach(item => {
      // Calculate standardized price in item's currency
      const standardizedPrice = calculateStandardizedPrice(
        item.price,
        item.quantity,
        item.unit
      );
      
      // Convert to DKK for fair comparison
      const standardizedPriceDKK = item.currency === 'DKK' 
        ? standardizedPrice
        : convertCurrency(standardizedPrice, item.currency, 'DKK');
      
      const baseUnit = calculateBaseUnit(item.unit);
      
      const itemElement = document.createElement('div');
      itemElement.className = 'product-item';
      itemElement.innerHTML = `
        <div class="product-details">
          <div class="product-store">${item.storeName}</div>
          <div class="product-date">${new Date(item.purchaseDate).toLocaleDateString()}</div>
        </div>
        <div class="product-price-details">
          <div class="product-price">${item.price} ${item.currency}</div>
          <div class="standardized-price">${standardizedPriceDKK.toFixed(2)} DKK/${baseUnit}</div>
        </div>
      `;
      
      comparisonList.appendChild(itemElement);
    });
    
    // Show comparison screen
    this.showScreen('comparison-screen');
  }

  renderProductList() {
    const productList = document.getElementById('product-list');
    const emptyState = document.getElementById('empty-state');
    
    // Filter items
    let filteredItems = this.items.filter(item => {
      return (
        (!this.filterOptions.product || item.productName.toLowerCase().includes(this.filterOptions.product.toLowerCase())) &&
        (!this.filterOptions.store || item.storeName.toLowerCase().includes(this.filterOptions.store.toLowerCase())) &&
        (!this.filterOptions.unit || item.unit === this.filterOptions.unit)
      );
    });
    
    // Sort items
    filteredItems.sort((a, b) => {
      switch (this.sortOption) {
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'date':
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        case 'price':
          // Convert to DKK for sorting
          const aPrice = a.currency === 'DKK' ? a.price : convertCurrency(a.price, a.currency, 'DKK');
          const bPrice = b.currency === 'DKK' ? b.price : convertCurrency(b.price, b.currency, 'DKK');
          return aPrice - bPrice;
        case 'priceDesc':
          // Convert to DKK for sorting
          const aPriceDesc = a.currency === 'DKK' ? a.price : convertCurrency(a.price, a.currency, 'DKK');
          const bPriceDesc = b.currency === 'DKK' ? b.price : convertCurrency(b.price, b.currency, 'DKK');
          return bPriceDesc - aPriceDesc;
        default:
          return 0;
      }
    });
    
    // Clear list
    productList.innerHTML = '';
    
    // Show empty state if no items
    if (filteredItems.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      
      // Render items
      filteredItems.forEach(item => {
        const listItem = new ProductListItem(item, 
          (id) => this.editItem(id),
          (name) => this.showComparison(name)
        );
        productList.appendChild(listItem.element);
      });
    }
  }

  updateTotal() {
    // Calculate total in DKK
    let total = 0;
    
    this.items.forEach(item => {
      // Convert to DKK if necessary
      if (item.currency === 'DKK') {
        total += item.price;
      } else {
        total += convertCurrency(item.price, item.currency, 'DKK');
      }
    });
    
    // Update UI
    document.getElementById('total-amount').textContent = total.toFixed(2);
  }

  getUniqueValues(property) {
    const values = new Set();
    this.items.forEach(item => {
      if (item[property]) {
        values.add(item[property]);
      }
    });
    return Array.from(values);
  }
} 