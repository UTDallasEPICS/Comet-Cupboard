import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const searches = [
  "Checkout History",
  "Alphabetical",
  "Chronological",
  "Popularity",
];

function getStyles(name: string, searchOption: string[], theme: Theme) {
  return {
    fontWeight:
      searchOption.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect() {
  const theme = useTheme();
  const [searchOption, setsearchOption] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof searchOption>) => {
    const {
      target: { value },
    } = event;
    setsearchOption(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200, margin: 2 }}>
        <Box justifyContent="center" display="flex">
          <InputLabel id="demo-multiple-name-label">Sort Option</InputLabel>
        </Box>

        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={searchOption}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {searches.map((options) => (
            <MenuItem
              key={options}
              value={options}
              style={getStyles(options, searchOption, theme)}
            >
              {options}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
