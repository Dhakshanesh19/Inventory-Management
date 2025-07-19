const Item = require('../models/Item');

exports.getItems = async (req, res) => {
    try {
      const userId = req.user.id;
      const items = await Item.find({ userId });
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error.message);
      res.status(500).json({ msg: 'Failed to fetch items.', error: error.message });
    }
  };
  
  

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
        userId: req.user.id    // Associate item with logged-in user
      });
  
      await newItem.save();
      res.status(201).json({ msg: 'Item added successfully.', item: newItem });
  
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ msg: 'Failed to add item.', error: error.message });
    }
  };
  
  

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description } = req.body;
  await Item.findByIdAndUpdate(id, { name, quantity, price, description });
  res.json({ msg: 'Item updated successfully' });
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.json({ msg: 'Item deleted successfully' });
};
