import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";
import { useTheme } from "@mui/material/styles";
import CustomCard from "../CustomCard";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChartArea as ChartAreaIcon } from "@fortawesome/free-solid-svg-icons";
library.add(ChartAreaIcon);

const MarketCap = () => {
  const theme = useTheme();
  const [marketCap, setMarketCap] = useState(null);

  const getPreviousDayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };

  const fetchMarketCap = () => {
    const previousDay = getPreviousDayDate();
    const startTime = `${previousDay}T00:00:00Z`;

    axios
      .get(
        `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?start_time=${startTime}&assets=hbar&frequency=1d&metrics=CapMrktEstUSD`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const latestData = response.data.data[0];
        setMarketCap(latestData ? latestData.CapMrktEstUSD : null);
      })
      .catch((error) => {
        console.log(error);
        setMarketCap(null);
      });
  };

  useEffect(() => {
    fetchMarketCap();
  }, []);

  if (marketCap === null) {
    return <div>Loading...</div>;
  }

  return (
    <CustomCard
      text="HBAR MarketCap"
      value={`$${numeral(marketCap).format("0,0")}`}
      color={theme.palette.error.dark}
      icon={ChartAreaIcon}
    />
  );
};

export default MarketCap;
