import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { IProduct } from "./dto/IProduct";
import ProductCard from "./components/ProductCard";
import { useNavigate } from "react-router-dom";
import TopMenu from "./components/TopMenuBar";
import { Grid, Box, Pagination } from "@mui/material";

interface DataItem {
    id_product: string | number;
}

const Favorites: React.FC = () => {
    const { user } = useContext(UserContext);
    const [favorites, setFavorites] = useState<IProduct[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of favorites for the user
        const url = `https://tt-api.azurewebsites.net/favoris/user/${user?.username}`;
        fetch(url)
            .then(response => response.json())
            .then((data: DataItem[]) => {
                const productIds = data.map(item => item.id_product);
                console.log(productIds);
                Promise.all(productIds.map(id => fetch(`https://tt-api.azurewebsites.net/produit?produit_id=${id}`).then(res => res.json())))
                    .then(products => setFavorites(products))
                    .catch(error => console.error('Error fetching favorites:', error));
            });
    }, [user]);
    console.log(favorites);

    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = favorites.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(favorites.length / itemsPerPage);

    
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
        setCurrentPage(value);
      };

    return (
        
        <div style={{ marginTop: '3.5rem', padding: '1rem' }}>
            <TopMenu/>
            <Box sx={{ textAlign: 'center',marginBottom: '20px', marginTop: '20px', fontSize: '2rem', color: '#777' }}>
    Vos produits favoris
</Box>
            <Grid container spacing={2} style={{ justifyContent: 'center' , padding: '0.5rem' }}>
    {currentItems.map((product: IProduct, index: number) => (
        <div
            key={product.id_product}
            style={{
                flex: '0 0 calc(22% - 1rem)', // Ajusté pour afficher 4 cartes par ligne, avec 1rem de marge
                marginBottom: '1rem',
                padding: '1rem', // Ajout d'un padding
                boxSizing: 'border-box', // Correction de la largeur avec la boîte de modèle
                marginLeft: index % 4 === 0 ? 0 : '1rem', // Ajout d'une marge à gauche pour la première carte de chaque ligne
                marginRight: index % 4 === 3 ? 0 : '1rem', // Ajout d'une marge à droite pour la dernière carte de chaque ligne
            }}
        >
            <ProductCard product={product} />
        </div>
    ))}
</Grid>



      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Box sx={{ textAlign: 'center',marginBottom: '10px', marginTop: '20px', fontSize: '0.8rem', color: '#777' }}>
    © 2024 IMT Mines Albi. Tous droits réservés.
</Box>
</div>
)};

export default Favorites;
