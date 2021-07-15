<script>
	import { Circle } from "svelte-loading-spinners";
	import {
		sleep,
		capitalize,
		getDateFromText,
		handleRadio,
		isValidDate,
		callQuoteApi,
	} from "./utils.js";
	import { fade } from "svelte/transition";
	import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
	import Toggle from "svelte-toggle";

	const options = ["name - Not case sensitive", "quote - Case sensitive"];
	const radioSelection = localStorage.getItem("radioSelection");

	let toggled;
	let selected;
	let input = "";
	let allUsersQuotes;
	let quotesInTimeframe;
	let loading;
	let searchQuery = "";
	let startDateInput = "7/1/2019";
	let endDateInput = "12/31/2021";

	if (!radioSelection) {
		localStorage.setItem("radioSelection", "name - Not case sensitive");
		selected = "name - Not case sensitive";
	} else {
		selected = radioSelection;
	}

	const getRandomQuote = async function () {
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
		const randomQuote =
			allQuotes[Math.floor(Math.random() * allQuotes.length - 1)];
		return randomQuote;
	};

	const findQuotes = async function () {
		loading = true;
		allUsersQuotes = null;
		searchQuery = input;
		try {
			let queryName = selected.split("-")[0].trim();
			await sleep(500);
			allUsersQuotes = await callQuoteApi(queryName, searchQuery);
		} catch {
			allUsersQuotes = [];
		}
		loading = false;
	};

	const dateSearch = async function () {
		loading = true;
		quotesInTimeframe = null;
		const [startMonth, startDay, startYear] = startDateInput.split("/");
		const [endMonth, endDay, endYear] = endDateInput.split("/");
		const startDate = new Date(
			startYear,
			parseInt(startMonth) - 1,
			startDay
		);
		const endDate = new Date(
			endYear,
			parseInt(endMonth) - 1,
			parseInt(endDay)
		);
		endDate.setUTCHours(23, 59, 59, 999);

		if (!isValidDate(startDate) || !isValidDate(endDate)) {
			loading = false;
			return;
		}
		const allQuotes = await callQuoteApi();
		quotesInTimeframe = allQuotes.filter((entry) => {
			const { timestamp } = entry;
			const currQuoteDate = new Date(timestamp);
			if (currQuoteDate > startDate && currQuoteDate < endDate) {
				return entry;
			}
		});
		loading = false;
	};
</script>

<main>
	<h1>Quote Bot</h1>

	{#await getRandomQuote()}
		<p>&nbsp</p>
	{:then quoteEntry}
		<p transition:fade>
			{quoteEntry.quote}
		</p>
	{/await}

	<Tabs>
		<TabList>
			<Tab>Text Search</Tab>
			<Tab>Date Search</Tab>
		</TabList>

		<TabPanel>
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

			<div class="toggle-label">Show date quote was added</div>
			<Toggle
				bind:toggled
				hideLabel
				toggledColor="#b10bb1"
				label="Show date added?"
			/>

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
							{#if toggled}
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
				<Circle size="30" color="#b10bb1" unit="px" duration="1s" />
			{/if}
		</TabPanel>

		<TabPanel>
			<h4>Dates should be formatted month/day/year</h4>
			<form class="date-form" on:submit|preventDefault={dateSearch}>
				<label class="date-label"
					>Start date <input
						style="width: 150px"
						type="text"
						id="startDateInput"
						name="startDateInput"
						bind:value={startDateInput}
					/>
				</label>
				<label class="date-label"
					>End date <input
						style="width: 150px"
						type="text"
						id="endDateInput"
						name="endDateInput"
						bind:value={endDateInput}
					/>
					<button type="submit"> Search </button>
				</label>
			</form>

			{#if quotesInTimeframe}
				{#if quotesInTimeframe.length === 0}
					<h4 class="found-header">
						No quotes found. Are your dates formatted correctly?
					</h4>
				{:else if quotesInTimeframe.length === 1}
					<h4 class="found-header">Found 1 quote</h4>
				{:else if quotesInTimeframe.length > 0}
					<h4 class="found-header">
						Found {quotesInTimeframe.length} quotes
					</h4>
				{:else}
					<h4>Error finding quotes</h4>
				{/if}
				<ol>
					{#each quotesInTimeframe as entry}
						<li>
							{#if toggled}
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
				<Circle size="30" color="#b10bb1" unit="px" duration="1s" />
			{/if}
		</TabPanel>
	</Tabs>
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

	.radio-button {
		margin-right: 5px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	/* .rainbow_text_animated {
		background: linear-gradient(
			to right,
			#6666ff,
			#0099ff,
			#00ff00,
			#ff3399,
			#6666ff
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: rainbow_animation 6s ease-in-out infinite;
		background-size: 400% 100%;
	} */

	@keyframes rainbow_animation {
		0%,
		100% {
			background-position: 0 0;
		}

		50% {
			background-position: 100% 0;
		}
	}
	.quote-container {
		display: flex;
		margin-bottom: 10px;
	}
	.quote-text {
		flex-basis: 80%;
		margin: 0;
	}

	.quote-date {
		margin: 0;
	}

	.toggle-label {
		margin-bottom: 5px;
	}

	.quote-no-date {
		display: flex;
		margin-bottom: 10px;
	}

	.quote-no-date .quote-text {
		flex-basis: 100%;
		margin: 0;
	}

	.found-header {
		margin: 5px 5px 5px 0;
	}

	.date-label {
		margin-right: 5px;
	}
	.date-form {
		display: flex;
	}
</style>
