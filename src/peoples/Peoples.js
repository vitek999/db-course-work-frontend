import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    styled,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import ky from "ky";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export function Peoples() {
    const [peoples, setPeoples] = useState([])
    const [open, setOpen] = useState(false)

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

    const handleClickOpen = () => {
        setOpen(true)
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

    const fetchAndSetPeoples = () => {
        const a = async () => {
            const response = await (await ky.get('http://localhost:8080/users')).json()
            console.log(response)
            setPeoples(response)
        }
        a()
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
        if(result.status === 201) {
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
                        <Button variant={'outlined'} disableElevation onClick={handleClickOpen}>
                            Зарегистрировать посетителя
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={3} xs={12}>
                    <Grid item xs={12}>
                        <Item>
                            <ul>
                                {peoples.map(value => <li
                                    key={value._id}>{value.lastName} {value.firstName} ({value.phone})</li>)}
                            </ul>
                        </Item>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Регистрация пользователя</DialogTitle>
                <DialogContent>
                    { modalErrorMessage && <Alert severity="error">{modalErrorMessage}</Alert> }
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
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleSavePeople} disabled={!isSaveEnabled}>Создать</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}