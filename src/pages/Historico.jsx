import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Autocomplete
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { MyContext } from "../components/MyContext/MyContext";

const Historico = () => {
    const [pacienteId, setPacienteId] = useState("");
    const { pacientes, loading: loadingPacientes } = useContext(MyContext);
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [registroEditado, setRegistroEditado] = useState(null);

    const fetchPacienteData = async () => {
        if (!pacienteId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/busca-dados",
                { id: pacienteId },
                { headers: { "Content-Type": "application/json" } }
            );
            setDados(response.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Erro ao carregar os dados.");
            setLoading(false);
            setDados([]);
        }
    };

    useEffect(() => {
        fetchPacienteData();
    }, [pacienteId]);

    useEffect(() => {
        if (pacienteId === "") {
            setDados([]);
        }
    }, [pacienteId]);

    const handleOpenModal = (registro) => {
        setRegistroEditado(registro);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setRegistroEditado(null);
    };

    const handleChange = (e) => {
        setRegistroEditado({
            ...registroEditado,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/update",
                registroEditado,
                { headers: { "Content-Type": "application/json" } }
            );
            fetchPacienteData();
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao atualizar o registro:", error);
        }
    };

    return (
        <Box sx={{ mt: 1, px: 2 }}>
            <Typography variant="h4" className="title" align="center" gutterBottom>
                Linha do Tempo
            </Typography>

            <Box sx={{ maxWidth: 300, margin: "auto", mb: 2 }}>
                <Autocomplete
                    options={pacientes}
                    getOptionLabel={(option) => option.nome}
                    value={pacienteId ? pacientes.find(p => p.id === pacienteId) : null}
                    onChange={(event, newValue) => {
                        setPacienteId(newValue ? newValue.id : "");
                    }}
                    disabled={loadingPacientes}
                    renderInput={(params) => (
                        <TextField {...params} label="Selecione o Paciente" variant="outlined" />
                    )}
                />
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">{error}</Typography>
            ) : (
                dados.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Paciente</TableCell>                                    
                                    <TableCell>Situação</TableCell>
                                    <TableCell>Histórico</TableCell>
                                    <TableCell>Avaliação</TableCell>
                                    <TableCell>Recomendação</TableCell>
                                    <TableCell>Sugestão IA</TableCell>
                                    <TableCell>Profissional</TableCell>
                                    <TableCell>Áudio</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Editar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dados.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nome_paciente}</TableCell>
                                        <TableCell>{item.situacao}</TableCell>
                                        <TableCell>{item.background}</TableCell>
                                        <TableCell>{item.avaliacao}</TableCell>
                                        <TableCell>{item.recomendacao}</TableCell>
                                        <TableCell>{item.sugestao_ia}</TableCell>
                                        <TableCell sx={{display: 'flex', flexDirection: 'column'}}>{item.nome_profissional}<span style={{fontSize: '12px', color: 'grey'}}>{item.funcao_profissional}</span></TableCell>
                                        <TableCell>
                                            {item.path_audio ? (
                                                <audio controls style={{ width: '180px' }} src={`https://sbar.nexustech.net.br${item.path_audio.split('public_html')[1]}`} />
                                            ) : (
                                                "Nenhum áudio"
                                            )}
                                        </TableCell>
                                        <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <IconButton aria-label="edit" color="primary">
                                                <EditIcon onClick={() => handleOpenModal(item)} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography align="center">Nenhum registro encontrado.</Typography>
                )
            )}

            {registroEditado && (
                <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth='lg'>
                    <DialogTitle>Editar Registro</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
                        <TextField
                            sx={{ marginTop: '10px' }}
                            multiline
                            rows={4}
                            maxRows={10}
                            fullWidth
                            label="Situação"
                            name="situacao"
                            value={registroEditado.situacao}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ marginTop: '10px' }}
                            multiline
                            rows={4}
                            maxRows={10}
                            fullWidth
                            label="Background"
                            name="background"
                            value={registroEditado.background}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ marginTop: '10px' }}
                            multiline
                            rows={4}
                            maxRows={10}
                            fullWidth
                            label="Avaliação"
                            name="avaliacao"
                            value={registroEditado.avaliacao}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ marginTop: '10px' }}
                            multiline
                            rows={4}
                            maxRows={10}
                            fullWidth
                            label="Recomendação"
                            name="recomendacao"
                            value={registroEditado.recomendacao}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSaveEdit} variant="contained">Salvar</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default Historico;
