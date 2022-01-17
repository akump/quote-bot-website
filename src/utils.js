import poems from '../backup/poems-1-14-2022'

const re = /%CC%/g
const hasZalgo = txt => re.test(encodeURIComponent(txt));

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
    let json = await getQuotesRes.json();
    let res = json.results;
    // Fix zalgo attack
    /*
    for (let entry of res) {
        if (hasZalgo(entry.quote)) {
            entry.quote = "fucc ur zalgo";
        }
    }
    */
    return res;
};

const callPoemApi = async function () {
    try {
        const getPoemsRes = await fetch("http://lootboxsim-env.eba-j5ptekaw.us-east-2.elasticbeanstalk.com/poems");
        const json = await getPoemsRes.json();
        return json.results;
    } catch {
        return poems;
    }
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
    getQuoteBetweenDates,
    callPoemApi,
    hasZalgo
};