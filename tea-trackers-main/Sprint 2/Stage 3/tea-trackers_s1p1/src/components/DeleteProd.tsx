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
} from "@mui/material";
import { Alert } from "@mui/material";
import { IProduct } from "../dto/IProduct";
import CircularProgress from '@mui/material/CircularProgress';
import { red } from "@mui/material/colors";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const DeleteProd: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true);
  const [casNumber, setCasNumber] = useState<string>("");
  const [productData, setProductData] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#fff");
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(true);
  const [manufacturer, setManufacturer] = useState<string | null>("All Manufacturers");
  const [loading, setLoading] = useState<boolean>(false);
  const [manufacturerOptions, setManufacturerOptions] = useState<Record<string, string>>({});
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [productNotFound, setProductNotFound] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
  const navigate = useNavigate();


//useEffect
useEffect(() => {
  setIsSubmitDisabled(!selectedProduct);
}, [selectedProduct]);

useEffect(() => {
  setIsDeleteDisabled(!productData||!selectedProduct);
}, [productData,selectedProduct]);


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



  const handleDelete = async () => {
    if (selectedProduct) {
      await fetch(
        `https://tt-api.azurewebsites.net/produit/${selectedProduct.id_product}`,
        {
          method: "DELETE",
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
      setSelectedProduct(null);
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
/*
  useEffect(() => {
    setProductData(null);
    setBgColor("#fff");
  }, [productId]);
*/










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
      Delete Product From Stock 
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
          Cas actuel = {casNumber}
        </p>

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

const renderSelectedProduct = () => (
  <Box
    sx={{
      maxWidth: 800,
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
    <Typography variant="h5" gutterBottom>
      Delete selected Product
    </Typography>
    {selectedProduct && (
      <Box
        sx={{
          marginTop: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Product Name: {selectedProduct.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Current Quantity: {selectedProduct.quantity_masse}
        </Typography>
        <Button
          variant="contained"
          color="error" // Correction 1: Utiliser la couleur "error" pour le rouge
          onClick={handleDelete}
          disabled={isDeleteDisabled}
          sx={{ mt: 2 }} // Correction 2: Ajouter un espacement en haut du bouton
        >
          Delete Product
        </Button>
      </Box>
    )}
  </Box>
);
return (
  <Box
    sx={{
      maxWidth: 800,
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
    {open && (selectedProduct ? renderSelectedProduct() : renderProductData())}

    <Snackbar
      open={showAlert}
      autoHideDuration={3000}
      onClose={() => setShowAlert(false)}
    >
      <Alert onClose={() => setShowAlert(false)} severity="success">
        Product Deleted Successfully!
      </Alert>
    </Snackbar>
  </Box>
);
};

export default DeleteProd;