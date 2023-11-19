import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";
import { useTheme } from "@mui/material/styles";

import CustomCard from "../CustomCard";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faChartPie as ChartPieIcon } from "@fortawesome/free-solid-svg-icons";
library.add(ChartPieIcon);

const Supply = () => {
  const theme = useTheme();

  const [supply, setSupply] = useState([]);

  const fetchSupply = () => {
    axios
      .get(
        "https://mainnet-public.mirrornode.hedera.com/api/v1/network/supply",
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setSupply(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchSupply();
  }, []);

  const circSupply = supply.released_supply / 100000000;

  return (
    <CustomCard
      text="CIRCULATING SUPPLY"
      value={`${numeral(circSupply).format("0,0") + "ℏ"}`}
      color={theme.palette.warning.dark}
      icon={ChartPieIcon}
    />
  );
};

export default Supply;
