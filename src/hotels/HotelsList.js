import {useEffect, useState} from "react";
import ky from "ky";
import {Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import {Item} from "../components/Item";
import {Link} from "react-router-dom";


export function HotelsList() {
    const [hotels, setHotels] = useState([])

    useEffect(() => {
        const a = async () => {
            const response = await (await ky.get('http://localhost:8080/hotels')).json()
            console.log(response)
            setHotels(response)
        }
        a()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid container item spacing={3} xs={12}>
                <Grid item>
                    <Typography variant={'h4'} component={'div'}>
                        Выберите отель
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item spacing={3} xs={12}>
                <Grid item xs={12}>
                    <Item>
                        <List xs={{width: '100%'}}>
                            {hotels.map(value =>
                                <ListItem
                                    key={value._id}
                                    disablePadding
                                >
                                    <ListItemButton dense component={Link} to={`/hotel/${value._id}`}>
                                        <ListItemIcon>
                                            <ApartmentIcon/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {value.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                    >
                                                        {value.description}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </List>
                    </Item>
                </Grid>
            </Grid>
        </Grid>
    )
}