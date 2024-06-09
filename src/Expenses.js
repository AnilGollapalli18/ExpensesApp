import React, { useState } from 'react';

const Expenses = () => {
    const [expenses,setExpenses] = useState([])
    const [description,setDescription] = useState('')
    const [amount,setAmount] = useState('')
    const [totalamount] = useState(50000)
    const [availablebalance,setAvailabelbalance] = useState(50000)

    const addExpense = (e) => {
        e.preventDefault();
        if(!description || !amount) return;

        const expense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
        }
    
    setExpenses([...expenses, expense]);
    setAvailabelbalance(availablebalance - expense.amount);
    setDescription('')
    setAmount('')
    }

    const removeExpense = (id) => {
        const expenseToRemove = expenses.find(expense => expense.id === id);
        setExpenses(expenses.filter(expense => expense.id !== id))
        return expenseToRemove
    }
    return (
        <div className='expense-container'> 
            <h1>Expense Tracker</h1>
            <div className='expense-tracker'>
                <div className='balance'>
                    <h2>Total Amount : RS - {totalamount.toFixed(2)}</h2>
                    <h2>Available Balance : RS - {availablebalance.toFixed(2)} </h2>
                </div>
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
    );
};

export default Expenses;          

