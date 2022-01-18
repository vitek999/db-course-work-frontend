import {useParams} from "react-router-dom";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, MenuItem, Select, Snackbar, TextField,
    Typography
} from "@mui/material";
import {Item} from "../components/Item";
import {Delete} from "@mui/icons-material";
import {useEffect, useState} from "react";
import ky from "ky";
import RoomIcon from "@mui/icons-material/Room";
import {Alert} from "@mui/lab";

export function HotelRooms() {
    const params = useParams()

    const [rooms, setRooms] = useState([])
    const [hotel, setHotel] = useState(null)

    const [roomsTypes, setRoomTypes] = useState([])

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessagae] = useState(null)

    const [isAddModel, setAddModel] = useState(false)
    const [modalErrorMessage, setModalErrorMessage] = useState(null)
    const [numberField, setNumberField] = useState(null)
    const [sleepingPlaceField, setSleepingPlaceField] = useState(null)
    const [costField, setCostField] = useState(null)
    const [roomTypeField, setRoomTypeField] = useState(null)

    const handleNumberChange = (event) => {
        setNumberField(event.target.value)
    }

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChangeRoomTypeField = (event) => {
        setRoomTypeField(event.target.value);
    };

    const handleCostField = (event) => {
        setCostField(event.target.value);
    };

    const handleSleepingPlacesField = (event) => {
        setSleepingPlaceField(event.target.value);
    };

    const handleCloseModal = () => {
        setAddModel(false)
        setNumberField(null)
        setSleepingPlaceField(null)
        setCostField(null)
        setRoomTypeField(null)
    }

    const fetchAndSetRooms = async () => {
        const response = await (await ky.get(`http://localhost:8080/rooms/filter?hotelId=${getHotelId()}`)).json()
        setRooms(response)
    }

    const handleDeleteRoom = async (id) => {
        const response = await ky.delete(`http://localhost:8080/rooms/id/${id}`, {throwHttpErrors: false})
        if (response.ok) {
            await fetchAndSetRooms()
        }
        if (response.status === 400) {
            const message = await response.text()
            setErrorMessagae(message)
            handleClick()
        }
    }

    const handleCreateRoom = async () => {
        const response = await ky.post('http://localhost:8080/rooms', {
            json: {
                number: numberField,
                sleepingPlaces: sleepingPlaceField,
                cost: costField,
                roomType: roomTypeField,
                hotel: getHotelId()
            },
            throwHttpErrors: false
        })
        if(response.status === 201) {
            handleCloseModal()
            await fetchAndSetRooms()
        }
        if(response.status === 400) {
            setModalErrorMessage(await response.text())
        }
    }

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
            const response = await (await ky.get('http://localhost:8080/roomtypes')).json()
            setRoomTypes(response)
        }
        a()
    }, [])

    useEffect(() => {
        fetchAndSetRooms()
    }, [])

    const getHotelId = () => params.hotelId

    return (
        <>
            <Grid container spacing={1}>
                <Grid container item spacing={3} xs={12}>
                    <Grid item xs={12}>
                        <Item>
                            <Typography variant={'h5'} color={'text.primary'} sx={{display: 'inline'}}>
                                Комнаты в отеле: {hotel && hotel.name}
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>
                <Grid container item spacing={3} justifyContent={'flex-end'} xs={12}>
                    <Grid item>
                        <Button variant={'outlined'} disableElevation onClick={() => {setAddModel(true)}}>
                            Добавить комнату
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} xs={12}>
                    <Grid item xs={12}>
                        <Item>
                            {rooms.length ?
                                <List xs={{width: "100%"}}>
                                    {
                                        rooms.map(value =>
                                            <>
                                                <ListItem secondaryAction={
                                                    <IconButton variant={'outlined'} edge={'end'}
                                                                onClick={() => handleDeleteRoom(value.id)}>
                                                        <Delete/>
                                                    </IconButton>
                                                }
                                                          key={value.id}
                                                >
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
                                    В отеле нет комнат :(
                                </Typography>
                            }
                        </Item>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Dialog open={isAddModel} onClose={handleCloseModal}>
                <DialogTitle>Cоздание комнаты</DialogTitle>
                <DialogContent>
                    {modalErrorMessage && <Alert severity="error">{modalErrorMessage}</Alert>}
                    <TextField
                        label={'Номер комнаты'}
                        value={numberField}
                        onChange={handleNumberChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'Количество спальных мест'}
                        value={sleepingPlaceField}
                        onChange={handleSleepingPlacesField}
                        variant={'standard'}
                        fullWidth
                        type={'number'}
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'Стоимость'}
                        value={costField}
                        onChange={handleCostField}
                        variant={'standard'}
                        fullWidth
                        type={'number'}
                        required
                        margin={'dense'}
                    />
                    <Select
                        value={roomTypeField}
                        onChange={handleChangeRoomTypeField}
                        label={'Тип комнаты'}
                        style={{width: '100%'}}
                    >
                        {roomsTypes.map(a => <MenuItem value={a._id}>{a.name}</MenuItem>)}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseModal()}>Отмена</Button>
                    <Button onClick={() => handleCreateRoom()} disabled={false}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}