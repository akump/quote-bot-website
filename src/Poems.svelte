<script>
  import { onMount } from "svelte";
  import { callPoemApi, sleep } from "./utils.js";
  import Spinner from "./Spinner.svelte";

  let loading = true;
  let poems;

  onMount(async () => {
    try {
      poems = await callPoemApi();
      poems = poems.map((poem) => {
        const ret = poem;
        ret.text = ret.text.replace(/(?:\r\n|\r|\n)/g, ", ");
        return ret;
      });
    } catch {
      poems = [{ text: "Mike's api broke oopsie woopsies" }];
    }
    loading = false;
  });
</script>

<h4 class="header">All poems</h4>
<p>Updated 1/14 cuz Mike's API doesn't work with cors</p>
{#if poems}
  <ul>
    {#each poems as poem}
      <li>
        <p class="poem">
          {poem.favorited ? "★" : ""}
          {poem.text}
        </p>
      </li>
    {/each}
  </ul>
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
