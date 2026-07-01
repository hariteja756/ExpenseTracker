import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Salary', 'Others'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
