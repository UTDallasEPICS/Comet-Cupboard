<script lang="ts">
    import DataTable,{Body,Cell,Head,Row} from "@smui/data-table/";
    import Checkbox from '@smui/checkbox';
    import { Actions, Content, Title } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    type item = {
        "name": string,
        "image_src": string,
        "deal": string,
        "sizes": string[],
        "expiration_dates": string[],
        "category": string,
        "id": string
    }

    export let selected:item[];
</script>

<!-- 
    we assume that "item" is a passed prop that is an has the name
    and other properties, and contains each instance of that item 
-->
<div>
    <Title>test</Title>
    <!-- <Title>{selected.length==0?"apple":selected.at(0).name}</Title> -->
    <Actions>
        <Button on:click={() =>{}}><Label>Stuff</Label></Button>
    </Actions>
    <Content>
        <div>
            <DataTable>
                <Head>
                    <Row>
                        <Cell checkbox><Checkbox /></Cell>
                        <Cell>id</Cell>
                        <Cell>Expiration Date</Cell>
                    </Row>
                </Head>
                <Body>
                    <!-- {#each item.individual as individual} -->
                    <Row>
                        <Cell checkbox><Checkbox /></Cell>
                        <Cell></Cell>
                        <Cell></Cell>
                    </Row>
                    <!-- {/each} -->
                </Body>
            </DataTable>
        </div>
    </Content>
</div>

<style>

</style>