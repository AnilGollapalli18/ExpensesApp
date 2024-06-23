import React, { useState } from 'react';

const Expenses = () => {
    const [expenses,setExpenses] = useState([])
    const [description,setDescription] = useState('')
    const [amount,setAmount] = useState('')
    const [totalamount] = useState(50000)
    const [availablebalance,setAvailabelbalance] = useState(50000)
    const [error, setError] = useState('')

    const addExpense = (e) => {
        e.preventDefault();
        if(!description || !amount){
            setError('Description and amount are required.')
            return;
        }

        const expenseAmount = parseFloat(amount);
        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        if (expenseAmount > availablebalance) {
            setError('You do not have enough balance.');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount: expenseAmount,
        }
    setExpenses([...expenses, expense]);
    setAvailabelbalance(prevBalance => Math.max(0, prevBalance - expense.amount));
    setDescription('')
    setAmount('')
    setError('')
    }

    const removeExpense = (id) => {
        const expenseToRemove = expenses.find(expense => expense.id === id);
        if (!expenseToRemove) return;
        const newAvailableBalance = availablebalance + expenseToRemove.amount
        setExpenses(expenses.filter(expense => expense.id !== id));
        setAvailabelbalance(Math.min(totalamount, newAvailableBalance));
    }
    const calculateTotalSpent = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    const totalSpent = calculateTotalSpent();
    return (
        <div className='expense-c'>
        <div className='expense-container'> 
            <h1 style={{color:'black'}}>Expense Tracker</h1>
            <div className='expense-tracker'>
                <div className='balance'>
                    <h2>Total Amount : RS  {totalamount.toFixed(2)}</h2>
                    <h2>Available Balance : RS  {totalSpent >= totalamount ? 0 : availablebalance.toFixed(2)} </h2>
                    <h2>Total Spent : RS {totalSpent.toFixed(2)}</h2>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={addExpense}>
                    <div>
                        <label>Description  </label>
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

                <div className='expense-list'>
                    <h2>Expenses</h2>
                    {expenses.length === 0 ? (
                        <p>No Expenses added yet.</p>
                    ):(
                      <ul>
                        {expenses.map((expense) => {
                            return(
                            <li key={expense.id}>
                                <span>{expense.description}  </span>
                                <span>RS  {expense.amount.toFixed(2)}</span>
                                <button onClick={()=> removeExpense(expense.id)}>Remove</button>
                            </li>
                            )
                        })}
                      </ul>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Expenses;          

