import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService';
import TransactionModal from '../components/TransactionModal';
import Analytics from '../components/Analytics';
import {
  LogOut,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Loader2,
} from 'lucide-react';

const CATEGORIES = {
  Food: '🍔',
  Travel: '✈️',
  Shopping: '🛍️',
  Bills: '🧾',
  Health: '🏥',
  Salary: '💼',
  Others: '🏷️',
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle Add / Edit Submit
  const handleModalSubmit = async (transactionData) => {
    if (selectedTransaction) {
      // Edit
      const updated = await updateTransaction(selectedTransaction._id, transactionData);
      setTransactions((prev) =>
        prev.map((t) => (t._id === selectedTransaction._id ? updated : t))
      );
    } else {
      // Add
      const created = await createTransaction(transactionData);
      setTransactions((prev) => [created, ...prev]);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        alert('Failed to delete transaction. Please try again.');
        console.error(err);
      }
    }
  };

  // Open modal for adding
  const handleAddClick = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Dynamic Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] pb-16">
      {/* Header */}
      <header className="border-b border-[#222222] bg-[#000000] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black font-display font-bold flex items-center justify-center text-lg">
              ET
            </div>
            <span className="font-display font-black text-xl tracking-tight uppercase">
              EXPENSE TRACKER
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] px-4 py-2 text-xs font-bold uppercase tracking-wider">
              <span className="text-zinc-500">MEMBER:</span>
              <span className="text-white">{user?.name}</span>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 bg-black hover:bg-[#111111] border border-[#222222] text-zinc-400 hover:text-white transition-all duration-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-apple-slide">
        {/* Welcome and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 border-b border-[#111111] pb-8">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tight uppercase">
              DASHBOARD
            </h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-2">
              Performance / Financial Summary
            </p>
          </div>
          <div>
            <button
              onClick={handleAddClick}
              className="px-6 py-3.5 btn-brand-primary text-sm font-bold tracking-widest flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 -mt-0.5" />
              <span>ADD TRANSACTION</span>
            </button>
          </div>
        </div>

        {loading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Loading Financial Records...</span>
          </div>
        ) : (
          <>
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Card 1: Balance */}
              <div className="bg-[#111111] border border-[#222222] p-8 rounded-none relative group hover-apple-grow">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Balance 💳</span>
                  <DollarSign className="w-4 h-4 text-zinc-600" />
                </div>
                <div className={`text-4xl font-display font-black tracking-tight text-white ${totalBalance < 0 ? 'text-red-500' : ''}`}>
                  {totalBalance < 0 ? '-' : ''}₹{Math.abs(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-zinc-600">Net Accumulated Savings</div>
              </div>

              {/* Card 2: Income */}
              <div className="bg-[#111111] border border-[#222222] p-8 rounded-none relative group hover-apple-grow">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Income 📈</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-4xl font-display font-black tracking-tight text-emerald-400">
                  ₹{totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-zinc-600">Earnings & Inflows</div>
              </div>

              {/* Card 3: Expense */}
              <div className="bg-[#111111] border border-[#222222] p-8 rounded-none relative group hover-apple-grow">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Expenses 📉</span>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-4xl font-display font-black tracking-tight text-red-500">
                  ₹{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-zinc-600">Outflows & Spending</div>
              </div>
            </div>

            {/* Analytics Section */}
            <Analytics transactions={transactions} />

            {/* Transaction History Section */}
            <div className="bg-[#111111] border border-[#222222] p-8 rounded-none">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white">Transaction Log 📜</h3>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="SEARCH TRANSACTION..."
                      className="pl-10 pr-4 py-2 w-full sm:w-64 brand-input rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white uppercase tracking-wider font-semibold"
                    />
                  </div>

                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 brand-input rounded-none text-xs text-zinc-355 focus:outline-none cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <option value="all">ALL TYPES</option>
                    <option value="income">INCOME</option>
                    <option value="expense">EXPENSE</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 brand-input rounded-none text-xs text-zinc-355 focus:outline-none cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <option value="all">ALL CATEGORIES</option>
                    <option value="Food">FOOD</option>
                    <option value="Travel">TRAVEL</option>
                    <option value="Shopping">SHOPPING</option>
                    <option value="Bills">BILLS</option>
                    <option value="Health">HEALTH</option>
                    <option value="Salary">SALARY</option>
                    <option value="Others">OTHERS</option>
                  </select>
                </div>
              </div>

              {/* Table / List */}
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                  No records matching search criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#222222] text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        <th className="pb-4 pl-4">Title</th>
                        <th className="pb-4">Category</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4 text-right">Amount</th>
                        <th className="pb-4 pr-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1c1c]">
                      {filteredTransactions.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-[#151515] text-zinc-300 text-xs tracking-wider transition-colors duration-200"
                        >
                          <td className="py-5 pl-4 font-bold text-white uppercase">
                            <div>
                              <div>{t.title}</div>
                              {t.description && (
                                <div className="text-[10px] text-zinc-500 mt-1 font-normal lowercase">
                                  {t.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-zinc-300 border border-[#222222] font-bold text-[10px] uppercase">
                              <span className="text-sm mr-0.5">{CATEGORIES[t.category] || '🏷️'}</span>
                              {t.category}
                            </span>
                          </td>
                          <td className="py-5 text-zinc-400">
                            <span className="flex items-center gap-2 font-semibold text-[11px] uppercase">
                              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                              {new Date(t.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className={`py-5 text-right font-bold text-sm ${t.type === 'income' ? 'text-emerald-450' : 'text-red-500'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                          </td>
                          <td className="py-5 text-center pr-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(t)}
                                className="p-2 text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(t._id)}
                                className="p-2 text-zinc-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Transaction Modal (Add/Edit) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default Dashboard;
