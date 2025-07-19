const Item = require('../models/Item');

// Fetch items of logged-in user
exports.getItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Item.find({ userId });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ msg: 'Failed to fetch items.' });
  }
};

// Add item (linked to user)
exports.addItem = async (req, res) => {
  try {
    const { name, quantity, price, description } = req.body;

    if (!name || !quantity || !price) {
      return res.status(400).json({ msg: 'Name, quantity, and price are required.' });
    }

    const newItem = new Item({
      name,
      quantity,
      price,
      description,
      userId: req.user.id
    });

    await newItem.save();
    res.status(201).json({ msg: 'Item added successfully.', item: newItem });

  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({ msg: 'Failed to add item.' });
  }
};

// Update item (only if owned by user)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price, description } = req.body;
    const userId = req.user.id;

    const item = await Item.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ msg: 'Item not found or unauthorized.' });
    }

    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    item.price = price || item.price;
    item.description = description || item.description;

    await item.save();

    res.json({ msg: 'Item updated successfully.', item });

  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ msg: 'Failed to update item.' });
  }
};

// Delete item (only if owned by user)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await Item.findOneAndDelete({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ msg: 'Item not found or unauthorized.' });
    }

    res.json({ msg: 'Item deleted successfully.' });

  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ msg: 'Failed to delete item.' });
  }
};
