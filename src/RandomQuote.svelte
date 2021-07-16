<script>
    import { fade } from "svelte/transition";
    import { callQuoteApi } from "./utils.js";

    const getRandomQuote = async function () {
        let allQuotes;
        let cachedQuotes = localStorage.getItem("quotes");
        if (!cachedQuotes) {
            allQuotes = await callQuoteApi();
            const stringifiedQuotes = JSON.stringify(allQuotes, null, 2);
            localStorage.setItem("quotes", stringifiedQuotes);
        } else {
            const objQuotes = JSON.parse(cachedQuotes, null, 2);
            allQuotes = objQuotes;
        }
        const randomQuote =
            allQuotes[Math.floor(Math.random() * allQuotes.length - 1)];
        return randomQuote;
    };
</script>

{#await getRandomQuote()}
    <p>&nbsp</p>
{:then quoteEntry}
    <p transition:fade>
        {quoteEntry.quote}
    </p>
{/await}
