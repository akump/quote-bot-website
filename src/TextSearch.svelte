<svelte:options immutable={false} accessors={true} />

<script>
    import Spinner from "./Spinner.svelte";
    import Toggle from "svelte-toggle";
    import { onMount } from "svelte";
    import {
        sleep,
        capitalize,
        getDateFromText,
        handleRadio,
        callQuoteApi,
    } from "./utils.js";

    let toggleElement;
    let dateToggle;
    let selected;
    let input = "";
    let allUsersQuotes;
    let loading = false;
    let searchQuery = "";

    const options = ["name", "quote"];
    const radioSelection = localStorage.getItem("radioSelection");

    if (!radioSelection) {
        localStorage.setItem("radioSelection", "name");
        selected = "name";
    } else {
        selected = radioSelection;
    }

    const findQuotes = async function () {
        loading = true;
        allUsersQuotes = null;
        searchQuery = input;
        try {
            let queryName = selected;
            allUsersQuotes = await callQuoteApi(queryName, searchQuery);
            await sleep(500);
        } catch {
            allUsersQuotes = [];
        }
        loading = false;
    };

    const isTrue = (val) => val === "true";

    const setToggleLocalStorage = function (e) {
        const toggleValue = localStorage.getItem("dateToggle");
        localStorage.setItem("dateToggle", !isTrue(toggleValue));
        dateToggle = !isTrue(toggleValue);
    };

    onMount(() => {
        dateToggle = localStorage.getItem("dateToggle");
        if (dateToggle === null) {
            localStorage.setItem("dateToggle", false);
            dateToggle = false;
        }
        if (typeof dateToggle !== "boolean") {
            dateToggle = isTrue(dateToggle);
        }
        toggleElement.$set({ toggled: dateToggle });
    });
</script>

<div class="options-container">
    <div class="option-type">
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
    <div class="option-date">
        <div class="label">Show date</div>
        <Toggle
            bind:dateToggle
            on:click={setToggleLocalStorage}
            bind:this={toggleElement}
            hideLabel
            toggledColor="#b10bb1"
            label="Show date added?"
        />
    </div>
</div>
<form on:submit|preventDefault={findQuotes}>
    <label for="imageNum"
        >Find quotes: <input
            style="width: 150px"
            type="text"
            id="input"
            name="input"
            bind:value={input}
        />
        <button class="wide-go" type="submit"> Go </button>
    </label>
</form>

{#if allUsersQuotes}
    {#if allUsersQuotes.length === 0}
        <h4 class="found-header">No quotes found</h4>
    {:else if allUsersQuotes.length === 1}
        <h4 class="found-header">
            Found 1 quote for "{searchQuery}"
        </h4>
    {:else if allUsersQuotes.length > 0}
        <h4 class="found-header">
            Found {allUsersQuotes.length} quotes for "{searchQuery}"
        </h4>
    {:else}
        <h4>Error finding quotes</h4>
    {/if}
    <ol>
        {#each allUsersQuotes as entry}
            <li>
                {#if dateToggle}
                    <div class="quote-container">
                        <p class="quote-text">{entry.quote}</p>
                        <p class="quote-date">
                            {getDateFromText(entry.timestamp)}
                        </p>
                    </div>
                {:else}
                    <div class="quote-no-date">
                        <p class="quote-text">{entry.quote}</p>
                    </div>
                {/if}
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
        margin-bottom: 5px;
        padding-bottom: 5px;
        /* border-bottom: 1px solid rgba(255, 255, 255, 0.25); */
    }
    .option-type {
        flex: 0 0 auto;
        margin-right: 1rem;
        padding-right: 1rem;

        border-right: 1px solid rgba(255, 255, 255, 0.25);
    }
    .option-date {
        flex: 1;
    }
</style>
