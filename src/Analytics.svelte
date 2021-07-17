<script>
  import { onMount } from "svelte";
  import { callQuoteApi, sleep } from "./utils.js";
  import Spinner from "./Spinner.svelte";

  let loading = true;
  let sortedQuotes;
  let reverseOrder;

  onMount(async () => {
    const allQuotes = await callQuoteApi();
    const quoteStats = allQuotes.reduce(function (quoteeCount, currentValue) {
      if (quoteeCount[currentValue.user]) {
        quoteeCount[currentValue.user]++;
      } else {
        quoteeCount[currentValue.user] = 1;
      }
      return quoteeCount;
    }, {});

    sortedQuotes = Object.fromEntries(
      Object.entries(quoteStats).sort(([, a], [, b]) => a - b)
    );

    reverseOrder = Object.keys(sortedQuotes).reverse();
    await sleep(500);
    loading = false;
  });
</script>

<h4 class="analytics-header">Quote count</h4>
{#if reverseOrder}
  <ul>
    {#each reverseOrder as entry}
      <li>
        <div class="analytics-entry">
          {entry}: {sortedQuotes[entry]}
        </div>
      </li>
    {/each}
  </ul>
{:else if loading}
  <Spinner />
{/if}

<style>
  .analytics-header {
    margin: 5px 5px 5px 0;
  }

  .analytics-entry {
    margin: 3px 3px 3px 0;
  }
</style>
