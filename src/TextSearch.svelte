<svelte:options immutable={false} accessors={true} />

<script>
  import Spinner from "./Spinner.svelte";
  import Toggle from "svelte-toggle";
  import { onMount } from "svelte";
  import { sleep, capitalize, handleRadio, callQuoteApi } from "./utils.js";

  let dateElement;
  let oldestElement;
  let oldestToggle;
  let selected;
  let searchInput = "";
  let allUsersQuotes;
  let loading = false;
  const options = ["name", "quote"];

  const findQuotes = async function () {
    loading = true;
    allUsersQuotes = null;
    try {
      let queryName = selected;
      allUsersQuotes = await callQuoteApi(queryName, searchInput);
      if (!oldestToggle) {
        allUsersQuotes = allUsersQuotes.reverse();
      }
      await sleep(500);
    } catch {
      allUsersQuotes = [];
    }
    loading = false;
  };

  const isTrue = (val) => val === "true";

  const setOldestleLocalStorage = function () {
    const toggleValue = localStorage.getItem("oldestToggle");
    localStorage.setItem("oldestToggle", !isTrue(toggleValue));
    oldestToggle = !isTrue(toggleValue);
    allUsersQuotes = allUsersQuotes.reverse();
  };

  onMount(() => {
    // Oldest
    oldestToggle = localStorage.getItem("oldestToggle");
    if (oldestToggle === null) {
      localStorage.setItem("oldestToggle", false);
      oldestToggle = false;
    }
    if (typeof oldestToggle !== "boolean") {
      oldestToggle = isTrue(oldestToggle);
    }
    oldestElement.$set({ toggled: oldestToggle });

    // Radio
    const radioSelection = localStorage.getItem("radioSelection");
    if (!radioSelection) {
      localStorage.setItem("radioSelection", "name");
      selected = "name";
    } else {
      selected = radioSelection;
    }
  });
</script>

<div class="options-container">
  <div class="option">
    <div class="label">Search type</div>
    {#each options as value}
      <label
        ><input
          class="radio-button"
          type="radio"
          {value}
          bind:group={selected}
          on:click|once={handleRadio}
        />{capitalize(value)}</label
      >
    {/each}
  </div>
  <div class="option">
    <div class="label">Oldest first</div>
    <Toggle
      bind:oldestToggle
      on:click={setOldestleLocalStorage}
      bind:this={oldestElement}
      hideLabel
      toggledColor="#b10bb1"
    />
  </div>
</div>
<form on:submit|preventDefault={findQuotes}>
  <label for="imageNum"
    >Find quotes: <input
      style="width: 150px"
      type="text"
      id="searchInput"
      name="searchInput"
      bind:value={searchInput}
    />
    <button class="wide-go" type="submit"> Go </button>
  </label>
</form>

{#if allUsersQuotes}
  {#if allUsersQuotes.length === 0}
    <h4 class="found-header">No quotes found</h4>
  {:else if allUsersQuotes.length === 1}
    <h4 class="found-header">
      Found 1 quote for "{searchInput}"
    </h4>
  {:else if allUsersQuotes.length > 0}
    <h4 class="found-header">
      Found {allUsersQuotes.length} quotes for "{searchInput}"
    </h4>
  {:else}
    <h4>Error finding quotes</h4>
  {/if}
  <ol>
    {#each allUsersQuotes as entry}
      <li>
        <div class="quote-no-date">
          <p class="quote-text">{entry.quote}</p>
        </div>
      </li>
    {/each}
  </ol>
{:else if loading}
  <Spinner />
{/if}

<style>
  .label {
    margin-bottom: 5px;
  }

  .radio-button {
    margin-right: 5px;
  }
  .options-container {
    display: flex;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  }
  .option {
    flex: 0 0 auto;
    margin-right: 10px;
    padding-right: 10px;

    border-right: 1px solid rgba(255, 255, 255, 0.25);
  }
  .option-date {
    flex: 1;
  }
</style>
