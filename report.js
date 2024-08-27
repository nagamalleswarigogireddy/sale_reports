const salesData = require('./sales_data');

var totalSales = 0;
var monthSales = {};
var monthItems = {};
var monthRevenueItems = {};
var monthPopularItems = {};
var monthOrderStats = {};

//function to extract month from date
function getMonth(date) {
    return date.slice(0, 7);
}

salesData.forEach(function(sale) {
    var month = getMonth(sale.Date);
    totalSales += sale.TotalPrice;

    if (!monthSales[month]) {
        monthSales[month] = 0;
        monthItems[month] = {};
        monthRevenueItems[month] = {};
    }

    monthSales[month] += sale.TotalPrice;

    // Track quantities and revenues by item
    if (!monthItems[month][sale.SKU]) {
        monthItems[month][sale.SKU] = 0;
        monthRevenueItems[month][sale.SKU] = 0;
    }
    monthItems[month][sale.SKU] += sale.Quantity;
    monthRevenueItems[month][sale.SKU] += sale.TotalPrice;
});

// most popular item and item generating most revenue per month
for (var month in monthItems) {
    var maxQty = 0;
    var maxRevenue = 0;

    for (var item in monthItems[month]) {
        if (monthItems[month][item] > maxQty) {
            maxQty = monthItems[month][item];
            monthPopularItems[month] = item;
        }
        if (monthRevenueItems[month][item] > maxRevenue) {
            maxRevenue = monthRevenueItems[month][item];
        }
    }
}

// Calculating min, max, and average orders for most popular item each month
for (var month in monthPopularItems) {
    var popularItem = monthPopularItems[month];
    var quantities = salesData
        .filter(sale => getMonth(sale.Date) === month && sale.SKU === popularItem)
        .map(sale => sale.Quantity);

    var min = Math.min(...quantities);
    var max = Math.max(...quantities);
    var avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;

    monthOrderStats[month] = { min: min, max: max, avg: avg };
}

console.log("Total Sales:", totalSales);
console.log("Month Wise Sales Totals:", monthSales);
console.log("Most Popular Item Each Month:", monthPopularItems);
console.log("Most Revenue Generating Items Each Month:", monthRevenueItems);
console.log("Order Stats for Most Popular Item Each Month:", monthOrderStats);