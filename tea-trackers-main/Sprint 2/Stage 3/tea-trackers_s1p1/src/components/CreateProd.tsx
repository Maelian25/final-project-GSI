// CreateProd.tsx
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

const CreateProd: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [product, setProduct] = useState({
    name: "",
    fabricant: "",
    score_danger: 0,
    cas_number: "",
    quantity_masse: 0,
    quantity_vol: 0,
    description: "",
    etat_physique: "",
    cid_number: 0,
    phase_risque: "",
    classif_sgh: "",
    icpe: "",
    pH: 0,
    temp_ebullition: 0,
    pression_vapeur: 0,
    code_tunnel: "",
    danger_codes: "",
    salle: "",
    date: "",
    storage_unit: "",
    id_db: "",
  });

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#fff");
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsSaveDisabled(
      product.name.trim() === "" ||
      product.fabricant.trim() === "" ||
      product.cas_number.trim() === "" ||
      product.description.trim() === "" ||
      product.etat_physique.trim() === "" ||
      product.phase_risque.trim() === "" ||
      product.classif_sgh.trim() === "" ||
      product.icpe.trim() === "" ||
      product.code_tunnel.trim() === "" ||
      product.salle.trim() === "" ||
      product.storage_unit.trim() === "" ||
      product.id_db.trim() === ""
    );
  }, [product]);

  const handleSave = async () => {
    try {
      const response = await fetch("https://tt-api.azurewebsites.net/produit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setBgColor("#f8e71c");
        setShowAlert(true); // Afficher la pop-up après avoir sauvegardé les données
        setTimeout(() => {
          handleClose();
        }, 1500); // Temps en millisecondes (1.5 secondes avant la fermeture)
      } else {
        // Gérer les erreurs en fonction de la réponse de l'API
        console.error("Erreur lors de la création du produit.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du produit.", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease-in-out',
        backgroundColor: bgColor,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create Product
      </Typography>
      <form>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <TextField
          label="Fabricant"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.fabricant}
          onChange={(e) => setProduct({ ...product, fabricant: e.target.value })}
        />
        <TextField
          label="CAS Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.cas_number}
          onChange={(e) => setProduct({ ...product, cas_number: e.target.value })}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
        <TextField
          label="Physical State"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.etat_physique}
          onChange={(e) => setProduct({ ...product, etat_physique: e.target.value })}
        />
        <TextField
          label="Risk Phase"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.phase_risque}
          onChange={(e) => setProduct({ ...product, phase_risque: e.target.value })}
        />
        <TextField
          label="Classification SGH"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.classif_sgh}
          onChange={(e) => setProduct({ ...product, classif_sgh: e.target.value })}
        />
        <TextField
          label="ICPE"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.icpe}
          onChange={(e) => setProduct({ ...product, icpe: e.target.value })}
        />
        <TextField
          label="Tunnel Code"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.code_tunnel}
          onChange={(e) => setProduct({ ...product, code_tunnel: e.target.value })}
        />
        <TextField
          label="Danger Codes"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.danger_codes}
          onChange={(e) => setProduct({ ...product, danger_codes: e.target.value })}
        />
        <TextField
          label="Room"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.salle}
          onChange={(e) => setProduct({ ...product, salle: e.target.value })}
        />
        <TextField
          label="Date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.date}
          onChange={(e) => setProduct({ ...product, date: e.target.value })}
        />
        <TextField
          label="Storage Unit"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.storage_unit}
          onChange={(e) => setProduct({ ...product, storage_unit: e.target.value })}
        />
        <TextField
          label="DB ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={product.id_db}
          onChange={(e) => setProduct({ ...product, id_db: e.target.value })}
        />
      </form>
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isSaveDisabled}
        sx={{ marginTop: '20px' }}
      >
        Save
      </Button>
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
      >
        <Alert onClose={() => setShowAlert(false)} severity="success">
          Data Saved Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProd;
