import React from "react";
import { IProduct } from "../dto/IProduct";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./Historique.css";

interface HistoriqueProps {
  product: IProduct;
}

const Historique: React.FC<HistoriqueProps> = ({ product }) => {
  if (!product.salle || product.date?.length === 0 || !product.date) {
    return (
      <Box className="historique-container">
        <Typography variant="body1" className="no-history">
          Pas d'historique pour{" "}
          <span className="product-name">{product.name}</span>
        </Typography>
      </Box>
    );
  }
  const salles = product.salle.split(",");
  const date = product.date.split(",");
  return (
    <Box className="historique-container">
      <Paper elevation={3} className="history-log">
        <List>
          {salles.map((salle, index) => (
            <ListItem key={index} className="log-item">
              <ListItemText
                primary={
                  <Typography variant="body1" className="log-info">
                    <span className="log-label">LOG:</span> {salle} -{" "}
                    <span className="log-date">
                      {date && date[index]
                        ? date[index]
                        : "Date non disponible"}
                    </span>
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Historique;
