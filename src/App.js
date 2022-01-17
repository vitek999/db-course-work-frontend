import './App.css';
import {
    AppBar,
    Box,
    Button,
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {Link, Route, Routes} from "react-router-dom";
import {Peoples} from "./peoples/Peoples";
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import {HotelsList} from "./hotels/HotelsList";
import {Hotel} from "./hotels/Hotel";
import {LocalizationProvider} from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment';

const mdTheme = createTheme();

function App() {
    return (
        <div className="App">
            <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={mdTheme}>
                <CssBaseline/>
                <Box sx={{flexGrow: 1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div">
                                Hotels
                            </Typography>
                            <Box width={'20px'}/>

                            <Button color={'inherit'} component={Link} to={'/peoples'}>
                                <PeopleIcon/>
                                <Typography variant="h6" component="div" style={{paddingLeft: '5px'}}>
                                    Посетители
                                </Typography>
                            </Button>

                            <Button color={'inherit'} component={Link} to={'/'} style={{marginLeft: '10px'}}>
                                <ApartmentIcon/>
                                <Typography variant="h6" component="div" style={{paddingLeft: '5px'}}>
                                    Список отелей
                                </Typography>
                            </Button>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Container fixed>
                    <Box sx={{height: '90vh', paddingTop: '20px'}}>
                        <Routes>
                            <Route path={'/'} element={<HotelsList/>}/>
                            <Route path={'/peoples'} element={<Peoples/>}/>
                            <Route path={'/hotel/:hotelId'} element={<Hotel/>}/>
                        </Routes>
                    </Box>
                </Container>
            </ThemeProvider>
            </LocalizationProvider>
        </div>
    );
}

export default App;
