let transactions = [];
        let filteredTransactions = [];

        // Set tanggal hari ini sebagai default
        document.getElementById('transactionDate').valueAsDate = new Date();

        // Fungsi untuk menghitung keuntungan
        function calculateProfit(amount, type) {
            if (type === 'pulsa') {
                if (amount >= 5000 && amount <= 50000) {
                    return 1500;
                }
                return 0;
            } else {
                if (amount >= 10000 && amount <= 79000) {
                    return 3000;
                } else if (amount >= 80000 && amount <= 790000) {
                    return 5000;
                } else if (amount >= 790000) {
                    return 10000;
                }
                return 0;
            }
        }

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount);
        }

        // Format date
        function formatDate(dateString) {
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        }

        // Tambah transaksi
        document.getElementById('transactionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('transactionDate').value;
            const type = document.getElementById('transactionType').value;
            const amount = parseInt(document.getElementById('transactionAmount').value);
            
            if (!date || !type || !amount) {
                alert('Mohon lengkapi semua field!');
                return;
            }

            const transaction = {
                id: Date.now(),
                date: date,
                type: type,
                amount: amount,
                profit: calculateProfit(amount, type)
            };

            transactions.push(transaction);
            
            // Reset form
            document.getElementById('transactionForm').reset();
            document.getElementById('transactionDate').valueAsDate = new Date();
            
            // Update display
            applyFilters();
        });

        // Render tabel
        function renderTable() {
            const tbody = document.getElementById('transactionTableBody');
            
            if (filteredTransactions.length === 0) {
                tbody.innerHTML = '<tr id="emptyRow"><td colspan="6" class="px-6 py-8 text-center text-gray-500">Tidak ada transaksi yang sesuai filter</td></tr>';
                return;
            }

            tbody.innerHTML = filteredTransactions.map((transaction, index) => `
                <tr class="hover:shadow-md hover:bg-white/90 transition-all duration-200">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(transaction.date)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">${transaction.type}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${formatCurrency(transaction.amount)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">${formatCurrency(transaction.profit)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <button onclick="deleteTransaction(${transaction.id})" class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition duration-200">
                            Hapus
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Update summary
        function updateSummary() {
            const totalProfit = filteredTransactions.reduce((sum, transaction) => sum + transaction.profit, 0);
            document.getElementById('totalProfit').textContent = formatCurrency(totalProfit);
        }

        // Apply filters
        function applyFilters() {
            const startDate = document.getElementById('filterStartDate').value;
            const endDate = document.getElementById('filterEndDate').value;
            const filterType = document.getElementById('filterType').value;

            filteredTransactions = transactions.filter(transaction => {
                let matchDate = true;
                let matchType = true;

                if (startDate) {
                    matchDate = matchDate && transaction.date >= startDate;
                }
                
                if (endDate) {
                    matchDate = matchDate && transaction.date <= endDate;
                }

                if (filterType) {
                    matchType = transaction.type === filterType;
                }

                return matchDate && matchType;
            });

            // Sort by date desc
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

            renderTable();
            updateSummary();
        }

        // Clear filters
        function clearFilters() {
            document.getElementById('filterStartDate').value = '';
            document.getElementById('filterEndDate').value = '';
            document.getElementById('filterType').value = '';
            applyFilters();
        }

        // Delete transaction
        function deleteTransaction(id) {
            if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                transactions = transactions.filter(transaction => transaction.id !== id);
                applyFilters();
            }
        }

        // Initialize
        applyFilters();