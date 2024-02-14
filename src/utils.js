import poems from "../backup/poems-1-17-2022";
import quotes from "./quotes";

const re = /%CC%/g;
const hasZalgo = (txt) => re.test(encodeURIComponent(txt));

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

const isValidDate = (date) => date instanceof Date && !isNaN(date);

const callQuoteApi = async function (queryName, searchQuery = "") {
  let res = quotes;
  if (queryName === "name") {
    let queriedQuotes = [];
    for (const quote of quotes) {
      if (quote.user.toUpperCase().includes(searchQuery.toUpperCase())) {
        queriedQuotes.push(quote);
      }
    }
    res = queriedQuotes;
  } else if (queryName === "quote") {
    let queriedQuotes = [];
    for (const quote of quotes) {
      let strippedQuote = quote.quote.split("~")[0].toUpperCase();
      if (strippedQuote.includes(searchQuery.toUpperCase())) {
        queriedQuotes.push(quote);
      }
    }
    res = queriedQuotes;
  }
  // Fix zalgo attack
  for (let entry of res) {
    if (hasZalgo(entry.quote)) {
      entry.quote = "";
    }
  }
  return res || [];
};

const callPoemApi = async function () {
  try {
    const getPoemsRes = await fetch("https://api.memecenter.org/poems");
    const json = await getPoemsRes.json();
    return {
      poems: json,
      sass: false,
    };
  } catch {
    return {
      poems: poems,
      sass: true,
    };
  }
};

const getQuoteBetweenDates = function (quote, startDate, endDate) {
  const { timestamp } = quote;
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
  hasZalgo,
};
