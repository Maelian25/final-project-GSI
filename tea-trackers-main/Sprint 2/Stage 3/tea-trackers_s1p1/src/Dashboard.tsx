import React, { useEffect, useContext, useState } from "react";
import ProductCard from "./components/ProductCard";
import { IProduct } from "./dto/IProduct";
import { ArticleType } from "./dto/IArticle";
import { FilterContext } from "./FilterContext";
import { IFilter } from "./dto/IFilter";
import JSMEPopupScreen from "./components/JSMEPopupScreen";
import {
  Box,
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Avatar,
  Button,
  Pagination
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InventoryIcon from "@mui/icons-material/Inventory";
import { SearchFilterBar } from "./components/DashboardFIltering";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { UserContext } from "./UserContext";
import { ProductService } from "./services/ProduitService";
import { useNavigate } from "react-router-dom";

const user = {
  name: "John Doe",
  role: "Lab Manager",
  productUsage: 57, // Example number
  notifications: ["A product needs to be returned"],
};
const unauthorizedRoles = ['User', 'CNRS', 'LCC', 'INP'];
async function fetchProducts(): Promise<IProduct[] | undefined> {
  try {
    const response = await fetch("https://tt-api.azurewebsites.net/produits/");

    if (response.ok) {
      const data = await response.json();
      return data as IProduct[];
    } else {
      console.error(`Request failed with status ${response.status}`);
      return undefined;
    }
  } catch (error) {
    console.error("Can't obtain products", error);
    // En cas d'erreur, vous pouvez également gérer l'erreur ici
    return undefined;
  }
}

const DashboardTop: React.FC = () => {
  const { user } = useContext(UserContext);
  // Placeholder user and stats data
  // const user = {
  //   name: "Dr. John Doe",
  //   role: "Lab Manager",
  // };
  const navigate = useNavigate();

  const handleViewFavorites = () => {
    navigate('/favorites');
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  return (
      <Box sx={{ padding: 1, backgroundColor: "#f5f5f5", marginTop: "4.5rem" }}>
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={6}>
  <Paper sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <Avatar sx={{ bgcolor: "primary.main", marginRight: 2 }}>
      <DashboardIcon />
    </Avatar>
    <div>
      <Typography variant="h6" component="div">
        {user?.username}
      </Typography>
      <Typography variant="subtitle1">{user?.user_type}</Typography>
      </div>
    </div>
    {user && !unauthorizedRoles.slice(1).includes(user.user_type) && (
    <Button variant="outlined" startIcon={<AssessmentIcon />} onClick={handleViewProfile}>
      View profile
    </Button>)}
  </Paper>
</Grid>
  
          <Grid item xs={12} sm={6} md={6}>
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Typography variant="h6" component="div">
                  Favorites
                </Typography>
                <Typography variant="subtitle1"></Typography>
              </div>
              {user && !unauthorizedRoles.slice(1).includes(user.user_type) && (
              <Button variant="outlined" startIcon={<AssessmentIcon />} onClick={handleViewFavorites}>
                View favorites
              </Button>)}
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
};

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jsmePopupOpen, setJsmePopupOpen] = useState<boolean>(false);
  const [smiles, setSmiles] = useState<string>("");
  const itemsPerPage: number = 12; // Adjust number of items per page as needed

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('https://tt-api.azurewebsites.net/produits/');
        if (response.ok) {
          const data: IProduct[] = await response.json();
          // Transform danger_codes
          const transformedData = data.map(product => ({
            ...product,
            danger_codes: product.danger_codes?.toString().split(" ")
          }));
          setProducts(transformedData);
        } else {
          console.error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Can't obtain products", error);
      }
    }
    getData();
  }, []);


  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentProducts: IProduct[] = products.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages: number = Math.ceil(products.length / itemsPerPage);

  const [filter, setFilter] = useState<IFilter | null>(null);



  useEffect(() => {
    async function searchData() {
      if (filter && filter.search_bar) {
        const productService = new ProductService('https://tt-api.azurewebsites.net');
        try {
          if (filter.product_type === 'cas_number') {
            const response = await productService.searchProductsByCas(filter.search_bar, filter.fabricant);
            if (response) {
              setProducts(response.data);
            }
          } else if (filter.product_type === 'name') {
            const response = await productService.searchProductsByName(filter.search_bar, filter.fabricant);
            if (response) {
              setProducts(response.data);
            }
          } else if (filter.product_type === 'formula') {
            const response = await productService.searchProductsByFormula(filter.search_bar, filter.fabricant);
            if (response) {
              setProducts(response.data);
            }
          } else if (filter.product_type === 'smiles') {
            const response = await productService.searchProductsBySmiles(filter.search_bar, filter.fabricant);
            if (response) {
              setProducts(response.data);
            }
          }
          // const response = await productService.searchProducts(filter.search_bar);
          // if (response) {
          //   setProducts(response.data);
          // }
        }catch {
          console.error("Can't obtain products");
        }
    }
  }
  searchData();
  console.log("searching")
  }, [filter]);

  useEffect(() => {
    async function saveSmiles() {
      if (smiles) {
        setFilter({
          search_bar: smiles,
          fabricant: filter?.fabricant || '',
          product_type: "smiles",
          });
      }
    }
    saveSmiles();
  }, [smiles]);

  return (
    <FilterContext.Provider value={{filter, setFilter}}>

      <DashboardTop />

      <SearchFilterBar  jsmePopup = {jsmePopupOpen} setJsmePopup={setJsmePopupOpen}/>

      <Grid container spacing={2}>
        {currentProducts.map((product: IProduct) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={product.id_product}>
            <ProductCard product={product} />
          </Grid>
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
      <Box sx={{ textAlign: 'center',marginBottom: '20px', marginTop: '20px', fontSize: '0.8rem', color: '#777' }}>
    © 2024 IMT Mines Albi. Tous droits réservés.
</Box>

      <JSMEPopupScreen
        open={jsmePopupOpen}
        setJsmePopup={setJsmePopupOpen}
        smiles={smiles}
        setSmiles={setSmiles}
        />
    </FilterContext.Provider>
  );
};

export default Dashboard;

