import React from "react";
import { IProduct } from "../dto/IProduct";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LinearProgress } from "@mui/material";
import { ChemicalImage, getPictogramUrlsForDangerCodes } from "../utils/Utils";
import ProductPopup from "./ProductPopUp";

interface ProductCardProps {
  product: IProduct;
}

const getDangerScoreColor = (score: any) => {
  if (score < 100) return "primary"; // Low danger - green
  if (score < 1000) return "secondary"; // Medium danger - yellow
  if (score < 4000) return "warning"; // High danger - orange
  return "error"; // High danger - red
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const pictogramUrls = getPictogramUrlsForDangerCodes(product.danger_codes);
  const [openPopup, setOpenPopup] = React.useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 300,
          height: "20%",
          m: 1,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "#f5f5f5",
          "&:hover": { boxShadow: 5 },
        }}
        onClick={handleOpenPopup}
      >
        <CardContent sx={{ textAlign: "center", p: 2 }}>
          <Box
            sx={{
              height: "125px",
              width: "100%", // Ensure the container takes full width
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
              backgroundColor: "#f5f5f5", // Example background color
              padding: "5px",
              borderRadius: "4px",
              overflow: "hidden", // Ensure the content fits in the box
            }}
          >
            <ChemicalImage casNumber={product.cas_number} />
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {product.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 0.5 }}>
            Qty: {product.quantity_vol} L
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 0.5 }}>
            Fabricant: {product.fabricant}
          </Typography>

          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={product.score_danger / 50}
                color={getDangerScoreColor(product.score_danger)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "0.65rem",
                color: "black",
              }}
            >
              {product.score_danger}
            </Box>
          </Box>
          {/* Display pictograms */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "5px",
              marginTop: "5px",
            }}
          >
            {pictogramUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={url}
                style={{ width: "45px", height: "45px" }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
      {/* Popup module*/}
      <ProductPopup
        open={openPopup}
        onClose={handleClosePopup}
        product={product}
      />
    </>
  );
};

export default ProductCard;
