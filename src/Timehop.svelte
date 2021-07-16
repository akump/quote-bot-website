<script>
    import { callQuoteApi, getQuoteBetweenDates } from "./utils.js";
    import { onMount } from "svelte";

    let oneYearOldQuotes = [];
    let twoYearOldQuotes = [];

    const getQuotesFromYearsAgo = async function (year = "2019") {
        let cachedQuotes = localStorage.getItem("quotes");
        let foundQuotes;
        if (!cachedQuotes) {
            foundQuotes = await callQuoteApi();
            const stringifiedQuotes = JSON.stringify(allQuotes, null, 2);
            localStorage.setItem("quotes", stringifiedQuotes);
        } else {
            const objQuotes = JSON.parse(cachedQuotes, null, 2);
            foundQuotes = objQuotes;
        }
        const now = new Date();
        const startDate = new Date(year, now.getMonth(), now.getDate());
        const endDate = new Date(year, now.getMonth(), now.getDate());
        endDate.setUTCHours(23, 59, 59, 999);
        return foundQuotes.filter((entry) =>
            getQuoteBetweenDates(entry, startDate, endDate)
        );
    };

    onMount(async () => {
        oneYearOldQuotes = await getQuotesFromYearsAgo("2020");
        twoYearOldQuotes = await getQuotesFromYearsAgo("2019");
    });
</script>

<h4 class="found-header">1 year ago today</h4>
{#if oneYearOldQuotes.length === 0}
    <p>No quotes found</p>
{:else if oneYearOldQuotes.length > 0}
    <ol>
        {#each oneYearOldQuotes as entry}
            <li>
                <div class="quote-container">
                    <p class="quote-text">{entry.quote}</p>
                </div>
            </li>
        {/each}
    </ol>
{:else}
    <h4>Error finding quotes</h4>
{/if}

<br />

<h4 class="found-header">2 years ago today</h4>
{#if twoYearOldQuotes.length === 0}
    <p>No quotes found</p>
{:else if twoYearOldQuotes.length > 0}
    <ol>
        {#each twoYearOldQuotes as entry}
            <li>
                <div class="quote-container">
                    <p class="quote-text">{entry.quote}</p>
                </div>
            </li>
        {/each}
    </ol>
{:else}
    <h4>Error finding quotes</h4>
{/if}
