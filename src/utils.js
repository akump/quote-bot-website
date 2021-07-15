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
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month}/${day}/${year}`;
};

const handleRadio = function (e) {
    localStorage.setItem("radioSelection", e.target.defaultValue);
};

export {
    sleep,
    capitalize,
    monthNames,
    getDateFromText,
    handleRadio
};