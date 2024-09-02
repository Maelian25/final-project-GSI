import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Select,
  MenuItem,
  Grid,
  Switch,
} from "@mui/material";
import { Alert } from "@mui/material";
import { IProduct } from "../dto/IProduct";
import CircularProgress from '@mui/material/CircularProgress';

import { red } from "@mui/material/colors";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const AddForm: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [casNumber, setCasNumber] = useState<string>(""); //stock le casNumber
  const [productData, setProductData] = useState<any[]>([]); //Stock les données récuperées, puis rendu
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null); //permet de cliquer sur un produit et d'aller sur sa fiche d'entrée dans le stock
  const [quantityToAdd, setQuantityToAdd] = useState<string>(""); //La quantité a ajouter
  const [showAlert, setShowAlert] = useState<boolean>(false); //Pour mentionner la réussite de la sauvegarde
  const [bgColor, setBgColor] = useState<string>("#fff"); //Changer le bg color lorqu'on a fini
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true); //afficher le bouton save
  const [open, setOpen] = useState<boolean>(true); //open la popup
  const [manufacturer, setManufacturer] = useState<string | null>(
    "All Manufacturers"
  ); //gerer les fabricants
  const [loading, setLoading] = useState<boolean>(false);
  const [manufacturerOptions, setManufacturerOptions] = useState<
    Record<string, string>
  >({}); //gerer les fabircants au fur et a mesure qu'on recherche
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    string | null
  >(null); //choix des fabricants pour la liste déroulante
  const [allProducts, setAllProducts] = useState<IProduct[]>([]); //copie des produits charger (pour éviter de charger deux fois tous les produits)
  const [productNotFound, setProductNotFound] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
  const navigate = useNavigate()

  useEffect(() => {
    setIsSaveDisabled(
      quantityToAdd.trim() === "" ||
        !selectedProduct ||
        Number(quantityToAdd) <= 0 ||
        specialChars.test(quantityToAdd) ||
        isNaN(Number(quantityToAdd))
    );
  }, [quantityToAdd, selectedProduct]);

  //Rechercher par cas number
  const filterProductsByCasNumber = (products: any[], searchText: string) => {
    if (!searchText) {
      return [];
    }

    const searchNumber = parseInt(searchText); //on va tout le temps changer en int (peut etre a passer en string si jamais)

    return products.filter((product) => {
      const casNumber = parseInt(product.cas_number);

      if (
        !isNaN(casNumber) &&
        casNumber.toString().startsWith(searchNumber.toString())
      ) {
        return true;
      }

      return false;
    });
  };

  const handleFilterbyFabricant = (value: string) => {
    if (value === "All") {
      setProductData(allProducts);
    } else {
      const casNumberFilteredProducts = allProducts.filter(
        (product: IProduct) => product.cas_number.startsWith(casNumber)
      );
      const filteredProducts = casNumberFilteredProducts.filter(
        (product: IProduct) => product.fabricant === value
      );
      setProductData(filteredProducts);
    }
  };

  const handleCasNumberSearch = async (searchText: string) => {
    if (!searchText) {
      setCasNumber(""); // Réinitialiser le numéro CAS à une chaîne vide
      setSelectedManufacturer("All"); // Réinitialiser le fabricant sélectionné à "All"
      setProductData([]); // Réinitialiser les données du produit à une liste vide
      setManufacturerOptions({}); // Réinitialiser les options de fabricant à un objet vide
      setProductNotFound(false);
      return;
    }

    try {
      const response = await fetch(
        `https://tt-api.azurewebsites.net/produits/`
      );
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data); //on crée la copie de tous les produits pour plus tard
        const filteredProducts = filterProductsByCasNumber(data, searchText);
        setProductData(filteredProducts); //on a les produits filtrés
        const manufacturerOptions = filteredProducts.reduce((acc, product) => {
          acc[product.fabricant] = product.fabricant;
          return acc;
        }, {}); //on a la liste des fabricants dans les produits filtrés
        if (filteredProducts.length === 0) {
          setProductNotFound(true);
        } else {
          setProductNotFound(false);
        }
        setManufacturerOptions(manufacturerOptions); //on set la liste des fabricants

        setSelectedManufacturer("All"); //on set les fabricants sur tout pour ne pas avoir un pré-filtre
      } else {
        console.error(`Failed to fetch products!`);
        setProductData([]);
        setManufacturer(null);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductData([]);
      setManufacturer(null);
    }
  };

  //Lorsque l'on clique sur un des produits de la liste
  const handleProductSelect = (product: IProduct) => {
    setSelectedProduct(product);
    setCasNumber(product.cas_number);
    setManufacturer(product.fabricant);
    setProductData([]);
  };
  //on sauvegarde les données d'ajout dans le stock
  const handleSaveUpdatedProduct = async () => {
    
    if (selectedProduct && quantityToAdd !== "") {
      const updatedQuantity =
        selectedProduct.quantity_masse + Number(quantityToAdd);
      const updatedRoom = selectedProduct.salle + "1-r3-1," ;
      const updatedDate = selectedProduct.date + new Date(Date.now()).toLocaleString() + ",";

      console.log(updatedQuantity);
      console.log(selectedProduct.salle);

      /*const productUtilisation = {
        username: user?.username as string,
        id_product: selectedProduct.id_product,
        quantity_masse: selectedProduct.quantity_masse,
        date: new Date(Date.now()).toLocaleString(),
        localisation: "salle",
      };*/

      await fetch(
        `https://tt-api.azurewebsites.net/produit/${selectedProduct.id_product}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "quantity_masse": updatedQuantity, "salle" : updatedRoom, "date": updatedDate}),
        }
      );
      
      await fetch(`https://tt-api.azurewebsites.net/produits/`);
      /*await fetch(
          `https://tt-api.azurewebsites.net/users/${user?.username}/article_user/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productUtilisation),
          }
        );*/
      setSelectedProduct(updatedQuantity);
      setLoading(true);
      setShowAlert(true);
      setBgColor("#fff59d");
      setQuantityToAdd("");
      setCasNumber("");
      setTimeout(() => {
        setOpen(false);
        handleClose();
        setSelectedProduct(null);
        window.location.reload();
        setLoading(false);
      }, 1500);
      console.log(selectedProduct.quantity_masse);
      
    } else {
      // Sinon, on filtre les produits par le fabricant sélectionné
      const productsByManufacturer = allProducts.filter(
        (product: IProduct) => product.fabricant === selectedManufacturer
      );
      setProductData(productsByManufacturer);
    }
    
  };

  const renderProductData = () => (
    <>
      <Typography
        variant="h5"
        gutterBottom
        style={{
          color: "#333",
          alignContent: "center",
          marginBottom: "16px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        Add Product Receptions
      </Typography>

      {/*<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple />*/}
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            id="outlined-basic"
            label="Cas Number"
            variant="outlined"
            value={casNumber}
            onChange={(e) => {
              setCasNumber(e.target.value);
              handleCasNumberSearch(e.target.value);
            }}
            sx={{
              width: "200px", // Largeur personnalisée ajustée

              marginBottom: "16px",
              marginLeft: "30px",
              "& label": {
                fontFamily: "Arial, sans-serif",
                color: "#666",
              },
              "& input": {
                fontFamily: "Arial, sans-serif",
                color: "#333",
              },
              "& fieldset": {
                borderColor: "#ccc",
              },
              "&:hover fieldset": {
                borderColor: "#aaa",
              },
              "&:focus fieldset": {
                borderColor: "#555",
              },
            }}
          />
        </Grid>
        {manufacturerOptions && (
          <Grid item style={{ alignSelf: "flex-start" }}>
            <div style={{ marginBottom: "16px", marginRight: "30px" }}>
              <Select
                id="outlined-basic"
                sx={{
                  "& label": {
                    fontFamily: "Arial, sans-serif",
                    color: "#666",
                    "&.Mui-focused": {
                      color: "#666", // Couleur du texte lorsque la boîte de sélection est active
                    },
                  },
                  "& .MuiInputBase-root": {
                    color: "#333", // Couleur du texte de la boîte de sélection
                  },
                }}
                value={selectedManufacturer || "All"}
                onChange={(e) => {
                  setSelectedManufacturer(e.target.value as string);
                  handleFilterbyFabricant(e.target.value as string);
                }}
                variant="outlined"
                style={{ width: "200px" }}
              >
                <MenuItem value="All">All Manufacturers</MenuItem>
                {Object.entries(manufacturerOptions).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Grid>
        )}
      </Grid>

      {productNotFound && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2
            style={{
              color: "red",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
            }}
          >
            Le produit que vous recherchez n'existe pas actuellement.
          </h2>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: "10px" }}>
            Vous pouvez envisager de l'ajouter à la base de données. Verifiez le
            cas
          </p>

          <p style={{ fontFamily: "Arial, sans-serif", fontSize: "10px" }}>
            Cas actuel = {casNumber}
          </p>

          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              textDecoration: "none",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              marginTop: "10px",
              fontSize: "10px",
            }}
            onClick={() => {
              // Close the current popup
              setOpen(false);
              // Open the "Create Product" popup
              //setCreateProductOpen(true);
            }}
          >
            Créer le produit
          </button>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {productData.map((product: IProduct) => (
          <li
            key={product.id_product}
            onClick={() => handleProductSelect(product)}
            style={{
              padding: "8px",
              margin: "8px 0",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.3s ease",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textDecoration: "none",
              color: "#333",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e0e0e0";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f9f9f9";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {`Cas Number: ${product.cas_number} - ID: ${product.id_product} - Name: ${product.name} - Fabricant : ${product.fabricant}`}
          </li>
        ))}
      </ul>
    </>
  );

  const renderQuantityToAddInfo = () => {
    let quantityInfo = "";
    if (quantityToAdd.trim() !== "") {
      if (!isNaN(Number(quantityToAdd))) {
        if (Number(quantityToAdd) < 0) {
          quantityInfo = `Can't add negative/null values`;
        } else {
          quantityInfo = `Adding this quantity: ${Number(quantityToAdd)} ${
            selectedProduct.storage_unit
          }`;
        }
      } else {
        quantityInfo = `That doesn't make any sense!`;
      }
    }

    return (
      <Typography
        variant="body2"
        sx={{ marginTop: 1, color: red[500], fontSize: "14px" }}
      >
        {quantityInfo}
      </Typography>
    );
  };

  const renderSelectedProduct = () => (
    <Box
      sx={{
        marginTop: 3,
        transition:
          "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
        transform: quantityToAdd ? "scale(1.02)" : "scale(1)",
        backgroundColor: bgColor,
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
        textAlign: "left",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        style={{ color: "#333", fontWeight: "bold" }}
      >
        Cas Number: {selectedProduct.cas_number}
        ID : {selectedProduct.id_product}
      </Typography>
      <Typography variant="h6" gutterBottom style={{ color: "#444" }}>
        Product Name: {selectedProduct.name}
      </Typography>
      <Typography variant="body1" gutterBottom style={{ color: "#666" }}>
        Fabricant: {selectedProduct.fabricant}
      </Typography>
      <Typography variant="body1" gutterBottom style={{ color: "#666" }}>
        Current Quantity: {selectedProduct.quantity_masse}{" "}
        {selectedProduct.storage_unit}
      </Typography>
      <Typography variant="body1" gutterBottom style={{ color: "#888" }}>
        Date: {new Date(Date.now()).toLocaleString()}
      </Typography>
      <TextField
        label="Quantity Received Physically"
        type="text"
        value={quantityToAdd}
        onChange={(e) => setQuantityToAdd(e.target.value)}
        variant="outlined"
        sx={{ marginBottom: 1, width: "100%" }}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSaveUpdatedProduct();
        }}
      />
      {renderQuantityToAddInfo()}
      <Button
  variant="contained"
  onClick={handleSaveUpdatedProduct}
  disabled={isSaveDisabled || loading} // Désactiver le bouton lors du chargement
  style={{ marginTop: "12px" }}
>
  {loading ? <CircularProgress size={24} /> : "Save"}
</Button>
    </Box>
  );

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease-in-out",
        backgroundColor: bgColor,
      }}
    >
      {open &&
        (selectedProduct ? renderSelectedProduct() : renderProductData())}

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

export default AddForm;
