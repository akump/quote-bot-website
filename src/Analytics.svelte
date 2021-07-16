<script>
    import { onMount } from "svelte";

    let sortedQuotes;
    let reverseOrder = [];

    onMount(async () => {
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

        const quoteStats = allQuotes.reduce(function (
            quoteeCount,
            currentValue
        ) {
            if (quoteeCount[currentValue.user]) {
                quoteeCount[currentValue.user]++;
            } else {
                quoteeCount[currentValue.user] = 1;
            }
            return quoteeCount;
        },
        {});

        sortedQuotes = Object.fromEntries(
            Object.entries(quoteStats).sort(([, a], [, b]) => a - b)
        );

        reverseOrder = Object.keys(sortedQuotes).reverse();
    });
</script>

<h4 class="analytics-header">Quote count</h4>
<ul>
    {#each reverseOrder as entry}
        <li>
            <div class="analytics-entry">{entry}: {sortedQuotes[entry]}</div>
        </li>
    {/each}
</ul>

<style>
    .analytics-header {
        margin: 5px 5px 5px 0;
    }

    .analytics-entry {
        margin: 3px 3px 3px 0;
    }
</style>
