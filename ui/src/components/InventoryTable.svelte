<!-- The Inventory Table -->

<script>
	export let tableData = [
			{
				vitae : "dolorem",
				lectus : "ipsum",
				quisquam : "quia"
			},
			{
				vitae : "amet",
				lectus : "consectetur",
				quisquam : "adipisci"
			}
		];
	export let style;
</script>

<table class={style}>
	<thead>
		<tr>
			{#each Object.keys(tableData[0]) as columnHeading}
				<th>{columnHeading}</th>
			{/each}
		<tr/>
	</thead>
	<tbody>
		{#each Object.values(tableData) as row}
			<tr>
				{#each Object.values(row) as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table, th, td {
		border: 1px solid;
		border-collapse: collapse;
    margin-bottom:25px
	}
	
	table.cometTable {
		border: 2px solid #154734;
		background-color: #f8dec4;
		width: 100%;
		text-align: center;
		border-collapse: collapse;
	}
	table.cometTable td, table.cometTable th {
		border: 1px solid #AAAAAA;
		padding: 3px 2px;
	}
	table.cometTable tbody td {
		font-size: 13px;
	}
	table.cometTable tr:nth-child(even) {
		background: #c2e1d5;
	}
	table.cometTable thead {
		background: #154734;
		background: -moz-linear-gradient(top, #14b778 0%, #1e7856 66%, #154734 100%);
		background: -webkit-linear-gradient(top, #14b778 0%, #1e7856 66%, #154734 100%);
		background: linear-gradient(top, #14b778 0%, #1e7856 66%, #154734 100%);
	}
	table.cometTable thead th {
		font-size: 19px;
		font-weight: bold;
		color: #FFFFFF;
		text-align: center;
		border-left: 2px solid #154734;
	}
	table.cometTable thead th:first-child {
		border-left: none;
	}
</style>
