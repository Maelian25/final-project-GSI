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

interface ProductPopupProps {
  open: boolean;
  onClose: () => void;
  product: IProduct;
}

const Transition = React.forwardRef(function Transition(
  Props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...Props} />;
});

const ProductPopup: React.FC<ProductPopupProps> = ({
  open,
  onClose,
  product,
}) => {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        square: true,
        elevation: 0,
      }}
    >
      <DialogTitle>
        <Typography variant="h6">{product.name}</Typography>
      </DialogTitle>

      <DialogContent>
        <ResponsiveAppBar product={product} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductPopup;
