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
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import ky from "ky";
import DeleteIcon from '@mui/icons-material/Delete';
import {Item} from "../components/Item";
import {stringAvatar} from "../utlils/avatar";

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
                            ???????????????????????????????? ????????????????????
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
                <DialogTitle>{isEditModalState ? '????????????????????????????' : '??????????????????????'} ????????????????????????</DialogTitle>
                <DialogContent>
                    {modalErrorMessage && <Alert severity="error">{modalErrorMessage}</Alert>}
                    <TextField
                        label={'??????????????'}
                        value={lastNameField}
                        onChange={handleLastnameChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'??????'}
                        value={firstNameField}
                        onChange={handleFirstnameChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'????????????????'}
                        value={patronymicField}
                        onChange={handlePatronymicChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                    <TextField
                        label={'?????????? ????????????????'}
                        value={phoneField}
                        onChange={handlePhoneChange}
                        variant={'standard'}
                        fullWidth
                        required
                        disabled={isEditModalState}
                        margin={'dense'}
                    />
                    <TextField
                        label={'???????????????????? ????????????'}
                        value={passportField}
                        onChange={handlePassportChange}
                        variant={'standard'}
                        fullWidth
                        required
                        margin={'dense'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>????????????</Button>
                    <Button onClick={() => isEditModalState ? handleUpdatePeople() : handleSavePeople()}
                            disabled={!isSaveEnabled}>{isEditModalState ? '??????????????????' : '????????????????????????????????'}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}