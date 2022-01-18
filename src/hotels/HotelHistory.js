import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ky from "ky";
import {
    Button,
    Divider,
    Grid, IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {Item} from "../components/Item";
import LockClockIcon from '@mui/icons-material/LockClock';
import {Delete} from "@mui/icons-material";

export function HotelHistory() {
    const params = useParams()

    const [hotel, setHotel] = useState(null)
    const [history, setHistory] = useState([])

    const fetchAndSetHistory = async () => {
        const response = await ky.get(`http://localhost:8080/schedule/history/${getHotelId()}`);
        const fetchedHistory = await response.json()
        setHistory(fetchedHistory)
    }

    useEffect(() => {
        fetchAndSetHistory()
    }, [])

    useEffect(() => {
        const a = async () => {
            const response = await ky.get(`http://localhost:8080/hotels/${getHotelId()}`, {throwHttpErrors: false})
            if (response.ok) {
                const fetchedHotel = await response.json()
                setHotel(fetchedHotel)
            }
        }
        a()
    }, [])

    const getHotelId = () => params.hotelId;

    const handleDeleteHistory = async (id) => {
        await ky.delete(`http://localhost:8080/schedule/id/${id}`)
        await fetchAndSetHistory()
    }

    return(
        <>
            <Grid container spacing={1}>
                <Grid container item spacing={3} xs={12}>
                    <Grid item xs={12}>
                        <Item>
                            <Typography variant={'h5'} color={'text.primary'} sx={{display: 'inline'}}>
                                История отеля: {hotel && hotel.name}
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} xs={12}>
                    <Grid item xs={12}>
                        <Item>
                            {history.length ?
                                <List xs={{width: "100%"}}>
                                    {
                                        history.map(value =>
                                            <>
                                                <ListItem secondaryAction={
                                                    <IconButton edge={'end'}
                                                            onClick={() => handleDeleteHistory(value.id)}>
                                                        <Delete/>
                                                    </IconButton>
                                                }
                                                          key={value.id}
                                                >
                                                    <ListItemButton dense>
                                                        <ListItemIcon>
                                                            <LockClockIcon/>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    sx={{display: 'inline'}}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    Комната: {value.roomModel.number} c: {value.startDate} по: {value.endDate}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <>
                                                                    <Typography
                                                                        sx={{display: 'inline'}}
                                                                        component="span"
                                                                        variant="body2"
                                                                    >
                                                                        {value.users.map(b => `${b.lastName} ${b.firstName}; `)}
                                                                    </Typography>
                                                                </>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                                <Divider/>
                                            </>
                                        )
                                    }
                                </List> : <Typography>
                                    История для данного отеля не найдена :(
                                </Typography>
                            }
                        </Item>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}