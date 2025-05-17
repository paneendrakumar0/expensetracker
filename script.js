const balanceEl = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const categoryEl = document.getElementById('category');
const addTransactionBtn = document.getElementById('add-transaction');
const chartCanvas = document.getElementById('expense-chart');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update LocalStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update the chart
let chart;
function updateChart() {
    const expenseCategories = ['food', 'transport', 'shopping', 'others'];
    const categoryTotals = expenseCategories.map(category => 
        transactions
            .filter(transaction => transaction.category === category)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    );

    if (chart) chart.destroy();
    chart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: expenseCategories,
            datasets: [
                {
                    data: categoryTotals,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0'],
                },
            ],
        },
        options: {
            responsive: true,
        },
    });
}

// Update balance and list
function updateUI() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceEl.textContent = `$${balance.toFixed(2)}`;

    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const transactionEl = document.createElement('li');
        transactionEl.classList.add(transaction.amount > 0 ? 'income' : 'expense');
        transactionEl.innerHTML = `
            ${transaction.description} <span>${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
        `;
        transactionList.appendChild(transactionEl);
    });

    updateChart();
}

// Add new transaction
function addTransaction() {
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value.trim());
    const category = categoryEl.value;

    if (!description || isNaN(amount)) {
        alert('Please fill out all fields.');
        return;
    }

    const newTransaction = {
        description,
        amount,
        category,
    };

    transactions.push(newTransaction);
    updateLocalStorage();
    updateUI();

    descriptionEl.value = '';
    amountEl.value = '';
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    updateUI();
}

// Initialize app
addTransactionBtn.addEventListener('click', addTransaction);
updateUI();
