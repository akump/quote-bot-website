<script>
	import { beforeUpdate } from "svelte";
	import { Circle } from "svelte-loading-spinners";
	import { sleep } from "./util.js";

	let selected = "name - Not case sensitive";
	let options = ["name - Not case sensitive", "quote - Case sensitive"];

	let input = "";
	let allUsersQuotes;
	let loading;

	const getRandomQuote = async function () {
		const getQuotesRes = await fetch(
			`https://quote-test-app.herokuapp.com/quotes?name=`
		);
		const json = await getQuotesRes.json();
		const allQuotes = json.results;
		const randomQuote =
			allQuotes[Math.floor(Math.random() * allQuotes.length - 1)];
		return randomQuote.quote;
	};

	function capitalize(s) {
		return s[0].toUpperCase() + s.slice(1);
	}

	const findQuotes = async function () {
		loading = true;
		allUsersQuotes = null;
		try {
			let queryName = selected.split("-")[0].trim();
			const getQuotesRes = await fetch(
				`https://quote-test-app.herokuapp.com/quotes?${queryName}=${input}`
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
		<p>{quote}</p>
	{/await}
	<div class="thin-line" />

	{#each options as value}
		<label
			><input type="radio" {value} bind:group={selected} />
			{capitalize(value)}</label
		>
	{/each}
	<form on:submit|preventDefault={findQuotes}>
		<label for="imageNum"
			>Find quotes: <input
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
			<h4>Found 1 quote for "{input}"</h4>
		{:else if allUsersQuotes.length > 0}
			<h4>Found {allUsersQuotes.length} quotes for "{input}"</h4>
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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
