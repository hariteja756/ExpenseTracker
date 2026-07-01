import Transaction from '../models/Transaction.js';

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  const { title, amount, type, category, date, description } = req.body;

  try {
    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: date || undefined,
      description,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  const { title, amount, type, category, date, description } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this transaction' });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount !== undefined ? amount : transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    transaction.description = description !== undefined ? description : transaction.description;

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
