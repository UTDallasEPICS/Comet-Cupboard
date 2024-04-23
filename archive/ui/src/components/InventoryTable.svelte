<!-- The Inventory Table -->

<script lang="ts">
    import DataTable, {Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';
    type item = {
        "name": string,
        "image_src": string,
        "deal": string,
        "sizes": string[],
        "expiration_dates": string[],
        "category": string,
        "id": string
    }

	export let style;
	export let tableData:item[];
    export let selected:item[] = [];
</script>

<div>
    <DataTable 
        stickyHeader 
        sortable
        
        class="table">
        <Head >
        <Row class="headRow">
            <Cell checkbox><Checkbox /></Cell>
            <Cell>Item</Cell>
            <Cell numeric>Amount</Cell>
            <Cell>Category</Cell>
            <Cell>Earliest Expiration</Cell>
            <Cell numeric>Amount of Small</Cell>
            <Cell numeric>Amount of Medium</Cell>
            <Cell numeric>Amount of Large</Cell>
            <Cell numeric>Amount on shelf</Cell>
            <Cell numeric>Amount in back</Cell>
        </Row>
    </Head>
    <Body>
        {#each tableData as item}
        <Row>
                <Cell checkbox>
                    <Checkbox 
                        bind:group={selected}
                        value={item}
                        valueKey={item.name}
                    />
                </Cell>
                <Cell>{item.name}</Cell>
                <Cell></Cell>
                <Cell numeric>{item.category}</Cell>
                <Cell>{item.expiration_dates[0]}</Cell>ks
                <Cell numeric></Cell>
                <Cell numeric></Cell>
                <Cell numeric></Cell>
                <Cell numeric></Cell>
                <Cell numeric></Cell>
            </Row>
            {/each}
        </Body>
</DataTable>
<p>{selected.map((option) => option.name)}</p>
</div>

<style>
    * :global(.table) {
        height:70vh;
        width:80%;
        max-width: 1400px;
        overflow: scroll;
        margin-bottom: 3rem;
    }
    * :global(.headRow) {
        background-color: #154734;
    }
</style>
