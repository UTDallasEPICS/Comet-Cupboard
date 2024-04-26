import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";


export const SideBarNav = () => {
      

    
    return (
        <React.Fragment>
            <Drawer
            variant="persistent"
            anchor="left"
            >
            <Divider/>
            <List>
                {/*Get categories from server*/}
                <ListItem>
                    <ListItemButton/>
                    <ListItemText primary="Pantry"></ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemButton/>
                    <ListItemText primary="Snacks"></ListItemText>
                </ListItem>
            </List>
            </Drawer>
        </React.Fragment>

    )
}