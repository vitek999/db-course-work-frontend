import {
    Alert,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    styled,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import ky from "ky";
import DeleteIcon from '@mui/icons-material/Delete';

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}


export function Peoples() {
    const [peoples, setPeoples] = useState([])
    const [open, setOpen] = useState(false)
    const [isEditModalState, setEditModalState] = useState(false)

    const [firstNameField, setFirstNameField] = useState('')
    const [lastNameField, setLastNameField] = useState('')
    const [patronymicField, setPatronymicField] = useState('')
    const [phoneField, setPhoneField] = useState('')
    const [passportField, setPassportField] = useState('')

    const [modalErrorMessage, setModalErrorMessage] = useState(null)

    const [isSaveEnabled, setSaveEnabled] = useState(false)

    useEffect(() => {
        setSaveEnabled(
            firstNameField.trim() !== '' && lastNameField.trim() !== '' && patronymicField.trim() !== '' && phoneField.trim() !== '' && passportField.trim() !== ''
        )
    }, [firstNameField, lastNameField, patronymicField, passportField, phoneField])

    const handleAddClickOpen = () => {
        setEditModalState(false)
        setOpen(true)
    }

    const handleEditClickOpen = (item) => {
        setEditModalState(true)
        setOpen(true)
        setFirstNameField(item.firstName)
        setLastNameField(item.lastName)
        setPatronymicField(item.patronymic)
        setPhoneField(item.phone)
        setPassportField(item.passport)
        console.log(item)
    }

    const handleClose = () => {
        setOpen(false)
        setModalErrorMessage(null)
        setFirstNameField('')
        setLastNameField('')
        setPatronymicField('')
        setPhoneField('')
        setPassportField('')
    }

    const handleFirstnameChange = (event) => {
        setFirstNameField(event.target.value)
    }

    const handleLastnameChange = (event) => {
        setLastNameField(event.target.value)
    }

    const handlePatronymicChange = (event) => {
        setPatronymicField(event.target.value)
    }

    const handlePhoneChange = (event) => {
        setPhoneField(event.target.value)
    }

    const handlePassportChange = (event) => {
        setPassportField(event.target.value)
    }

    const handleDelete = async (phone) => {
        await ky.delete(`http://localhost:8080/users/${phone}`)
        fetchAndSetPeoples()
    }

    const fetchAndSetPeoples = () => {
        const a = async () => {
            const response = await (await ky.get('http://localhost:8080/users')).json()
            console.log(response)
            setPeoples(response)
        }
        a()
    }

    const handleUpdatePeople = async () => {
        await ky.post(`http://localhost:8080/users/${phoneField}`, {
            json: {
                firstName: firstNameField,
                lastName: lastNameField,
                patronymic: patronymicField,
                phone: phoneField,
                passport: passportField
            },
            throwHttpErrors: false
        })
        fetchAndSetPeoples()
        handleClose()
    }

    const handleSavePeople = async () => {
        const result = await ky.post('http://localhost:8080/users', {
            json: {
                firstName: firstNameField,
                lastName: lastNameField,
                patronymic: patronymicField,
                phone: phoneField,
                passport: passportField
            },
            throwHttpErrors: false
        })
        if (result.status === 400) {
            const errorMessage = await result.text()
            setModalErrorMessage(errorMessage)
        }
        if (result.status === 201) {
            fetchAndSetPeoples()
            handleClose()
        }
    }

    useEffect(() => {
        fetchAndSetPeoples()
    }, [])

    return (
        <>
            <Grid container spacing={1}>
                <Grid container item spacing={3} justifyContent={'flex-end'} xs={12}>
                    <Grid item>
                        <Button variant={'outlined'} disableElevation onClick={handleAddClickOpen}>
                            Зарегистрировать посетителя
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={3} xs={12}>
                    <Grid item xs={12}>
                        <Item>
                            <List xs={{width: '100%'}}>
                                {peoples.map(value =>
                                    <ListItem
                                        key={value._id}
                                        secondaryAction={
                                            <IconButton edge={'end'} onClick={() => handleDelete(value.phone)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton dense onClick={() => handleEditClickOpen(value)}>
                                            <ListItemAvatar>
                                                <Avatar {...stringAvatar(value.lastName + ' ' + value.firstName)}/>
                                            </ListItemAvatar>
                                            <ListItemText>{value.lastName} {value.firstName} {value.patronymic} ({value.phone})</ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </List>
                        </Item>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{ isEditModalState ? 'Редактирование' : 'Регистрация'} пользователя</DialogTitle>
                <DialogContent>
                    {modalErrorMessage && <Alert severity="error">{modalErrorMessage}</Alert>}
                    <TextField
                        label={'Фамилия'}
                        value={lastNameField}
                        onChange={handleLastnameChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'Имя'}
                        value={firstNameField}
                        onChange={handleFirstnameChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'Отчество'}
                        value={patronymicField}
                        onChange={handlePatronymicChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'Номер телефона'}
                        value={phoneField}
                        onChange={handlePhoneChange}
                        variant={'standard'}
                        fullWidth
                        required
                        disabled={isEditModalState}
                        margin={'dense'}
                    />
                    <TextField
                        label={'Паспортные данные'}
                        value={passportField}
                        onChange={handlePassportChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Отмена</Button>
                    <Button onClick={() => isEditModalState ? handleUpdatePeople() : handleSavePeople()} disabled={!isSaveEnabled}>{ isEditModalState ? 'Сохранить' : 'Зарегистрировать'}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}