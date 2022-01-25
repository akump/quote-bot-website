<script>
  import { callQuoteApi, getQuoteBetweenDates } from "./utils.js";
  import Spinner from "./Spinner.svelte";
  import { onMount } from "svelte";

  let oneYearOldQuotes = [];
  let twoYearOldQuotes = [];
  let threeYearOldQuotes = [];
  let allQuotes = null;
  let loading = false;

  const getQuotesFromYearsAgo = async function (year = "2019") {
    const now = new Date();
    let startDate = new Date(year, now.getUTCMonth(), now.getUTCDate());
    startDate.setUTCHours(0, 0, 0, 0);
    let endDate = new Date(year, now.getUTCMonth(), now.getUTCDate());
    endDate.setUTCHours(23, 59, 59, 999);
    return allQuotes.filter((entry) =>
      getQuoteBetweenDates(entry, startDate, endDate)
    );
  };

  onMount(async () => {
    loading = true;
    allQuotes = await callQuoteApi();
    oneYearOldQuotes = await getQuotesFromYearsAgo("2021");
    twoYearOldQuotes = await getQuotesFromYearsAgo("2020");
    threeYearOldQuotes = await getQuotesFromYearsAgo("2019");
    loading = false;
  });
</script>

<h4 class="found-header">1 year ago today</h4>
{#if loading}
  <Spinner />
{:else if oneYearOldQuotes.length === 0}
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
{/if}

<br />

<h4 class="found-header">2 years ago today</h4>
{#if loading}
  <Spinner />
{:else if twoYearOldQuotes.length === 0}
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
{/if}


<br />

<h4 class="found-header">3 years ago today</h4>
{#if loading}
  <Spinner />
{:else if threeYearOldQuotes.length === 0}
  <p>No quotes found</p>
{:else if threeYearOldQuotes.length > 0}
  <ol>
    {#each threeYearOldQuotes as entry}
      <li>
        <div class="quote-container">
          <p class="quote-text">{entry.quote}</p>
        </div>
      </li>
    {/each}
  </ol>
{/if}
