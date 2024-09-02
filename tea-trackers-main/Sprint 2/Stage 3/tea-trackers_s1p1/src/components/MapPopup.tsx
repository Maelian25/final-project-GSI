import React from "react";
import Location from "./Location";
import { Box, Typography, styled } from "@mui/material";
import { IProduct } from "../dto/IProduct";

interface PlanProp {
  product: IProduct;
}
const StyledImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  borderRadius: "6px",
});

const BuildingPlan: React.FC<PlanProp> = ({ product }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "70%",
        height: "70%",
        padding: "1rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
      }}
    >
      <Location product={product} />

      <Typography variant="h6" sx={{ margin: "1rem 0" }}>
        Plan du laboratoire
      </Typography>
      <Box
        sx={{
          width: "80%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <StyledImage
          src="/assets/plan_labo.svg"
          alt="Plan du labo"
          width="100%"
          height="100%"
        />
      </Box>
      <Typography variant="h6" sx={{ margin: "1rem 0" }}>
      Current Room : {product.salle?.split(",").slice(-2)[0]}{" "}
        
        {/*on affiche en texte la salle*/}
      </Typography>
    </Box>
  );
};

export default BuildingPlan;
