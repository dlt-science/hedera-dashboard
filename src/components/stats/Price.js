import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

import CustomCard from "../CustomCard";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoins as CoinsIcon } from "@fortawesome/free-solid-svg-icons";
library.add(CoinsIcon);

const Price = () => {
  const theme = useTheme();

  const [price, setPrice] = useState(null);

  const fetchPrice = () => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true",
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setPrice(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  if (!price) {
    return <div>Loading...</div>;
  }

  const hbarPrice = price["hedera-hashgraph"].usd;

  return (
    <CustomCard
      text="HBAR PRICE"
      value={`$${hbarPrice.toFixed(4)}`}
      color={theme.palette.error.dark}
      icon={CoinsIcon}
    />
  );
};

export default Price;
