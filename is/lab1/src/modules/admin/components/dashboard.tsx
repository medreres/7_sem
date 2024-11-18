// @ts-nocheck
import { Box, H1, H2, Section } from '@adminjs/design-system';
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

const CombinedDashboard = () => {
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

  useEffect(() => {
    api.getDashboard().then((response) => {
      setUserStatusChartData(response.data.userStatusChartData);
      setPointsChartData(response.data.pointsChartData);
      setClaimsChartData(response.data.claimsChartData);
    });
  }, []);

  const userStatusData = {
    labels: userStatusChartData.labels,
    datasets: [
      {
        label: 'User Status Distribution',
        data: userStatusChartData.percentages,
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
      },
    ],
  };

  const pointsData = {
    labels: pointsChartData.labels,
    datasets: [
      {
        label: 'Average Points Earned Per Day',
        data: pointsChartData.averages,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const claimsData = {
    labels: claimsChartData.labels,
    datasets: [
      {
        label: 'Claims Made Per Day',
        data: claimsChartData.counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      variant="grey"
      padding="lg"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '20px',
      }}
    >
      <H1>Admin Dashboard</H1>
      <Section style={{ gridRow: '2' }}>
        <H2>Points Earned Per Day</H2>
        <Line data={pointsData} options={options} />
      </Section>
      <Section style={{ gridRow: '2' }}>
        <H2>Claims Made Per Day</H2>
        <Bar data={claimsData} options={options} />
      </Section>
      <Section style={{ gridRow: '3' }}>
        <H2>User Status Distribution</H2>
        <Pie data={userStatusData} />
      </Section>
    </Box>
  );
};

export default CombinedDashboard;
