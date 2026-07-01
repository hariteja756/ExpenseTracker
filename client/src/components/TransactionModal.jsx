import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { name: 'Food', emoji: '🍔' },
  { name: 'Travel', emoji: '✈️' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Bills', emoji: '🧾' },
  { name: 'Health', emoji: '🏥' },
  { name: 'Salary', emoji: '💼' },
  { name: 'Others', emoji: '🏷️' }
];

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction = null }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setType(transaction.type);
      setCategory(transaction.category);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setDescription(transaction.description || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
    setError('');
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !amount || !type || !category || !date) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title,
        amount: parseFloat(amount),
        type,
        category,
        date,
        description,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 animate-apple-fade" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="w-full max-w-lg bg-[#111111] border border-[#222222] rounded-none shadow-2xl relative z-10 overflow-hidden animate-apple-modal">
        <div className="flex justify-between items-center px-8 py-5 border-b border-[#222222]">
          <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
            {transaction ? 'EDIT RECORD' : 'ADD RECORD'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-955/30 border border-red-900/50 text-red-400 text-xs font-semibold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (e.target.value === 'income') {
                    setCategory('Salary');
                  } else {
                    setCategory('Food');
                  }
                }}
                className="w-full px-4 py-3 brand-input rounded-none focus:outline-none text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <option value="expense">EXPENSE</option>
                <option value="income">INCOME</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 brand-input rounded-none focus:outline-none text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.emoji} {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.G. GROCERIES"
                className="w-full px-4 py-3 brand-input rounded-none focus:outline-none text-xs uppercase tracking-wider font-semibold"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 brand-input rounded-none focus:outline-none text-xs uppercase tracking-wider font-semibold"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 brand-input rounded-none focus:outline-none text-xs font-bold uppercase tracking-wider"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ADD DETAILS..."
              rows="3"
              className="w-full px-4 py-3 brand-input rounded-none focus:outline-none text-xs uppercase tracking-wider font-semibold resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-black hover:bg-[#151515] border border-[#222222] text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 btn-brand-primary text-xs font-bold tracking-widest flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'SAVE RECORD'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
