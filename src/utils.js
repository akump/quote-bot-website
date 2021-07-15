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

const isValidDate = function (d) {
    return d instanceof Date && !isNaN(d);
};

const callQuoteApi = async function (queryName, searchQuery) {
    if (!queryName && !searchQuery) {
        const getQuotesRes = await fetch(
            `https://quote-test-app.herokuapp.com/quotes?$`
        );
        const json = await getQuotesRes.json();
        return json.results;
    } else if (queryName && searchQuery) {
        const getQuotesRes = await fetch(
            `https://quote-test-app.herokuapp.com/quotes?${queryName}=${searchQuery}`
        );
        const json = await getQuotesRes.json();
        return json.results;
    } else {
        throw new Error("queryName and searchQuery must be passed or not passed at all");
    }
}

export {
    sleep,
    capitalize,
    monthNames,
    getDateFromText,
    handleRadio,
    isValidDate,
    callQuoteApi
};