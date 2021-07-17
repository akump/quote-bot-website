<script>
  import TextSearch from "./TextSearch.svelte";
  import DateSearch from "./DateSearch.svelte";
  import RandomQuote from "./RandomQuote.svelte";
  import Timehop from "./Timehop.svelte";
  import Analytics from "./Analytics.svelte";
  import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
</script>

<main>
  <h1>Quote Bot</h1>
  <RandomQuote />
  <Tabs>
    <TabList>
      <Tab>Text</Tab>
      <Tab>Date</Tab>
      <Tab>Timehop</Tab>
      <Tab>Analytics</Tab>
    </TabList>
    <TabPanel>
      <TextSearch />
    </TabPanel>
    <TabPanel>
      <DateSearch />
    </TabPanel>
    <TabPanel>
      <Timehop />
    </TabPanel>
    <TabPanel>
      <Analytics />
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
