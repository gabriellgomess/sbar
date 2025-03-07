import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
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
    Autocomplete,
    Collapse,
    Divider
} from "@mui/material";

import Swal from "sweetalert2";

import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import { MyContext } from "../components/MyContext/MyContext";

const Historico = () => {
    const { pacientes, fetchPacientes, profissionais, loadingProfissionais, loading: loadingPacientes } = useContext(MyContext);
    const [pacienteId, setPacienteId] = useState("");
    const [profissionalId, setProfissionalId] = useState("");

    // Define o período inicial (últimas 11 horas)
    const getDefaultDates = () => {
        const now = new Date();
        const past = new Date(now.getTime() - 11 * 60 * 60 * 1000); // Subtrai 11 horas

        const formatDate = (date) => {
            date.setHours(date.getHours() - 3);
            return date.toISOString().slice(0, 16);
        };

        return {
            dataInicio: formatDate(past),
            dataFim: formatDate(now),
        };
    };

    const [dataInicio, setDataInicio] = useState(getDefaultDates().dataInicio);
    const [dataFim, setDataFim] = useState(getDefaultDates().dataFim);
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [registroEditado, setRegistroEditado] = useState(null);

    // Estados para Paginação
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Função para buscar dados
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/busca-dados",
                {
                    id_paciente: pacienteId || null,
                    id_profissional: profissionalId || null,
                    data_inicio: dataInicio || null,
                    data_fim: dataFim || null
                },
                { headers: { "Content-Type": "application/json" } }
            );
            setDados(Array.isArray(response.data) ? response.data : []);

        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Erro ao carregar os dados.");
            setDados([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Manipulação da paginação
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
            const response = await axios.put(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/update",
                registroEditado,
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (response.data.success) {
                Swal.fire({
                    title: "Registro atualizado!",
                    text: "Registro atualizado com sucesso.",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: 'swal2-custom-zindex' // Define uma classe para personalização
                    }
                });
                fetchPacientes();
                handleCloseModal();
            } else {
                handleCloseModal();
                Swal.fire({
                    title: "Erro ao atualizar o registro!",
                    text: response.data.message,
                    icon: "error",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: 'swal2-custom-zindex'
                    }
                });
            }
        } catch (error) {
            console.error("Erro ao atualizar o registro:", error);
            handleCloseModal();
            Swal.fire({
                title: "Erro!",
                text: "Ocorreu um erro ao atualizar o registro.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'swal2-custom-zindex'
                }
            });
        }
    };
    
    

    return (
        <Box sx={{ mt: 1, px: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Linha do Tempo
            </Typography>

            {/* Campos de Filtros */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mb: 2 }}>
                <Autocomplete
                    sx={{ minWidth: { xs: '100%', lg: '200px' } }}
                    options={profissionais}
                    getOptionLabel={(option) => option.nome}
                    value={profissionalId ? profissionais.find(p => p.id === profissionalId) || null : null}
                    onChange={(event, newValue) => setProfissionalId(newValue ? newValue.id : "")}
                    disabled={loadingProfissionais}
                    renderInput={(params) => <TextField {...params} label="Profissional" variant="outlined" />}
                />
                <Autocomplete
                    sx={{ minWidth: { xs: '100%', lg: '200px' } }}
                    options={pacientes}
                    getOptionLabel={(option) => option.nome}
                    value={pacienteId ? pacientes.find(p => p.id === pacienteId) || null : null}
                    onChange={(event, newValue) => setPacienteId(newValue ? newValue.id : "")}
                    disabled={loadingPacientes}
                    renderInput={(params) => <TextField {...params} label="Paciente" variant="outlined" />}
                />

                <TextField
                    sx={{ minWidth: { xs: '100%', lg: '200px' } }}
                    label="Data Início"
                    type="datetime-local"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                />

                <TextField
                    sx={{ minWidth: { xs: '100%', lg: '200px' } }}
                    label="Data Fim"
                    type="datetime-local"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                />

                <Button variant="contained" color="primary" onClick={fetchData}>
                    Buscar
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>
                    Limpar
                </Button>
            </Box>

            {/* Exibição dos Dados */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell sx={{fontWeight: 'bold'}}>Paciente</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Profissional</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Data</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Audio</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Editar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dados?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                <Row key={item.id} row={item} handleOpenModal={() => handleOpenModal(item)} />

                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={dados.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        labelRowsPerPage="Linhas por página"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
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
                            required
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
                            required
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
                            required
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

// Componente da linha colapsável
const Row = ({ row, handleOpenModal }) => {
    const [open, setOpen] = useState(false);
    console.log("row: ", row);
    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.nome_paciente}</TableCell>
                <TableCell>{row.nome_profissional}</TableCell>
                <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                <TableCell>
                    {row.path_audio ? (
                        <audio controls style={{maxWidth: '250px'}} src={`https://sbar.nexustech.net.br${row.path_audio.split('public_html')[1]}`} />
                    ) : (
                        "Nenhum áudio"
                    )}
                </TableCell>
                <TableCell>
                    <IconButton color="primary" onClick={handleOpenModal}>
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6">Detalhes</Typography>
                            <Divider sx={{margin: '5px'}} />
                            <Typography><span style={{fontWeight: 'bold'}}>Situação:</span> {row.situacao}</Typography>
                            <Divider sx={{margin: '5px'}} />
                            <Typography><span style={{fontWeight: 'bold'}}>Histórico:</span> {row.background ? row.background : row.historico_paciente ? row.historico_paciente : ''}</Typography>
                            <Divider sx={{margin: '5px'}} />
                            <Typography><span style={{fontWeight: 'bold'}}>Avaliação:</span> {row.avaliacao}</Typography>
                            <Divider sx={{margin: '5px'}} />
                            <Typography><span style={{fontWeight: 'bold'}}>Recomendação:</span> {row.recomendacao}</Typography>
                            <Divider sx={{margin: '5px'}} />
                            <Typography><span style={{fontWeight: 'bold'}}>Sugestão IA:</span> {row.sugestao_ia}</Typography>
                            <Divider sx={{margin: '5px'}} />
                            <Typography sx={{fontSize: '12px'}}>*Texto origem: {row.texto_usuario}</Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default Historico;
