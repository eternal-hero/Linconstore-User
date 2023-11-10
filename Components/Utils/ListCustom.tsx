import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {useRouter} from "next/router";
type manage = {
    title: string,
    link: string
}
interface Ilist{
    listItems : manage,
}

const ListCustom : React.JSXElementConstructor<Ilist>  = ({listItems}: Ilist) => {
    const router = useRouter();
    return (
        <>
        <ListItem disablePadding>
            <ListItemButton  >
                    <ListItemText className="123" sx={{'& span': {fontSize: 14}}} onClick={() => router.push(listItems.link)} primary={listItems.title} />
            </ListItemButton>
        </ListItem>
        </>

    )

}
export default ListCustom;