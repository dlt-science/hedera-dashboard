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

const PriceChart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);

  const fetchPriceData = () => {
    const endTime = new Date().toISOString();
    const startTime = new Date(
      new Date().setDate(new Date().getDate() - 90)
    ).toISOString();

    axios
      .get(
        `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?metrics=principal_market_price_usd&start_time=${startTime}&end_time=${endTime}&assets=hbar&frequency=1d`
      )
      .then((response) => {
        const priceData = response.data.data.map((item) => ({
          time: item.time.split("T")[0],
          price: parseFloat(item.principal_market_price_usd),
        }));
        setChartData(priceData);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchPriceData();
  }, []);

  const data = {
    labels: chartData.map((data) => data.time),
    datasets: [
      {
        label: "HBAR Price (USD)",
        data: chartData.map((data) => data.price),
        fill: false,
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
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          padding: 10,
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
        title="HBAR Price Over Time"
        subheader="Daily Price of HBAR in USD"
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

export default PriceChart;
