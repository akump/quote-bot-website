<script>
	import { Circle } from "svelte-loading-spinners";
	import { sleep, capitalize } from "./utils.js";
	import { fade } from "svelte/transition";

	let selected;
	const options = ["name - Not case sensitive", "quote - Case sensitive"];
	const radioSelection = localStorage.getItem("radioSelection");

	if (!radioSelection) {
		localStorage.setItem("radioSelection", "name - Not case sensitive");
		selected = "name - Not case sensitive";
	} else {
		selected = radioSelection;
	}

	const handleRadio = function (e) {
		localStorage.setItem("radioSelection", e.target.defaultValue);
	};

	let input = "";
	let allUsersQuotes;
	let loading;
	let searchQuery = "";

	const getRandomQuote = async function () {
		let allQuotes;
		let cachedQuotes = localStorage.getItem("quotes");
		if (!cachedQuotes) {
			const getQuotesRes = await fetch(
				`https://quote-test-app.herokuapp.com/quotes?name=`
			);
			const json = await getQuotesRes.json();
			allQuotes = json.results;
			const stringifiedQuotes = JSON.stringify(allQuotes, null, 2);
			localStorage.setItem("quotes", stringifiedQuotes);
		} else {
			const objQuotes = JSON.parse(cachedQuotes, null, 2);
			allQuotes = objQuotes;
		}
		const randomQuote =
			allQuotes[Math.floor(Math.random() * allQuotes.length - 1)];
		return randomQuote.quote;
	};

	const findQuotes = async function () {
		loading = true;
		allUsersQuotes = null;
		searchQuery = input;
		try {
			let queryName = selected.split("-")[0].trim();
			const getQuotesRes = await fetch(
				`https://quote-test-app.herokuapp.com/quotes?${queryName}=${searchQuery}`
			);
			const json = await getQuotesRes.json();
			await sleep(500);
			allUsersQuotes = json.results;
		} catch {
			allUsersQuotes = [];
		}
		loading = false;
	};
</script>

<main>
	<h1>Quote Bot</h1>

	{#await getRandomQuote()}
		<p>&nbsp</p>
	{:then quote}
		<p transition:fade>{quote}</p>
	{/await}

	<div class="thin-line" />

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

	<form on:submit|preventDefault={findQuotes}>
		<label for="imageNum"
			>Find quotes: <input
				style="width: 150px"
				type="text"
				id="input"
				name="input"
				bind:value={input}
			/>
			<button type="submit"> Go </button>
		</label>
	</form>

	{#if allUsersQuotes}
		{#if allUsersQuotes.length === 0}
			<h4>No quotes found</h4>
		{:else if allUsersQuotes.length === 1}
			<h4>Found 1 quote for "{searchQuery}"</h4>
		{:else if allUsersQuotes.length > 0}
			<h4>Found {allUsersQuotes.length} quotes for "{searchQuery}"</h4>
		{:else}
			<h4>Error finding quotes</h4>
		{/if}
		<ol>
			{#each allUsersQuotes as entry}
				<li>{entry.quote}</li>
			{/each}
		</ol>
	{:else if loading}
		<Circle size="30" color="#b10bb1" unit="px" duration="1s" />
	{/if}
</main>

<style>
	main {
		padding: 1em;
		padding-top: 0;
		margin: 0 auto;
	}

	h1 {
		color: #b10bb1;
		font-size: 4em;
		font-weight: 150;
		margin-top: 0;
		margin-bottom: 0;
	}

	.thin-line {
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
		margin-bottom: 20px;
	}

	.radio-button {
		margin-right: 5px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
