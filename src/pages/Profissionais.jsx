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
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    Box
} from "@mui/material";
import { MyContext } from "../components/MyContext/MyContext";

const Profissionais = () => {
    const { profissionais, addProfissional, editProfissional } = useContext(MyContext);

    // Estados para o formulário de cadastro
    const [nome, setNome] = useState("");
    const [funcao, setFuncao] = useState("");

    // Estados para edição
    const [editando, setEditando] = useState(false);
    const [profissionalEditando, setProfissionalEditando] = useState(null);

    // Adicionar novo profissional
    const handleAdicionar = async () => {
        if (!nome.trim()) return;
        await addProfissional(nome, funcao);
        setNome("");
        setFuncao("Enfermagem");
    };

    // Abrir modal de edição
    const handleEditar = (profissional) => {
        setProfissionalEditando({ ...profissional }); // Garante que o estado não é alterado diretamente
        setEditando(true);
    };

    // Salvar edição no banco de dados
    const handleSalvarEdicao = async () => {
        if (!profissionalEditando?.nome.trim()) return;
        await editProfissional(profissionalEditando);
        setEditando(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Formulário de Cadastro */}
            <h2>Cadastrar Profissional</h2>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <TextField
                label="Nome"
                variant="outlined"
                value={nome}
                onChange={(e) => setNome(e.target.value)}                
                sx={{ marginBottom: "10px", minWidth: {xs: '85vw', lg: '400px'} }}
            />               

            <FormControl sx={{ marginBottom: "10px", minWidth: {xs: '85vw', lg: '400px'}  }}>
                <InputLabel id="demo-simple-select-label">Função</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={funcao}
                label="Função"
                onChange={(e) => setFuncao(e.target.value)}
                >   <MenuItem value="">Selecione...</MenuItem>
                    <MenuItem value="enfermagem">Enfermeiro(a)</MenuItem>
                    <MenuItem value="tec_enfermagem">Técnico(a) de Enfermagem</MenuItem>
                    <MenuItem value="fisioterapeuta">Fisioterapeuta</MenuItem>
                    <MenuItem value="medico">Médico(a)</MenuItem>
                </Select>
            </FormControl> 
            </Box>
                    

            <Button variant="contained" color="primary" onClick={handleAdicionar} sx={{ mt: 2 }}>
                Adicionar
            </Button>

            {/* Tabela de Profissionais */}
            <h2 style={{ marginTop: "20px" }}>Lista de Profissionais</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Função</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profissionais.map((profissional) => (
                            <TableRow key={profissional.id}>
                                <TableCell>{profissional.id}</TableCell>
                                <TableCell>{profissional.nome}</TableCell>
                                <TableCell>{profissional.funcao}</TableCell>
                                <TableCell>{profissional.ativo === 1 ? "Ativo" : "Inativo"}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleEditar(profissional)}>
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
                <DialogTitle>Editar Profissional</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        fullWidth
                        value={profissionalEditando?.nome || ""}
                        onChange={(e) => setProfissionalEditando({ ...profissionalEditando, nome: e.target.value })}
                        sx={{ margin: '10px 0 5px 0' }}
                    />
                    {/* editar função */}
                    <FormControl fullWidth sx={{ margin: '10px 0 5px 0' }}>
                        <InputLabel>Função</InputLabel>
                        <Select
                            label="Função"
                            value={profissionalEditando?.funcao || ""}
                            onChange={(e) => setProfissionalEditando({ ...profissionalEditando, funcao: e.target.value })}
                        >
                            <MenuItem value="enfermagem">Enfermeiro(a)</MenuItem>
                            <MenuItem value="tec_enfermagem">Técnico(a) de Enfermagem</MenuItem>
                            <MenuItem value="fisioterapeuta">Fisioterapeuta</MenuItem>
                            <MenuItem value="medico">Médico(a)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ margin: '10px 0 5px 0' }}>
                        <InputLabel>Ativo/Inativo</InputLabel>
                        <Select
                            label="Ativo/Inativo"
                            value={profissionalEditando?.ativo ?? 1}
                            onChange={(e) => setProfissionalEditando({ ...profissionalEditando, ativo: Number(e.target.value) })}
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

export default Profissionais;
