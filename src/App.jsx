import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavBar from "./components/NavBar/NavBar";
import PassagemPlantao from './pages/PassagemPlantao';
import Historico from './pages/Historico';
import Login from './components/login'
import { Typography, CssBaseline, Box, Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { PacientesProvider } from './components/PacientesContext/PacientesContext';

// const theme = createTheme({
//   palette: {
//     primary: {      
//       main: '#00668c',     
//       contrastText: '#fff',
//     },
//     secondary: {      
//       main: '#cccbc8',     
//       contrastText: '#000',
//     },
//     error: {
//       main: '#c62828',
//     },
//     background: {
//       default: '#f5f4f1',
//       paper: '#d4eaf7',
//     },
//     text: {
//       primary: '#1d1c1c',
//       secondary: '#313d44',
//     },
//   },
// });
const theme = createTheme({
  palette: {
    primary: {      
      main: '#88C1B2',     
      contrastText: '#fff',
    },
    secondary: {      
      main: '#C9C0E0',     
      contrastText: '#000',
    },
    error: {
      main: '#c62828',
    },
    background: {
      default: '#f5f4f1',
      paper: '#F4DCD6',
    },
    text: {
      primary: '#232121',
      secondary: '#232121',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PacientesProvider>
        <NavBar />
        <Box sx={{ maxWidth: '95vw', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<PassagemPlantao />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </PacientesProvider>
    </ThemeProvider>
  );
}

export default App;
