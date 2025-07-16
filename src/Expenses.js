    
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Expenses = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [totalAmount, setTotalAmount] = useState(50000);
    const [availableBalance, setAvailableBalance] = useState(50000);
    const [error, setError] = useState('');
    const [salaryInput, setSalaryInput] = useState('50000');
    const [viewMode, setViewMode] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(storedExpenses);
    }, []);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
        setAvailableBalance(Math.max(0, totalAmount - totalSpent));
    }, [expenses, totalAmount]);

    const handleSalaryChange = (e) => {
        const input = e.target.value;
        setSalaryInput(input);
        const newTotal = parseFloat(input);
        if (!isNaN(newTotal) && newTotal >= 0) {
            setTotalAmount(newTotal);
            setError('');
        } else {
            setError('Please enter a valid salary amount.');
        }
    };

    const addExpense = (e) => {
        e.preventDefault();
        if (!description || !amount) {
            setError('Description and amount are required.');
            return;
        }

        const expenseAmount = parseFloat(amount);
        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        if (expenseAmount > availableBalance) {
            setError('You do not have enough balance.');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount: expenseAmount,
            date: new Date(),
        };

        setExpenses([...expenses, expense]);
        setDescription('');
        setAmount('');
        setError('');
    };

    const removeExpense = (id) => {
        const updatedExpenses = expenses.filter(exp => exp.id !== id);
        setExpenses(updatedExpenses);
    };

    const filteredExpenses = expenses.filter(exp => {
        const date = new Date(exp.date);
        const matchYear = date.getFullYear() === parseInt(selectedYear);
        const matchMonth = date.getMonth() === parseInt(selectedMonth);
        return viewMode === 'yearly' ? matchYear : matchYear && matchMonth;
    });

    const totalSpent = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

    const chartData = filteredExpenses.map(exp => ({ name: exp.description, amount: exp.amount }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF3333'];

    return (
        <div className='expense-c'>
            <div className='expense-container'>
                <h1 style={{ color: 'black' }}>Expense Tracker</h1>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ marginRight: '10px' }}>View Mode :</label>
                    <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    <label style={{ margin: '0 10px' }}>Year :</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {viewMode === 'monthly' && (
                        <>
                            <label style={{ margin: '0 10px' }}>Month :</label>
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {months.map((month, idx) => (
                                    <option key={month} value={idx}>{month}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className='expense-tracker'>
                    <div className='balance'>
                        <div>
                            <label>Total Salary / Budget : </label>
                            <input
                                type="text"
                                value={salaryInput}
                                onChange={handleSalaryChange}
                            />
                        </div>
                        <h2>Total Amount : ₹ {totalAmount.toFixed(2)}</h2>
                        <h2>Available Balance : ₹ {availableBalance.toFixed(2)}</h2>
                        <h2>Total Spent ({viewMode === 'monthly' ? months[selectedMonth] : ''} {selectedYear}) : ₹ {totalSpent.toFixed(2)}</h2>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <form onSubmit={addExpense}>
                        <div>
                            <label>Description </label>
                            <input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Amount </label>
                            <input
                                type='text'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <button type="submit">Add Expense</button>
                    </form>

                    <div className='expense-analytics-wrapper'>
                        <div className='expense-list'>
                            <h2>Expenses</h2>
                            {filteredExpenses.length === 0 ? (
                                <p>No Expenses added yet.</p>
                            ) : (
                                <ul>
                                    {filteredExpenses.map((expense) => (
                                        <li key={expense.id}>
                                            <span>{expense.description}</span>
                                            <span>₹ {expense.amount.toFixed(2)}</span>
                                            <button onClick={() => removeExpense(expense.id)}>Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {filteredExpenses.length > 0 && (
                            <div className='analytics'>
                                <h2>Spending Analytics</h2>

                                <div style={{ width: '100%', height: 250 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="amount" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div style={{ width: '100%', height: 250, marginTop: 30 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="amount"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;