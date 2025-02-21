import React, { useState, useContext } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    MenuItem,
    InputLabel,
    FormControl,
    Select
} from "@mui/material";
import { MyContext } from "../components/MyContext/MyContext";

const Pacientes = () => {
    const { pacientes, addPaciente, editPaciente } = useContext(MyContext);

    // Estados para o formulário de cadastro
    const [nome, setNome] = useState("");
    const [historico, setHistorico] = useState("");

    // Estados para edição
    const [editando, setEditando] = useState(false);
    const [pacienteEditando, setPacienteEditando] = useState(null);

    // Adicionar novo paciente
    const handleAdicionar = async () => {
        if (!nome.trim()) return;
        await addPaciente(nome, historico);
        setNome("");
        setHistorico("");
    };

    // Abrir modal de edição
    const handleEditar = (paciente) => {
        setPacienteEditando({ ...paciente });
        setEditando(true);
    };

    // Salvar edição no banco de dados
    const handleSalvarEdicao = async () => {
        if (!pacienteEditando?.nome.trim()) return;
        await editPaciente(pacienteEditando);
        setEditando(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Formulário de Cadastro */}
            <h2>Cadastrar Paciente</h2>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flexWrap: 'wrap' }}>
                <TextField
                    label="Nome"
                    variant="outlined"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    sx={{ marginBottom: "10px", minWidth: { xs: '85vw', lg: '400px' } }}
                />
                <TextField
                    label="Histórico"
                    variant="outlined"
                    value={historico}
                    multiline
                    rows={6}
                    onChange={(e) => setHistorico(e.target.value)}
                    sx={{ marginBottom: "10px", minWidth: { xs: '85vw', lg: '400px' } }}
                />
            </Box>

            <Button variant="contained" color="primary" onClick={handleAdicionar} sx={{ mt: 2 }}>
                Adicionar
            </Button>

            {/* Tabela de Pacientes */}
            <h2 style={{ marginTop: "20px" }}>Lista de Pacientes</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Histórico</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Editar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pacientes.map((paciente) => (
                            <TableRow key={paciente.id}>
                                <TableCell>{paciente.id}</TableCell>
                                <TableCell>{paciente.nome}</TableCell>
                                <TableCell>{paciente.historico}</TableCell>
                                <TableCell>{paciente.ativo ? "Ativo" : "Inativo"}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleEditar(paciente)}>
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de Edição */}
            <Dialog open={editando} onClose={() => setEditando(false)}>
                <DialogTitle>Editar Paciente</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        fullWidth
                        value={pacienteEditando?.nome || ""}
                        onChange={(e) => setPacienteEditando({ ...pacienteEditando, nome: e.target.value })}
                        sx={{ margin: '10px 0 5px 0' }}
                    />
                    <TextField
                        label="Histórico"
                        fullWidth
                        value={pacienteEditando?.historico || ""}
                        onChange={(e) => setPacienteEditando({ ...pacienteEditando, historico: e.target.value })}
                        sx={{ margin: '10px 0 5px 0' }}
                    />
                    <FormControl fullWidth sx={{ margin: '10px 0 5px 0' }}>
                        <InputLabel>Ativo/Inativo</InputLabel>
                        <Select
                            label="Ativo/Inativo"
                            value={pacienteEditando?.ativo ?? 1}
                            onChange={(e) => setPacienteEditando({ ...pacienteEditando, ativo: Number(e.target.value) })}
                        >
                            <MenuItem value={1}>Ativo</MenuItem>
                            <MenuItem value={0}>Inativo</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setEditando(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSalvarEdicao} color="primary">Salvar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Pacientes;
