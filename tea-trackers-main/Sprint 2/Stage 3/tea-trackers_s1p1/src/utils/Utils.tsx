import React, { useEffect, useState } from "react";
import { IProduct } from "../dto/IProduct";

export const convertCasToCid = async (casNumber: string) => {
  try {
    const response = await fetch(
      `https://www.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pccompound&retmax=1&term=${casNumber}`
    );
    const data = await response.text();

    // Parse the XML response
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    const cid = xml.querySelector("IdList Id")?.textContent;

    return cid;
  } catch (error) {
    console.error("Error converting CAS to CID:", error);
    return null;
  }
};

interface ChemicalImageProps {
  product: IProduct;
}

export const ChemicalImage: React.FC<ChemicalImageProps> = ({ product }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchChemicalImage = async () => {
      if (!product) {
        return;
      }
      if (!product.cid_number) {
        const cid = await convertCasToCid(product.cas_number);
        const newProduct = { ...product, cid_number: cid };
        await fetch(
          "https://tt-api.azurewebsites.net/produit/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          }
        );
      }else {
        const cid = product.cid_number;
        if (cid) {
          setImageUrl(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${cid}/PNG`
          );
        }
      }
    };
    fetchChemicalImage();
  }, [product.cas_number]);

  return (
    <img
      src={imageUrl}
      alt={`Chemical structure for CAS Number: ${product.cas_number}`}
      style={{ maxWidth: "100%", height: "auto", maxHeight: "125%" }} // Ensure it fits in the container
    />
  );
};

const ghsPictogramsData = [
  {
    hazardCategory: "Explosives",
    ghsPictogram: "GHS01",
    dangerCodes: ["H200", "H201", "H202", "H203", "H204", "H205"],
    imageUrl: "/assets/GHS-01.gif",
  },
  {
    hazardCategory: "Flammable Gases",
    ghsPictogram: "GHS02",
    dangerCodes: [
      "H220",
      "H221",
      "H222",
      "H223",
      "H224",
      "H225",
      "H226",
      "H227",
      "H228",
    ],
    imageUrl: "/assets/GHS-02.gif",
  },
  {
    hazardCategory: "Oxidizing Gases",
    ghsPictogram: "GHS03",
    dangerCodes: ["H270"],
    imageUrl: "/assets/GHS-03.gif",
  },
  {
    hazardCategory: "Gases Under Pressure",
    ghsPictogram: "GHS04",
    dangerCodes: ["H280", "H281"],
    imageUrl: "/assets/GHS-04.gif",
  },
  {
    hazardCategory: "Corrosives",
    ghsPictogram: "GHS05",
    dangerCodes: ["H290", "H271", "H272"],
    imageUrl: "/assets/GHS-05.gif",
  },
  {
    hazardCategory: "Toxic",
    ghsPictogram: "GHS06",
    dangerCodes: ["H300", "H301", "H310", "H311", "H330", "H331"],
    imageUrl: "/assets/GHS-06.gif",
  },
  {
    hazardCategory: "Harmful/Irritant",
    ghsPictogram: "GHS07",
    dangerCodes: [
      "H302",
      "H312",
      "H332",
      "H303",
      "H313",
      "H333",
      "H304",
      "H314",
      "H315",
      "H317",
      "H318",
      "H319",
      "H320",
      "H335",
      "H336",
    ],
    imageUrl: "/assets/GHS-07.gif",
  },
  {
    hazardCategory: "Mutagenic",
    ghsPictogram: "GHS08",
    dangerCodes: [
      "H340",
      "H341",
      "H350",
      "H351",
      "H360",
      "H361",
      "H361d",
      "H361f",
      "H362",
      "H370",
      "H371",
      "H372",
      "H373",
    ],
    imageUrl: "/assets/GHS-08.gif",
  },
  {
    hazardCategory: "Environmental",
    ghsPictogram: "GHS09",
    dangerCodes: ["H400", "H401", "H410", "H411", "H412", "H413"],
    imageUrl: "/assets/GHS-09.gif",
  },
  // ... and so on for each hazard category
];

export const getPictogramUrlsForDangerCodes = (
  dangerCodes: string[] | undefined
) => {
  const pictogramUrls: string[] = [];

  // Iterate over each danger code
  if (!dangerCodes) {
    return [];
  }
  dangerCodes.forEach((code) => {
    // Check each entry in ghsPictogramsData
    ghsPictogramsData.forEach((entry) => {
      if (
        entry.dangerCodes.includes(code) &&
        !pictogramUrls.includes(entry.imageUrl)
      ) {
        pictogramUrls.push(entry.imageUrl);
      }
    });
  });

  return pictogramUrls;
};

interface SalleLocationProps {
  product: IProduct;
}

const salleData = [
  {
    name: "1-a1-23",
    top: "235px",
    left: "92px",
  },
  {
    name: "1-a1-25",
    top: "235px",
    left: "125px",
  },
  {
    name: "1-a1-27",
    top: "235px",
    left: "160px",
  },
  {
    name: "1-r2-1",
    top: "214px",
    left: "187px",
  },
  {
    name: "1-r2-3",
    top: "187px",
    left: "184px",
  },
  {
    name: "1-r2-5",
    top: "158",
    left: "187px",
  },
  {
    name: "1-r2-7",
    top: "130px",
    left: "187px",
  },
  {
    name: "1-r2-6",
    top: "160px",
    left: "250px",
  },
  {
    name: "1-r2-8",
    top: "125px",
    left: "250px",
  },
  {
    name: "1-r2-10",
    top: "95px",
    left: "250px",
  },
  {
    name: "1-r3-1",
    top: "240px",
    left: "360px",
  },
  {
    name: "1-r3-3",
    top: "208px",
    left: "388px",
  },
  {
    name: "1-r3-5",
    top: "170px",
    left: "388px",
  },
  {
    name: "1-r3-7",
    top: "130px",
    left: "388px",
  },
  {
    name: "1-r3-2",
    top: "235px",
    left: "454px",
  },
  {
    name: "1-r3-4",
    top: "190px",
    left: "454px",
  },
  {
    name: "1-r3-6",
    top: "155px",
    left: "454px",
  },
  {
    name: "1-r3-8",
    top: "125px",
    left: "454px",
  },
  {
    name: "1-r3-10",
    top: "90px",
    left: "454px",
  },
  {
    name: "1-a1-24",
    top: "310px",
    left: "92px",
  },
  {
    name: "1-a1-26",
    top: "305px",
    left: "210px",
  },
  {
    name: "1-a1-28",
    top: "305px",
    left: "160px",
  },
  {
    name: "1-a1-30",
    top: "350px",
    left: "172px",
  },
  {
    name: "1-a1-32",
    top: "350px",
    left: "242px",
  },
  {
    name: "1-a1-34",
    top: "305px",
    left: "260px",
  },
  {
    name: "1-a1-38",
    top: "320px",
    left: "300px",
  },
];
export const getTopLeft = (salle: string[]) => {
  if (!salle || salle.length === 0) {
    return null;
  }

  const lastSalleEntry = salle[salle.length - 2]; //pour handle le fait que "salle," retourne une liste de 2 éléments

  for (const entry of salleData) {
    if (entry.name === lastSalleEntry) {
      return { top: entry.top, left: entry.left };
    }
  }

  return null;
};
