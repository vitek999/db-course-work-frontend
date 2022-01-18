import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ky from "ky";
import {
    Button, Divider,
    Grid, IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import {Item} from "../components/Item";
import {DatePicker} from "@mui/lab";
import {convertToEpochDays} from "../utlils/date";
import moment from "moment";
import RoomIcon from '@mui/icons-material/Room';
import SearchIcon from '@mui/icons-material/Search';

export function Hotel() {
    const params = useParams()
    const [hotel, setHotel] = useState(null)
    const [availableRooms, setAvailableRooms] = useState([])

    const [peoples, setPeoples] = useState([])

    const [startDateField, setStartDateField] = useState(moment())
    const [endDateField, setEndDateField] = useState(moment().add(5, 'days'))

    const getHotelId = () => params.hotelId;

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

    useEffect(() => {
        const a = async () => {
            const response = await ky.get('http://localhost:8080/users')
            const fetchedPeoples = await response.json()
            setPeoples(fetchedPeoples)
        }
        a()
    }, [])

    const handleSearchAvailableRoomsButtonClick = async () => {
        const response = await ky.get(`http://localhost:8080/schedule/available?startDate=${convertToEpochDays(startDateField)}&endDate=${convertToEpochDays(endDateField)}&hotelId=${getHotelId()}`)
        const fetchedRooms = await response.json()
        setAvailableRooms(fetchedRooms)
    }

    return (
        <>
            {hotel &&
                <Grid container spacing={1}>
                    <Grid container item spacing={3} xs={12}>
                        <Grid item xs={12}>
                            <Item>
                                <Typography variant={'h5'} color={'text.primary'} sx={{display: 'inline'}}>
                                    Отель: {hotel.name}
                                </Typography>
                                <Typography variant={'h6'}>
                                    {hotel.description}
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                    <Grid container item spacing={3} xs={12} alignItems={'center'}>
                        <Grid container item xs>
                            <Grid item xs={12}>
                                <Item>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <DatePicker
                                                label="Дата начала"
                                                value={startDateField}
                                                onChange={(newValue) => {
                                                    setStartDateField(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <DatePicker
                                                label="Дата конца"
                                                value={endDateField}
                                                onChange={(newValue) => {
                                                    setEndDateField(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Grid>
                                    </Grid>
                                </Item>
                            </Grid>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Button variant={'contained'} onClick={() => handleSearchAvailableRoomsButtonClick()}>
                                <SearchIcon/>
                                Найти свободные комнаты
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container item spacing={1} xs={12}>
                        <Grid item xs={12}>
                            <Item>
                                {availableRooms.length ?
                                    <List xs={{width: "100%"}}>
                                        {
                                            availableRooms.map(value =>
                                                <>
                                                    <ListItem secondaryAction={
                                                        <Button variant={'outlined'} edge={'end'} onClick={() => 5}>
                                                            Заселить
                                                        </Button>
                                                    }>
                                                        <ListItemButton dense>
                                                            <ListItemIcon>
                                                                <RoomIcon/>
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography
                                                                        sx={{display: 'inline'}}
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="text.primary"
                                                                    >
                                                                        Номер: {value.number}
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <>
                                                                        <Typography
                                                                            sx={{display: 'inline'}}
                                                                            component="span"
                                                                            variant="body2"
                                                                        >
                                                                            Количество спальных
                                                                            мест: {value.sleepingPlaces} |
                                                                            Стоимость: {value.cost} |
                                                                            Тип: {value.roomType.name}
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
                                        Подходящих комнат на заданный промежуток времени не найдено :(
                                    </Typography>
                                }
                            </Item>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </>
    )
}