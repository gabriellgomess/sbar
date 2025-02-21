import './RecordButtom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Typography, Button } from '@mui/material';

const RecordButton = ({ onMouseDown, onMouseUp, isRecording, disabled }) => {
    return (
        <Button 
            className='record-buttom' 
            onMouseDown={onMouseDown} 
            onMouseUp={onMouseUp} 
            onTouchStart={onMouseDown} 
            onTouchEnd={onMouseUp} 
            disableRipple
            disabled={disabled}
            sx={{
                width: {xs: '260px', lg: '260px'}, 
                height:{xs: '260px', lg: '260px'},
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
        >                
            {isRecording ? 
                <Typography variant='caption' color='error' className="text-small">
                    Gravando <FontAwesomeIcon icon={faCircle} />
                </Typography> : 
                <Typography variant='caption' className="text-small">
                    {disabled ? "Selecione o profisisonal e o paciente" : "Gravar"} <FontAwesomeIcon icon={faMicrophone} />
                </Typography>
            }
        </Button>
    );
};

export default RecordButton;
