import React from "react";
import { IProduct } from "../dto/IProduct";
import { getTopLeft } from "../utils/Utils";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";

interface LocationProp {
  product: IProduct;
}

interface ImageStyleProps {
  top?: string;
  left?: string;
}

const StyledImg = styled("img")<ImageStyleProps>(({ top, left }) => ({
  position: "absolute",
  top: top || "0",
  left: left || "0",
}));

const Location: React.FC<LocationProp> = ({ product }) => {
  if (!product.salle) {
    return null;
  }

  const output = getTopLeft(product.salle.split(",")); // lors de l'appel de cette fonction, on prend une liste qui a en fait 2 éléments (ou n+1), le dernier élèment étant nul

  if (!output) {
    console.log(output);
    console.log(product.salle.split(",").length);
    return null;
  }

  const { left, top } = output;

  return (
    <StyledImg
      src="/assets/location_icon.png"
      alt="Location Icon"
      top={top}
      left={left}
    />
  );
};

export default Location;
