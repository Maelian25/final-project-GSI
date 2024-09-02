import { Box, Typography, IconButton, Grid, TextField } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { useContext, useEffect, useState } from "react";
import { IProduct } from "../dto/IProduct";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

interface BasePopUpProps {
  product: IProduct;
  onSave: (updatedProduct: IProduct) => void;
}

interface IFavorite {
  id_product: number;
 }

const BasePopUp: React.FC<BasePopUpProps> = ({ product, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState<IProduct>({ ...product });
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const unauthorizedRoles = ['User', 'CNRS', 'LCC', 'INP'];

  const handleEdit = () => {
    setEditMode(true);
    setEditedProduct({ ...product });
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Replace this URL with the correct endpoint to get all favorites for a user
      const url = `https://tt-api.azurewebsites.net/favoris/user/${user?.username}`;
      const response = await fetch(url);
      const favorites = await response.json();
      const isCurrentProductInFavorites = favorites.some((favorite:IFavorite) => favorite.id_product === product.id_product);
      setIsFavorite(isCurrentProductInFavorites);
      setIsLoading(false);
    };
   
    checkFavoriteStatus();
   }, []);

  const handleSave = () => {
    onSave(editedProduct);
    setEditMode(false);
  };
  const toggleFavorite = async () => {
    const newFavoriteStatus = !isFavorite;
    // If trying to remove from favorites, show confirmation dialog
    if (isFavorite && !window.confirm("Are you sure you want to remove this product from your favorites?")) {
    return; // Early return if user does not confirm
  }

    setIsFavorite(newFavoriteStatus);
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR')}`;
    
    console.log(user?.username)
    const url = `https://tt-api.azurewebsites.net/favoris`; 

    if (newFavoriteStatus) {
      // Make a POST request to add the product to the favorites 
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
           
          },
          body: JSON.stringify({ "id_product": product.id_product, "username": user?.username, "date": dateStr}),
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }else {
          alert(`Added to Favorites at :${dateStr}`) ;
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        setIsFavorite(!newFavoriteStatus); // Revert the favorite status on error
      }
    } else {
      // Fetch the list of favorites for the user
      const response = await fetch(`${url}/user/${user?.username}`);
      const favorites = await response.json();
      console.log(response)
      console.log(favorites)
      // Find the favorite that matches the product
      const favorite = favorites.find((fav: IFavorite) => fav.id_product === product.id_product);
   
      if (favorite) {
        // Send a DELETE request to server with the id_favoris
        try {
          const deleteResponse = await fetch(`${url}/${favorite.id_favoris}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              
            },
          });
   
          if (!deleteResponse.ok) {
            throw new Error('Failed to remove favorite');
          }else{
            
          }
        } catch (error) {
          console.error('Error removing favorite:', error);
          setIsFavorite(!newFavoriteStatus); // Revert the favorite status on error
        }
      } else {
        console.log('No favorite found for this product');
      }
    }
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
          {isLoading ? (
 <div>Loading...</div>
) : (
 <IconButton
   aria-label="toggle favorite"
   onClick={toggleFavorite}
   sx={{
     mt: 4,
     bgcolor: isFavorite ? '#ff4081' : '#2196f3',
     color: '#fff',
     '&:hover': {
       bgcolor: isFavorite ? '#f50057' : '#1976d2',
     },
   }}
 >
   {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
 </IconButton>
)}
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
                  value={editedProduct.quantity_masse}
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
          {user && !unauthorizedRoles.includes(user.user_type) && (
            editMode ? (
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
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasePopUp;
