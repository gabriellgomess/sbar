import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper, Alert } from '@mui/material';
import { Microsoft as MicrosoftIcon } from '@mui/icons-material';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        try {
            setError(null);
            await login();
        } catch (err) {
            if (err.message.includes('@casadomenino.org.br')) {
                setError('Acesso permitido apenas para usuários do domínio @casadomenino.org.br');
            } else if (err.message.includes('não está registrado')) {
                setError('Usuário não está registrado na organização. Por favor, contate o administrador do sistema.');
            } else if (err.message.includes('não pertence à organização')) {
                setError('Usuário não pertence à organização autorizada. Por favor, contate o administrador.');
            } else {
                setError('Erro ao realizar login. Por favor, tente novamente.');
            }
            console.error(err);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default"
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        startIcon={<MicrosoftIcon />}
                        onClick={handleLogin}
                        size="large"
                        fullWidth
                    >
                        Entrar com Microsoft
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login; 