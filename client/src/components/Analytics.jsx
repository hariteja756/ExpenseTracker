import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = {
  Food: '#ffffff',     // White
  Travel: '#e4e4e7',   // Zinc 200
  Shopping: '#a1a1aa', // Zinc 400
  Bills: '#71717a',    // Zinc 500
  Health: '#3f3f46',   // Zinc 700
  Others: '#d4ff00',   // Volt Green
  Salary: '#ccff00',   // Volt Green
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] border border-[#222222] p-4 rounded-none shadow-lg">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">{payload[0].name}</p>
        <p className="text-white text-sm font-display font-black">₹{payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

const Analytics = ({ transactions }) => {
  // 1. Process Bar Chart Data (Monthly Income vs Expense)
  const getMonthlyData = () => {
    const monthlyMap = {};
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedTransactions.forEach((t) => {
      const dateObj = new Date(t.date);
      const monthYear = dateObj.toLocaleString('default', { month: 'short', year: '2-digit' }).toUpperCase();

      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { name: monthYear, Income: 0, Expense: 0 };
      }

      if (t.type === 'income') {
        monthlyMap[monthYear].Income += t.amount;
      } else {
        monthlyMap[monthYear].Expense += t.amount;
      }
    });

    return Object.values(monthlyMap).slice(-6);
  };

  // 2. Process Pie Chart Data (Expenses by Category)
  const getCategoryData = () => {
    const categoryMap = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = { name: t.category, value: 0 };
        }
        categoryMap[t.category].value += t.amount;
      });

    return Object.values(categoryMap);
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const hasExpenses = categoryData.length > 0;
  const hasMonthlyData = monthlyData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Bar Chart */}
      <div className="bg-[#111111] border border-[#222222] p-8 rounded-none relative overflow-hidden">
        <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white mb-6">Monthly Overview 📊</h3>
        {hasMonthlyData ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#222222" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} fontClassName="font-display font-bold" />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#222222',
                    borderRadius: '0px',
                  }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="Income" fill="#ffffff" radius={0} barSize={16} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={0} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-zinc-500 text-xs uppercase tracking-widest font-bold">
            No transaction data available.
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-[#111111] border border-[#222222] p-8 rounded-none relative overflow-hidden">
        <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white mb-6">Expense by Category 🍕</h3>
        {hasExpenses ? (
          <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="h-48 w-48 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#52525b'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">
                  Total Outflow
                </span>
                <span className="text-white text-xl font-display font-black mt-1">
                  ₹
                  {categoryData
                    .reduce((sum, item) => sum + item.value, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-2 w-full sm:w-auto min-w-[160px]">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 shrink-0"
                      style={{ backgroundColor: COLORS[entry.name] || '#52525b' }}
                    ></span>
                    <span className="text-zinc-350">{entry.name}</span>
                  </div>
                  <span className="text-white font-bold">₹{entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-zinc-500 text-xs uppercase tracking-widest font-bold">
            No expenses found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
