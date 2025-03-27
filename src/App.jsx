import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { MyProvider } from './components/MyContext/MyContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import PassagemPlantao from './pages/PassagemPlantao';
import Historico from './pages/Historico';
import Profissionais from './pages/Profissionais';
import Pacientes from './pages/Pacientes';
import ResumoIA from './pages/ResumoIA';
import Login from './pages/Login';

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
      <AuthProvider>
        <MyProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Box sx={{ maxWidth: '95vw', margin: '0 auto' }}>
                    <Routes>
                      <Route index element={<PassagemPlantao />} />
                      <Route path="/linha-tempo" element={<Historico />} />
                      <Route path="/profissionais" element={<Profissionais />} />
                      <Route path="/pacientes" element={<Pacientes />} />
                      <Route path="/resumo-ia" element={<ResumoIA />} />
                    </Routes>
                  </Box>
                  <Footer />
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </MyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
