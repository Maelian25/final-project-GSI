import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IProduct } from "../dto/IProduct";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import ResponsiveAppBar from "./AppBarPopUp";
import { Jsme } from "jsme-react";

interface JSMEPopupScreenProps {
    open: boolean;
    setJsmePopup: React.Dispatch<React.SetStateAction<boolean>>;
    smiles: string;
    setSmiles: React.Dispatch<React.SetStateAction<string>>;
  }
  

const Transition = React.forwardRef(function Transition(
  Props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...Props} />;
});

const JSMEPopupScreen: React.FC<JSMEPopupScreenProps> = ({
  open,
  setJsmePopup,
  smiles,
  setSmiles,
}) => {

    const [tempSmiles, setTempSmiles] = React.useState<string>("");
    const handleClose = () => {
        setJsmePopup(false);
        setSmiles(tempSmiles);
    };
    const handleCancel = () => {
      setJsmePopup(false);
    };
  if (!open) {
    return null;
  }

  const logSmiles = (smiles:any) => {
    console.log(smiles)
    setTempSmiles(smiles);
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        square: true,
        elevation: 0,
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Editeur Molécule</Typography>
      </DialogTitle>

      <div style={{height:"50vh", width:"50vw", overflow:"hidden"}}>
        <Jsme height="50vh" width="60vw" options=""  onChange={logSmiles}/>
      </div>

      <DialogContent>
        SMILES : {tempSmiles}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Apply
        </Button>
        <Button onClick={handleCancel} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JSMEPopupScreen;