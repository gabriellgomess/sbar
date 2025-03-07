import { useState, useContext } from "react";
import { MyContext } from "../components/MyContext/MyContext";
import {
    Autocomplete,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import axios from "axios";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Habilita suporte para UTC no dayjs
dayjs.extend(utc);

const ResumoIA = () => {
    const { pacientes } = useContext(MyContext);

    const [paciente, setPaciente] = useState(null);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);

    // Estados para armazenar os resultados
    const [resumo, setResumo] = useState("");
    const [recomendacao, setRecomendacao] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    // Função para buscar dados filtrados
    const buscarDados = async () => {
        if (!paciente || !dataInicio || !dataFim) {
            handleClick();
            
            return;
        }

        
        setIsLoading(true);

        try {
            const dataInicioFormatada = dayjs.utc(dataInicio).format("YYYY-MM-DD HH:mm:ss");
            const dataFimFormatada = dayjs.utc(dataFim).format("YYYY-MM-DD HH:mm:ss");
    
            const response = await axios.get(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/resumo-ia",
                {
                    params: {
                        paciente: paciente?.id || "",
                        data_inicio: dataInicioFormatada,
                        data_fim: dataFimFormatada,
                    },
                }
            );
    
            if (Array.isArray(response.data) && response.data.length > 0) {
                setResumo(response.data[0].resumo || "Nenhum resumo disponível.");
                setRecomendacao(response.data[0].recomendacao || "Nenhuma recomendação disponível.");
            } else {
                setResumo("Nenhum resumo encontrado.");
                setRecomendacao("Nenhuma recomendação encontrada.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setResumo("Erro ao carregar resumo.");
            setRecomendacao("Erro ao carregar recomendação.");
        } finally {
            setIsLoading(false);
        }
    };

    // Função para limpar os filtros e os resultados
    const limparFiltros = () => {
        setPaciente(null);
        setDataInicio(null);
        setDataFim(null);
        setResumo("");
        setRecomendacao("");
    };

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h1>Resumo IA</h1>

                <Box sx={{ display: "flex", flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
                    {/* Autocomplete para Pacientes */}
                    <Autocomplete
                        sx={{ flexGrow: 1 }}
                        options={pacientes || []}
                        getOptionLabel={(option) => option.nome}
                        value={paciente}
                        onChange={(event, newValue) => setPaciente(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Paciente"
                                required
                            />
                        )}
                    />

                    {/* DateTimePicker para Data Início */}
                    <DateTimePicker
                        label="Data Início"
                        value={dataInicio}
                        onChange={(newValue) => setDataInicio(newValue)}
                        format="DD/MM/YYYY HH:mm"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                            />
                        )}
                    />

                    {/* DateTimePicker para Data Fim */}
                    <DateTimePicker
                        label="Data Fim"
                        value={dataFim}
                        onChange={(newValue) => setDataFim(newValue)}
                        format="DD/MM/YYYY HH:mm"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                            />
                        )}
                    />
                </Box>

                {/* Botões de ação */}
                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={buscarDados} 
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Buscar"}
                    </Button>

                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={limparFiltros} 
                        startIcon={<DeleteIcon />}
                    >
                        Limpar
                    </Button>
                </Box>
            </LocalizationProvider>

            {/* Exibição do Resumo e Recomendação */}
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: 2 }}>
                    <CircularProgress size={50} />
                </Box>
            ) : (
                <>
                    <Card sx={{ marginTop: 2 }}>
                        <CardContent>
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} variant="h6">
                                Resumo <AutoStoriesIcon />
                            </Typography>
                            <Typography>{resumo}</Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ marginTop: 2 }}>
                        <CardContent>
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} variant="h6">
                                Recomendação <AutoAwesomeIcon />
                            </Typography>
                            <Typography>{recomendacao}</Typography>
                        </CardContent>
                    </Card>
                </>
            )}
             <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    >
                    Todos os campos são obrigatórios!
                    </Alert>
                </Snackbar>
        </Box>
    );
};

export default ResumoIA;
