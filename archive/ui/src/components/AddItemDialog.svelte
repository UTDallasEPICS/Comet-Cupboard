<script>
    import Textfield from "@smui/textfield";
    import AutoComplete from "@smui-extra/autocomplete"
    import { Title, Content, Actions } from "@smui/dialog";
    import Select, { Option } from "@smui/select";
    import SegmentedButton, {Label, Segment} from "@smui/segmented-button"

    let categories = ['refrigerated','Protein','Frozen','Pantry Staple','Grain','Soup']

    let inv = [
        {
            name:"bananas"
        },
        {
            name:"apples"
        }
    ]

    let answer;
    let itemCategory = '';
    let size;
    let itemAmount = 0;
</script>

<div class="addForm">
    <Title>Add an Item</Title>
    <Actions>
        <!-- ask for item and have auto fill -->
        <AutoComplete
            options={inv.map((val) => val.name)}
            bind:value={answer}
            label="Item"
            aria-required
        />
        <!-- ask for category if item is not an auto filled -->
        <Select bind:value={itemCategory} label="Item's Category" required>
            {#each categories as category}
                <Option value={category}>{category}</Option>
            {/each}
        </Select>
        <!-- ask for size -->
        <SegmentedButton segments={["S",'M','L']} let:segment singleSelect bind:selected={size}>
            <!-- Note: the `segment` property is required! -->
            <Segment {segment}>
              <Label>{segment}</Label>
            </Segment>
          </SegmentedButton>
        <!-- ask for the amount of that item with that size if any size -->
        <Textfield 
            required 
            bind:value={itemAmount}
            label="Amount"
            type="number"
        >
        </Textfield>
    </Actions>
</div>

<style>
    * :global(.addForm) {
        width:100%;
    }
</style>