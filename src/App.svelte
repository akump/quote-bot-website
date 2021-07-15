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

	const options = ["name", "quote"];
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
	let oneYearOldQuotes = [];
	let twoYearOldQuotes = [];

	if (!radioSelection) {
		localStorage.setItem("radioSelection", "name");
		selected = "name";
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
			let queryName = selected;
			allUsersQuotes = await callQuoteApi(queryName, searchQuery);
			await sleep(500);
		} catch {
			allUsersQuotes = [];
		}
		loading = false;
	};

	const getQuoteBetweenDates = function (quote, startDate, endDate) {
		const { timestamp } = quote;
		const currQuoteDate = new Date(timestamp);
		if (currQuoteDate > startDate && currQuoteDate < endDate) {
			return quote;
		}
	};

	const dateSearch = async function () {
		loading = true;
		quotesInTimeframe = null;
		let [startMonth, startDay, startYear] = startDateInput.split("/");
		let [endMonth, endDay, endYear] = endDateInput.split("/");

		if (startDateInput === "") {
			startMonth = "7";
			startDay = "1";
			startYear = "2019";
		}
		if (endDateInput === "") {
			endMonth = "12";
			endDay = "31";
			endYear = "2022";
		}

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
			quotesInTimeframe = [];
			return;
		}
		const allQuotes = await callQuoteApi();
		quotesInTimeframe = allQuotes.filter((entry) =>
			getQuoteBetweenDates(entry, startDate, endDate)
		);
		loading = false;
	};

	const getQuotesFromYearsAgo = async function (year = "2019") {
		let cachedQuotes = localStorage.getItem("quotes");
		let foundQuotes;
		if (!cachedQuotes) {
			foundQuotes = await callQuoteApi();
			const stringifiedQuotes = JSON.stringify(allQuotes, null, 2);
			localStorage.setItem("quotes", stringifiedQuotes);
		} else {
			const objQuotes = JSON.parse(cachedQuotes, null, 2);
			foundQuotes = objQuotes;
		}
		const now = new Date();
		// now.getDate()
		const startDate = new Date(year, now.getMonth(), now.getDate());
		const endDate = new Date(year, now.getMonth(), now.getDate());
		endDate.setUTCHours(23, 59, 59, 999);
		return foundQuotes.filter((entry) =>
			getQuoteBetweenDates(entry, startDate, endDate)
		);
	};

	(async function () {
		oneYearOldQuotes = await getQuotesFromYearsAgo("2020");
		twoYearOldQuotes = await getQuotesFromYearsAgo("2019");
	})();
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
			<Tab>Timehop</Tab>
		</TabList>

		<TabPanel>
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

			<div class="label">Show date quote was added</div>
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
				</label>
				<button class="date-search-button" type="submit">
					Search
				</button>
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
							<div class="quote-container">
								<p class="quote-text">{entry.quote}</p>
								<p class="quote-date">
									{getDateFromText(entry.timestamp)}
								</p>
							</div>
						</li>
					{/each}
				</ol>
			{:else if loading}
				<Circle size="30" color="#b10bb1" unit="px" duration="1s" />
			{/if}
		</TabPanel>
		<TabPanel>
			<h4 class="found-header">1 year old quotes</h4>
			{#if oneYearOldQuotes.length === 0}
				<p>No quotes found</p>
			{:else if oneYearOldQuotes.length > 0}
				<ol>
					{#each oneYearOldQuotes as entry}
						<li>
							<div class="quote-container">
								<p class="quote-text">{entry.quote}</p>
								<p class="quote-date">
									{getDateFromText(entry.timestamp)}
								</p>
							</div>
						</li>
					{/each}
				</ol>
			{:else}
				<h4>Error finding quotes</h4>
			{/if}

			<br />

			<h4 class="found-header">2 year old quotes</h4>
			{#if twoYearOldQuotes.length === 0}
				<p>No quotes found</p>
			{:else if twoYearOldQuotes.length > 0}
				<ol>
					{#each twoYearOldQuotes as entry}
						<li>
							<div class="quote-container">
								<p class="quote-text">{entry.quote}</p>
								<p class="quote-date">
									{getDateFromText(entry.timestamp)}
								</p>
							</div>
						</li>
					{/each}
				</ol>
			{:else}
				<h4>Error finding quotes</h4>
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

	.label {
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
		flex-basis: 150px;
		margin-right: 5px;
	}
	.date-form {
		display: flex;
		flex-wrap: wrap;
	}

	.date-search-button {
		height: 33px;
		align-self: flex-end;
	}

	.thin-line {
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
		margin-bottom: 20px;
	}
</style>
