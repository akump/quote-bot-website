<script>
    import {
        getDateFromText,
        isValidDate,
        getQuoteBetweenDates,
        callQuoteApi,
    } from "./utils";
    import { Circle } from "svelte-loading-spinners";

    let startDateInput = "7/1/2019";
    let endDateInput = "12/31/2021";
    let loading = false;
    let quotesInTimeframe;

    const dateSearch = async function () {
        loading = true;
        quotesInTimeframe = null;
        let [startMonth, startDay, startYear] = startDateInput.split("/");
        let [endMonth, endDay, endYear] = endDateInput.split("/");

        if (startDateInput === "") {
            startMonth = "7";
            startDay = "1";
            startYear = "2019";
        }
        if (endDateInput === "") {
            endMonth = "12";
            endDay = "31";
            endYear = "2022";
        }

        const startDate = new Date(
            startYear,
            parseInt(startMonth) - 1,
            startDay
        );
        const endDate = new Date(
            endYear,
            parseInt(endMonth) - 1,
            parseInt(endDay)
        );
        endDate.setUTCHours(23, 59, 59, 999);

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            loading = false;
            quotesInTimeframe = [];
            return;
        }
        const allQuotes = await callQuoteApi();
        quotesInTimeframe = allQuotes.filter((entry) =>
            getQuoteBetweenDates(entry, startDate, endDate)
        );
        loading = false;
    };
</script>

<h4>Dates should be formatted month/day/year</h4>
<form class="date-form" on:submit|preventDefault={dateSearch}>
    <label class="date-label"
        >Start date <input
            style="width: 150px"
            type="text"
            id="startDateInput"
            name="startDateInput"
            bind:value={startDateInput}
        />
    </label>
    <label class="date-label"
        >End date <input
            style="width: 150px"
            type="text"
            id="endDateInput"
            name="endDateInput"
            bind:value={endDateInput}
        />
    </label>
    <button class="date-search-button wide-go" type="submit"> Go </button>
</form>

{#if quotesInTimeframe}
    {#if quotesInTimeframe.length === 0}
        <h4 class="found-header">
            No quotes found. Are your dates formatted correctly?
        </h4>
    {:else if quotesInTimeframe.length === 1}
        <h4 class="found-header">Found 1 quote</h4>
    {:else if quotesInTimeframe.length > 0}
        <h4 class="found-header">
            Found {quotesInTimeframe.length} quotes
        </h4>
    {:else}
        <h4>Error finding quotes</h4>
    {/if}
    <ol>
        {#each quotesInTimeframe as entry}
            <li>
                <div class="quote-container">
                    <p class="quote-text">{entry.quote}</p>
                    <p class="quote-date">
                        {getDateFromText(entry.timestamp)}
                    </p>
                </div>
            </li>
        {/each}
    </ol>
{:else if loading}
    <Circle size="30" color="#b10bb1" unit="px" duration="1s" />
{/if}

<style>
    .date-label {
        flex-basis: 150px;
        margin-right: 5px;
    }
    .date-form {
        display: flex;
        flex-wrap: wrap;
    }

    .date-search-button {
        height: 33px;
        align-self: flex-end;
    }
</style>
