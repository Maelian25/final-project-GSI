import React, { useEffect, useContext } from "react";
import ProductCard from "./components/ProductCard";
import { IProduct } from "./dto/IProduct";
import { ArticleType } from "./dto/IArticle";
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
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InventoryIcon from "@mui/icons-material/Inventory";
import { SearchFilterBar } from "./components/DashboardFIltering";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { UserContext } from "./UserContext";

const user = {
  name: "John Doe",
  role: "Lab Manager",
  productUsage: 57, // Example number
  notifications: ["A product needs to be returned"],
};

async function fetchProducts(): Promise<IProduct[] | undefined> {
  try {
    const response = await fetch("https://tt-api.azurewebsites.net/produit/");

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
  const stats = {
    totalProducts: 120,
    alerts: 3,
    reports: 5,
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", marginTop: "5.5rem" }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ padding: 2, display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "primary.main", marginRight: 2 }}>
              <DashboardIcon />
            </Avatar>
            <div>
              <Typography variant="h6" component="div">
                {user?.username}
              </Typography>
              <Typography variant="subtitle1">{user?.user_type}</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
                Total Products
              </Typography>
              <Typography variant="subtitle1">{stats.totalProducts}</Typography>
            </div>
            <Button variant="outlined" startIcon={<AssessmentIcon />}>
              View Reports
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
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
                Alerts
              </Typography>
              <Typography variant="subtitle1">{stats.alerts} New</Typography>
            </div>
            <Button variant="outlined" startIcon={<NotificationsIcon />}>
              View Alerts
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

function Dashboard() {
  const [products, setProducts] = React.useState<IProduct[]>([]);

  useEffect(() => {
    console.log("Succesfully loaded");
    async function getData() {
      try {
        const data = await fetchProducts();
        if (data !== undefined) {
          data.forEach((product) => {
            product.danger_codes = product.danger_codes?.toString().split(" ")
          });
          setProducts(data); // Mettre à jour l'état avec les données récupérées
        } else {
          console.log("No data received");
        }
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    }

    // Appeler getData lors du montage du composant
    getData();
  }, []);

  return (
    <div>
      {/* User Information Section */}
      <DashboardTop />

      {/* Search and Filter Bar */}
      <SearchFilterBar />

      {/* Display products */}

      {products.map((product) => (
        <ProductCard key={product.id_product} product={product} />
      ))}
    </div>
  );
}
export default Dashboard;
