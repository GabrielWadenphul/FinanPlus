Chart.register(ChartDataLabels);

const ctxBarras = document.getElementById('graficoBarras');
new Chart(ctxBarras, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Receitas',
                data: [10000, 11000, 13000, 14000, 15000, 16000],
                backgroundColor: '#1E3A8A'
            },
            {
                label: 'Despesas',
                data: [2500, 5000, 6500, 5500, 4000, 3000],
                backgroundColor: '#B91C1C'
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold'
                },
                formatter: function(value) {
                    return 'R$ ' + value;
                }
            }
        }
    }
});

const ctxPizza = document.getElementById('graficoPizza');
new Chart(ctxPizza, {
    type: 'doughnut',
    data: {
        labels: ['Alimentação', 'Lazer', 'Moradia', 'Transporte'],
        datasets: [{
            data: [800, 300, 2500, 400],
            backgroundColor: [
                '#312E81',
                '#A78BFA',
                '#2563EB',
                '#93C5FD'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold'
                },
                formatter: function(value) {
                    return 'R$ ' + value;
                }
            }
        }
    }
});