import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import { colors } from "@mui/material";

Chart.register(...registerables);

const MarketCapAreaChart = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const [chartData, setChartData] = useState([]);

  const fetchMarketCapData = () => {
    const today = new Date();
    const endTime = today.toISOString();

    const startTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 120
    ).toISOString();

    axios
      .get(
        `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?start_time=${startTime}&end_time=${endTime}&assets=hbar&frequency=1d&metrics=CapMrktEstUSD`
      )
      .then((response) => {
        const marketCapData = response.data.data.map((item) => ({
          time: item.time.split("T")[0],
          marketCap: parseFloat(item.CapMrktEstUSD),
        }));
        setChartData(marketCapData);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchMarketCapData();
  }, []);

  const data = {
    labels: chartData.map((data) => data.time),
    datasets: [
      {
        label: "HBAR Market Cap (USD)",
        data: chartData.map((data) => data.marketCap),
        fill: true,
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        borderColor: theme.palette.primary.main,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
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
          callback: (value) => numeral(value).format("$0,0.00"),
        },
        display: true,
        borderDash: [5, 5],
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title="HBAR Market Cap Over Time"
        subheader="Daily Market Capitalization of HBAR"
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: "relative" }}>
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MarketCapAreaChart;
