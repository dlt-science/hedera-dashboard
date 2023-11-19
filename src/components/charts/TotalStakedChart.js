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
import { useTheme } from "@mui/material/styles";
import { colors } from "@mui/material";

Chart.register(...registerables);
const key = process.env.REACT_APP_API_KEY;

const TotalStakedChart = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const [chartData, setChartData] = useState([]);

  const fetchStakedData = () => {
    const endpoint = "https://api.stakingrewards.com/public/query";
    const query = `
        {
            assets(where: { symbols: ["HBAR"] }, limit: 1) {
                metrics(
                    where: {
                        metricKeys: ["staked_tokens"],
                        createdAt_gt: "2023-07-01T00:00:00Z",  
                        createdAt_lt: "2023-11-17T23:59:59Z"   
                    }
                    limit: 500
                    order: { createdAt: asc }
                ) {
                    defaultValue
                    createdAt
                }
            }
        }
    `;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": ``, //key
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        const metrics = data.data.assets[0].metrics;
        let dailyData = {};

        metrics.forEach((metric) => {
          const date = new Date(metric.createdAt).toLocaleDateString();

          if (!dailyData[date]) {
            dailyData[date] = metric.defaultValue;
          }
        });

        const chartDataArray = Object.keys(dailyData).map((date) => ({
          time: date,
          value: dailyData[date],
        }));

        setChartData(chartDataArray);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchStakedData();
  }, []);

  const data = {
    labels: chartData.map((data) => data.time),
    datasets: [
      {
        label: "Total Staked HBAR",
        data: chartData.map((data) => data.value),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderWidth: 2,
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
        color:
          theme.palette.mode === "dark"
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
        align: "top",
        labels: {
          title: {
            font: {
              weight: "bold",
              size: 13,
            },
            padding: 10,
          },
        },
        formatter: (value) => numeral(value).format("0,0") + "ℏ",
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
          callback: (value) => numeral(value).format("0,0") + "ℏ",
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
        title="Historical Total Staked HBAR"
        subheader="Total Staked HBAR Over Time"
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

export default TotalStakedChart;
