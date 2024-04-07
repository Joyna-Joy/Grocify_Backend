const express = require('express');
const router = express.Router();



// Sample grocery items
let groceryItems = ['Apples', 'Bananas', 'Milk', 'Bread'];


// Route to get all grocery items
router.get('/groceryItems', (req, res) => {
  res.json(groceryItems);
});

// Route to add a new grocery item
router.post('/groceryItems', (req, res) => {
  const newItem = req.body.item;
  groceryItems.push(newItem);
  res.json({ message: 'Item added successfully' });
});

// Route to delete a grocery item
router.delete('/groceryItems/:index', (req, res) => {
  const index = req.params.index;
  groceryItems.splice(index, 1);
  res.json({ message: 'Item deleted successfully' });
});

// Route to update a grocery item
router.put('/groceryItems/:index', (req, res) => {
  const index = req.params.index;
  const updatedItem = req.body.item;
  groceryItems[index] = updatedItem;
  res.json({ message: 'Item updated successfully' });
});

module.exports = router;