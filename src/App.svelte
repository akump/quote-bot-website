<script>
	import { Circle } from "svelte-loading-spinners";
	import { sleep } from "./util.js";

	let inputtedUser;
	let allUsersQuotes;
	let loading;

	const findQuotes = async function () {
		loading = true;
		try {
			// const getQuotesRes = await fetch("/currentWeek");
			// allUsersQuotes = await getQuotesRes.json();
		} catch {
			allUsersQuotes = [];
		}
		await sleep(500);
		loading = false;
	};
</script>

<main>
	<h1>Quote Bot</h1>
	<form on:submit|preventDefault={findQuotes}>
		<label for="imageNum"
			>Find user's quotes: <input
				type="text"
				id="inputtedUser"
				name="inputtedUser"
				bind:value={inputtedUser}
			/>
			<button type="submit"> Go </button>
		</label>
	</form>
	{#if allUsersQuotes}
		{#if allUsersQuotes.length === 0}
			<h4>No quotes found</h4>
		{:else if allUsersQuotes.length === 1}
			<h4>Found 1 quote</h4>
		{:else if allUsersQuotes.length > 0}
			<h4>Found {allUsersQuotes.length} quotes for user</h4>
		{:else}
			<h4>Error finding quotes</h4>
		{/if}
		<ol>
			{#each allUsersQuotes as quote}
				<li>{quote}</li>
			{/each}
		</ol>
	{:else if loading}
		<Circle size="30" color="#b10bb1" unit="px" duration="1s" />
	{/if}
</main>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #b10bb1;
		font-size: 4em;
		font-weight: 150;
		margin-top: 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
