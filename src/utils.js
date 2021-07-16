const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const getDateFromText = function (date) {
    const parsedDate = new Date(date);
    const month = parseInt(parsedDate.getUTCMonth()) + 1;
    const day = parsedDate.getUTCDate();
    const year = parsedDate.getUTCFullYear();
    return `${month}/${day}/${year}`;
};

const handleRadio = function (e) {
    localStorage.setItem("radioSelection", e.target.defaultValue);
};

const isValidDate = date => date instanceof Date && !isNaN(date);

const callQuoteApi = async function (queryName, searchQuery = '') {
    let url = `https://quote-test-app.herokuapp.com/quotes?`;
    if (queryName) {
        url = `https://quote-test-app.herokuapp.com/quotes?${queryName}=${searchQuery}`;
    }
    const getQuotesRes = await fetch(url);
    const json = await getQuotesRes.json();
    return json.results;
};

const getQuoteBetweenDates = function (quote, startDate, endDate) {
    const {
        timestamp
    } = quote;
    const currQuoteDate = new Date(timestamp);
    if (currQuoteDate > startDate && currQuoteDate < endDate) {
        return quote;
    }
};

export {
    sleep,
    capitalize,
    monthNames,
    getDateFromText,
    handleRadio,
    isValidDate,
    callQuoteApi,
    getQuoteBetweenDates
};