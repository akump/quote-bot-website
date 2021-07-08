import quotes from "./quotes-6-15.js"

const quoteStats = quotes.reduce(function (quoteeCount, currentValue) {
    if (quoteeCount[currentValue.user]) {
        quoteeCount[currentValue.user]++;
    } else {
        quoteeCount[currentValue.user] = 1;
    }
    return quoteeCount;
}, {});

const sortedEntries = Object.fromEntries(Object.entries(quoteStats).sort(([, a], [, b]) => a - b));

const reverseOrder = Object.keys(sortedEntries).reverse();

reverseOrder.forEach(entry => console.log(`${entry}: ${sortedEntries[entry]}`));