import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListCustom from "../Utils/ListCustom";
import Divider from "@mui/material/Divider";
import * as React from "react";

type manage = {
    title: string,
    link: string
}
interface IListWrapper {
    title: string,
    menuItem : manage[]
}

const ListWrapper : React.JSXElementConstructor<IListWrapper> = ({title, menuItem}) => {
    return (
        <nav aria-label={title}>
            <List>
                <Typography variant={'h6'} sx={{textDecoration: 'underline solid #00a859 9%', fontSize: 15}}> {title} </Typography>
                {menuItem.map( (items, index) => {
                    return (
                        <div key={index}>
                            <ListCustom    listItems={items} />
                            {index === menuItem.length - 1 ? null : <Divider /> }
                        </div>
                    )})}
            </List>
        </nav>

    )

}
export default ListWrapper;