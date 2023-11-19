import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import CustomCard from "../CustomCard";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChartColumn as ChartColumnIcon } from "@fortawesome/free-solid-svg-icons";
library.add(ChartColumnIcon);

const TotalStaked = () => {
  const theme = useTheme();

  const [totalStaked, setTotalStaked] = useState(0);

  const fetchTotalStaked = () => {
    axios
      .get(
        "https://mainnet-public.mirrornode.hedera.com/api/v1/network/stake",
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const stakeTotalInHBAR = response.data.stake_total / 100000000; // Convert from tinybars to HBAR
        setTotalStaked(stakeTotalInHBAR);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTotalStaked();
  }, []);

  return (
    <CustomCard
      text="TOTAL STAKED"
      value={`${totalStaked.toLocaleString()}ℏ`}
      color={theme.palette.primary.main}
      icon={ChartColumnIcon}
    />
  );
};

export default TotalStaked;
