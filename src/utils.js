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
}

export {
    sleep,
    capitalize,
    monthNames,
    getDateFromText,
    handleRadio,
    isValidDate
};