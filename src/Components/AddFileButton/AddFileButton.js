import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";

import "./AddFileButton.css";

function AddFileButton(props) {
  return (
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
  );
}
export default AddFileButton;