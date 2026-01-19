// scripts/charts.js
class ChartRenderer {
    static COLORS = ["#2563eb", "#22c55e", "#facc15", "#ef4444", "#8b5cf6"];
    
    static createStackedBarChart(config, containerId) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const data = window.ReportData.sampleData;
        
        // Prepare data for stacked bar chart
        const labels = data.map(item => item.Month);
        const datasets = config.options.yKeys.map((key, index) => ({
            label: key,
            data: data.map(item => item[key]),
            backgroundColor: this.COLORS[index % this.COLORS.length],
            borderColor: this.COLORS[index % this.COLORS.length],
            borderWidth: 1
        }));
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }
    
    static createPieChart(config, containerId) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const data = window.ReportData.sampleData;
        const row = data[config.options.monthIndex];
        
        const chartData = config.options.keys.map(key => ({
            label: key,
            value: row[key]
        }));
        
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.map(item => item.label),
                datasets: [{
                    data: chartData.map(item => item.value),
                    backgroundColor: this.COLORS,
                    borderColor: this.COLORS,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    static createBubbleChart(config, containerId) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const data = window.ReportData.sampleData;
        
        const bubbleData = data.map(item => ({
            x: item[config.options.xKey],
            y: item[config.options.yKey],
            r: Math.floor(Math.sqrt(item[config.options.zKey]) * 2), // Scale bubble size
            month: item.Month
        }));
        
        return new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Monthly Sales',
                    data: bubbleData,
                    backgroundColor: this.COLORS[0] + '80', // Add transparency
                    borderColor: this.COLORS[0],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: config.options.xKey
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: config.options.yKey
                        },
                        grid: {
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const data = context.raw;
                                return [
                                    `Month: ${data.month}`,
                                    `${config.options.xKey}: ${data.x}`,
                                    `${config.options.yKey}: ${data.y}`,
                                    `${config.options.zKey}: ${Math.pow(data.r / 2, 2)}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }
    
    static renderChart(config, containerId) {
        if (!config || !containerId) return null;
        
        switch (config.type) {
            case 'stackbar':
                return this.createStackedBarChart(config, containerId);
            case 'pie':
                return this.createPieChart(config, containerId);
            case 'bubble':
                return this.createBubbleChart(config, containerId);
            default:
                return null;
        }
    }
}

window.ChartRenderer = ChartRenderer;