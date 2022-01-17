<script>
  import { onMount } from "svelte";
  import { callPoemApi, sleep } from "./utils.js";
  import Spinner from "./Spinner.svelte";

  let loading = true;
  let poems;
  let sass;

  onMount(async () => {
    try {
      const res = await callPoemApi();
      poems = res.poems;
      sass = res.sass;
      poems = poems.map((poem) => {
        const ret = poem;
        if (ret.text.includes("Roses are red")) {
          ret.text = ret.text.replace(/(?:\r\n|\r|\n)/g, ", ");
        }
        return ret;
      });
      poems = poems.reverse();
    } catch {
      poems = [{ text: "Mike's api broke oopsie woopsies" }];
    }
    loading = false;
  });
</script>

<h4 class="header">All poems</h4>
{#if poems}
  <p>Using old results cuz mike's api broke</p>
{/if}
{#if poems}
  <ol>
    {#each poems as poem}
      <li>
        <p class="poem">
          {poem.favorited ? "★" : ""}
          {poem.text}
        </p>
      </li>
    {/each}
  </ol>
{:else if loading}
  <Spinner />
{/if}

<style>
  .header {
    margin: 5px 5px 5px 0;
  }

  .poem {
    margin: 3px 3px 3px 0;
  }
</style>
