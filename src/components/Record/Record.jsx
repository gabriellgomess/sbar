import { useState, useRef, useContext } from "react";
import { 
    Box, Button, Select, MenuItem, TextField, 
    FormControlLabel, Switch, Typography, FormControl, 
    InputLabel, Snackbar, Alert, CircularProgress 
} from "@mui/material";
import axios from "axios";
import RecordButton from "../RecordButtom/RecordButtom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { PacientesContext } from "../PacientesContext/PacientesContext";

const Record = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState("");
    const [selectedPaciente, setSelectedPaciente] = useState("");
    const [textMessage, setTextMessage] = useState("");
    const [isAudioMode, setIsAudioMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const { pacientes, loading: loadingPacientes } = useContext(PacientesContext);

    const startRecording = async () => {
        if (!selectedPaciente) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioURL(url);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Erro ao acessar o microfone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const deleteAudio = () => {
        setAudioBlob(null);
        setAudioURL("");
    };

    const sendData = async () => {
        if (!selectedPaciente) {
            setSnackbar({ open: true, message: "Selecione um paciente!", severity: "warning" });
            return;
        }
        if (!textMessage && !audioBlob) {
            setSnackbar({ open: true, message: "Nenhum dado para enviar!", severity: "warning" });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("texto", textMessage || "");
        formData.append("paciente", selectedPaciente);
        formData.append("usuario", "gabriel.gomes@outlook.com");
        formData.append("nome", "Gabriel Gomes");

        if (audioBlob) {
            const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
            const audioFileName = `audio_${selectedPaciente}_${timestamp}.wav`;
            formData.append("audio", audioBlob, audioFileName);
            formData.append("path", "/public_html/audios/" + audioFileName);
        }

        try {
            const response = await axios.post(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/insere-dados",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200 && response.data.success) {
                setSnackbar({ open: true, message: "Dados enviados com sucesso!", severity: "success" });
                setTextMessage("");
                deleteAudio();
            } else {
                setSnackbar({ open: true, message: response.data.message || "Erro ao enviar dados!", severity: "error" });
            }
        } catch (error) {
            setSnackbar({ open: true, message: "Erro ao enviar dados!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="100%" sx={{ mt: 1, px: 2 }}>
            <Typography variant="h4" className="title">Passagem de plantão</Typography>
            <Typography variant="body1" className="text">Selecione o paciente e grave sua mensagem ou escreva o texto.</Typography>

            <FormControl fullWidth sx={{ maxWidth: 300 }}>
                <InputLabel>Selecione o Paciente</InputLabel>
                <Select
                    value={selectedPaciente}
                    onChange={(e) => setSelectedPaciente(e.target.value)}
                    label="Selecione o Paciente"
                    disabled={loadingPacientes}
                >
                    <MenuItem value=""><em>Selecione o paciente</em></MenuItem>
                    {pacientes.map((paciente) => (
                        <MenuItem key={paciente.id} value={paciente.id}>
                            {paciente.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedPaciente && (
                <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="caption">Paciente: <span style={{ fontStyle: 'italic' }}>{pacientes.find(p => p.id === selectedPaciente)?.nome}</span></Typography>
                    <Typography variant="caption">Sexo: <span style={{ fontStyle: 'italic' }}>{pacientes.find(p => p.id === selectedPaciente)?.sexo}</span></Typography>
                    <Typography variant="caption">Nascimento: <span style={{ fontStyle: 'italic' }}>{pacientes.find(p => p.id === selectedPaciente)?.nascimento.split('-').reverse().join('/')}</span></Typography>
                </Box>
            )}

            <FormControlLabel 
                control={<Switch checked={isAudioMode} onChange={() => setIsAudioMode(!isAudioMode)} />} 
                label={isAudioMode ? "Modo Áudio" : "Modo Texto"} 
            />

            {isAudioMode ? (
                <Box sx={{ userSelect: "none", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <RecordButton onMouseDown={startRecording} onMouseUp={stopRecording} isRecording={isRecording} disabled={!selectedPaciente || loading} />
                    {audioURL && <audio controls src={audioURL} style={{ marginTop: 10 }} />}
                    {audioBlob && (
                        <Box display="flex" justifyContent="center" gap={1} mt={2}>
                            <Button variant="contained" color="primary" onClick={sendData} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : <>Enviar <FontAwesomeIcon icon={faPaperPlane} /></>}
                            </Button>
                            <Button variant="outlined" color="error" onClick={deleteAudio} disabled={loading}>
                                Excluir <FontAwesomeIcon icon={faTrashCan} />
                            </Button>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                    <TextField 
                        multiline rows={3} 
                        placeholder="Digite sua mensagem..." 
                        value={textMessage} 
                        onChange={(e) => setTextMessage(e.target.value)} 
                        sx={{ width: "100%", maxWidth: 400, mt: 2 }} 
                        disabled={!selectedPaciente || loading} 
                    />
                    <Button variant="contained" color="primary" sx={{marginTop: '10px'}} onClick={sendData} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Enviar Texto"}
                    </Button>
                </Box>
            )}

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Record;
