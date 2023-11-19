import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";

Chart.register(...registerables);

const TVLChart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);

  const fetchTVLData = () => {
    const startDate = new Date("2022-08-17").getTime() / 1000;

    axios
      .get("https://api.llama.fi/v2/historicalChainTvl/Hedera")
      .then((response) => {
        const filteredData = response.data
          .filter((item) => item.date >= startDate)
          .filter((_, index) => index % 2 === 0);

        const tvlData = filteredData.map((item) => ({
          date: new Date(item.date * 1000).toLocaleDateString(),
          tvl: item.tvl,
        }));
        setChartData(tvlData);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTVLData();
  }, []);

  const data = {
    labels: chartData.map((data) => data.date),
    datasets: [
      {
        label: "Total Value Locked (TVL) in USD",
        data: chartData.map((data) => data.tvl),
        fill: true,
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          callback: (value) => `$${value.toLocaleString()}`,
        },
        display: true,
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title="Hedera Total Value Locked Over Time"
        subheader="TVL in USD"
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: "relative" }}>
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TVLChart;
