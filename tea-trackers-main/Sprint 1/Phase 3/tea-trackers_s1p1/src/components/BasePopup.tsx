import { Box, Typography, IconButton, Grid, TextField } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { IProduct } from "../dto/IProduct";

interface BasePopUpProps {
  product: IProduct;
  onSave: (updatedProduct: IProduct) => void;
}

const BasePopUp: React.FC<BasePopUpProps> = ({ product, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState<IProduct>({ ...product });

  const handleEdit = () => {
    setEditMode(true);
    setEditedProduct({ ...product });
  };

  const handleSave = () => {
    onSave(editedProduct);
    setEditMode(false);
  };

  const handleInputChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.1)",
      }}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4}>
          <img
            alt="Tea Trackers"
            src="/assets/logo.png"
            style={{
              height: "5.5rem",
              borderRadius: 8,
              boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.1)",
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            {editedProduct.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
            {editedProduct.description}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1">
              <strong>ID:</strong> {editedProduct.id_product}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Quantité / Volume:</strong>{" "}
              {editMode ? (
                <TextField
                  type="number"
                  name="quantity_vol"
                  value={editedProduct.quantity_vol}
                  onChange={handleInputChangeEdit}
                  InputProps={{
                    sx: {
                      backgroundColor: "#fff",
                      borderRadius: 4,
                      padding: "8px 12px",
                    },
                  }}
                />
              ) : (
                editedProduct.quantity_vol
              )}{" "}
              <strong>{editedProduct.storage_unit}</strong>
            </Typography>
            <Typography variant="subtitle1">
              <strong>Fabricant:</strong>{" "}
              {editMode ? (
                <TextField
                  name="fabricant"
                  value={editedProduct.fabricant}
                  onChange={handleInputChangeEdit}
                  InputProps={{
                    sx: {
                      backgroundColor: "#fff",
                      borderRadius: 4,
                      padding: "8px 12px",
                    },
                  }}
                />
              ) : (
                editedProduct.fabricant
              )}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Num CAS:</strong> {editedProduct.cas_number}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Danger Score:</strong> {editedProduct.score_danger}
            </Typography>
          </Box>
          {editMode ? (
            <IconButton
              aria-label="save"
              onClick={handleSave}
              sx={{
                mt: 4,
                bgcolor: "#4caf50",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#388e3c",
                },
              }}
            >
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="edit"
              onClick={handleEdit}
              sx={{
                mt: 4,
                bgcolor: "#2196f3",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#1976d2",
                },
              }}
            >
              <ModeEditIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasePopUp;
