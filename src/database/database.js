import Dexie from 'dexie';

// Create a Dexie database instance
const db = new Dexie('RawFoodTrackerDB');

// Define the database schema
db.version(1).stores({
  foodItems: '++id,productName,storeName,unit,currency,purchaseDate'
});

/**
 * Initialize the IndexedDB database
 * @returns {Promise<void>}
 */
export async function initIndexedDB() {
  try {
    await db.open();
    console.log('IndexedDB initialized successfully');
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    throw error;
  }
}

/**
 * Add a new food item to the database
 * @param {Object} item - The food item to add
 * @returns {Promise<number>} The ID of the newly added item
 */
export async function addItem(item) {
  try {
    const id = await db.foodItems.add(item);
    return id;
  } catch (error) {
    console.error('Error adding item to database:', error);
    throw error;
  }
}

/**
 * Get all food items from the database
 * @returns {Promise<Array>} Array of food items
 */
export async function getAllItems() {
  try {
    return await db.foodItems.toArray();
  } catch (error) {
    console.error('Error getting items from database:', error);
    throw error;
  }
}

/**
 * Get a food item by ID
 * @param {number} id - The ID of the item to retrieve
 * @returns {Promise<Object|undefined>} The food item or undefined if not found
 */
export async function getItemById(id) {
  try {
    return await db.foodItems.get(id);
  } catch (error) {
    console.error('Error getting item from database:', error);
    throw error;
  }
}

/**
 * Update an existing food item
 * @param {Object} item - The food item with updated values
 * @returns {Promise<void>}
 */
export async function updateItem(item) {
  try {
    await db.foodItems.update(item.id, item);
  } catch (error) {
    console.error('Error updating item in database:', error);
    throw error;
  }
}

/**
 * Delete a food item by ID
 * @param {number} id - The ID of the item to delete
 * @returns {Promise<void>}
 */
export async function deleteItem(id) {
  try {
    await db.foodItems.delete(id);
  } catch (error) {
    console.error('Error deleting item from database:', error);
    throw error;
  }
}

/**
 * Search for food items by product name
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of matching food items
 */
export async function searchItemsByProductName(query) {
  try {
    return await db.foodItems
      .where('productName')
      .startsWithIgnoreCase(query)
      .toArray();
  } catch (error) {
    console.error('Error searching items in database:', error);
    throw error;
  }
}

/**
 * Get food items by store name
 * @param {string} storeName - The store name to filter by
 * @returns {Promise<Array>} Array of matching food items
 */
export async function getItemsByStore(storeName) {
  try {
    return await db.foodItems
      .where('storeName')
      .equals(storeName)
      .toArray();
  } catch (error) {
    console.error('Error getting items by store from database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 * @returns {Promise<void>}
 */
export async function clearDatabase() {
  try {
    await db.foodItems.clear();
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
} 