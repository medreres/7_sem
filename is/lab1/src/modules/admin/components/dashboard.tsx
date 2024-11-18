// @ts-nocheck
import { Box, H1, Section, Text } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const api = new ApiClient();

  const [userStatusChartData, setUserStatusChartData] = useState({
    labels: [],
    percentages: [],
  });

  const [pointsChartData, setPointsChartData] = useState({
    labels: [],
    averages: [],
  });

  const [claimsChartData, setClaimsChartData] = useState({
    labels: [],
    counts: [],
  });

  const [topProductsChartData, setTopProductsChartData] = useState({
    labels: [],
    orders: [],
  });

  useEffect(() => {
    api.getDashboard().then((response) => {
      setUserStatusChartData(response.data.userStatusChartData);
      setPointsChartData(response.data.pointsChartData);
      setClaimsChartData(response.data.claimsChartData);
      setTopProductsChartData(response.data.topProductsChartData);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: { display: true, text: 'Chart', font: { size: 18 } },
    },
    scales: { y: { beginAtZero: true } },
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  return (
    <Box variant="grey" padding="lg">
      <H1>Admin Dashboard</H1>
      <Text
        style={{
          marginBottom: '40px',
          fontSize: '16px',
          color: '#555',
          textAlign: 'center',
        }}
      >
        Welcome to the admin dashboard! Here's a detailed overview of activity.
      </Text>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gridGap: '20px',
        }}
      >
        <Section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '10px',
            }}
          >
            Points Earned Per Day
          </Text>
          <Line
            data={{
              labels: pointsChartData.labels,
              datasets: [
                {
                  label: 'Average Points',
                  data: pointsChartData.averages,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  tension: 0.1,
                },
              ],
            }}
            options={options}
          />
        </Section>

        <Section style={cardStyle}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '10px',
            }}
          >
            Claims Made Per Day
          </Text>
          <Bar
            data={{
              labels: claimsChartData.labels,
              datasets: [
                {
                  label: 'Claims',
                  data: claimsChartData.counts,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={options}
          />
        </Section>
        <Section style={cardStyle}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '10px',
            }}
          >
            User Status Distribution
          </Text>
          <Pie
            data={{
              labels: userStatusChartData.labels,
              datasets: [
                {
                  label: 'User Status',
                  data: userStatusChartData.percentages,
                  backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
                  hoverBackgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#cc65fe',
                    '#ffce56',
                  ],
                },
              ],
            }}
          />
        </Section>
      </Box>
    </Box>
  );
};

export default Dashboard;
