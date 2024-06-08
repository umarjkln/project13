async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
}

async function initializeCharts() {
    try {
        const [segmentData, consumerData, corporateData, homeOfficeData, categoryData, technologyData, officeSuppliesData, furnitureData, regionData, profitByYearData] = await Promise.all([
            fetchData('profit_json/ProfitSegment.json'),
            fetchData('profit_json/ConsumerProfit.json'),
            fetchData('profit_json/CorporateProfit.json'),
            fetchData('profit_json/HomeOfficeProfit.json'),
            fetchData('profit_json/CategoryProfit.json'),
            fetchData('profit_json/TechnologyProfit.json'),
            fetchData('profit_json/OfficeSuppliesProfit.json'),
            fetchData('profit_json/FurnitureProfit.json'),
            fetchData('profit_json/RegionProfit.json'),
            fetchData('profit_json/ProfitByYear.json')
        ]);

        const ctx1 = document.getElementById('segment').getContext('2d');
        const ctx2 = document.getElementById('category').getContext('2d');
        const ctx3 = document.getElementById('region').getContext('2d');
        const ctx4 = document.getElementById('profitByYearChart').getContext('2d');

        let profitChart1 = new Chart(ctx1, {
            type: 'doughnut',
            data: getChartData(segmentData),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                },
                layout: {
                    padding: {
                        top: 20 // Adjust this value to increase/decrease space between chart and legend
                    }
                }
            }
        });

        let profitChart2 = new Chart(ctx2, {
            type: 'doughnut',
            data: getChartData(categoryData),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                },
                layout: {
                    padding: {
                        top: 20 
                    }
                }
            }
        });

        let regionProfitChart = new Chart(ctx3, {
            type: 'bar',
            data: getBarChartData(regionData),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Profit'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Region'
                        }
                    }
                }
            }
        });

        let profitByYearChart = new Chart(ctx4, {
            type: 'bar',
            data: getBarChartYearData(profitByYearData),
            responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Profit'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
        })


        document.getElementById('profit-gd-1').addEventListener('change', function () {
            const selectedOption = this.value;
            let data;

            if (selectedOption === 'segment_profit') {
                data = segmentData;
            } else if (selectedOption === 'consumer_profit') {
                data = consumerData;
            } else if (selectedOption === 'corporate_profit') {
                data = corporateData;
            } else if (selectedOption === 'ho_profit') {
                data = homeOfficeData;
            }

            if (data) {
                updateChart(profitChart1, data);
            }
        });

        document.getElementById('profit-gd-2').addEventListener('change', function () {
            const selectedOption = this.value;
            let data;

            if (selectedOption === 'category_profit') {
                data = categoryData;
            } else if (selectedOption === 'technology_profit') {
                data = technologyData;
            } else if (selectedOption === 'OS_profit') {
                data = officeSuppliesData;
            } else if (selectedOption === 'furniture_profit') {
                data = furnitureData;
            }

            if (data) {
                updateChart(profitChart2, data);
            }
        });

    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function getChartData(data) {
    return {
        labels: data.map(item => item.Segment || item.Product_Name || item.Category),
        datasets: [{
            data: data.map(item => parseFloat(item.Total_Profit.replace(',', ''))),
            backgroundColor: [
                'rgba(0, 51, 102, 0.8)',
                'rgba(51, 153, 255, 0.8)',
                'rgba(102, 204, 255, 0.8)'
            ],
            borderWidth: 1
        }]
    };
}

function getBarChartData(data) {
    let sortedData = data.sort((a, b) => parseFloat(b.Total_Profit) - parseFloat(a.Total_Profit));
    let backgroundColors = sortedData.map((item, index) => index === 0 ? 'rgba(0, 51, 102, 0.8)' : 'rgba(51, 153, 255, 0.8)');
    
    return {
        labels: sortedData.map(item => item.Region),
        datasets: [{
            label: 'Profit',
            data: sortedData.map(item => parseFloat(item.Total_Profit)),
            backgroundColor: backgroundColors,
            borderWidth: 1
        }]
    };
}

function getBarChartYearData(data) {
    let sortedData = data.sort((a, b) => parseFloat(b.total_profit) - parseFloat(a.total_profit));
    let backgroundColors = sortedData.map((item, index) => index === 0 ? 'rgba(51, 153, 255, 0.8)' : 'rgba(51, 153, 255, 0.8)');
    
    return {
        labels: sortedData.map(item => item.year),
        datasets: [{
            label: 'Profit',
            data: sortedData.map(item => parseFloat(item.total_profit)),
            backgroundColor: backgroundColors,
            borderWidth: 1
        }]
    };
}

function updateChart(chart, data) {
    chart.data = getChartData(data);
    chart.update();
}

// Initialize the charts when the page loads
initializeCharts();
