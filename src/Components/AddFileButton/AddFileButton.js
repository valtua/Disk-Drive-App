import { Add } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';

import './AddFileButton.css';

function AddFileButton(props) {
    return (
        <Tooltip title="Añadir archivo">
            <Fab
                color="primary"
                aria-label="add"
                className="btnFileAdd"
                onClick={() => {
                    props.setModalAddFile(true);
                }}
            >
                <Add />
            </Fab>
        </Tooltip>
    );
}
export default AddFileButton;
