import { Box, H1, Text } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const api = new ApiClient();
  const [userCount, setUserCount] = useState(0);

  const [pointsData, setPointsData] = useState<
    { name: string; points: number }[]
  >([]);

  useEffect(() => {
    void api.getDashboard().then((response) => {
      const data = response.data as {
        pointsData: { name: string; points: number }[];
        userCount: number;
      };

      console.log('response.data', response.data);

      setUserCount(data.userCount);
      setPointsData(data.pointsData);
    });
  }, []);

  // Chart data preparation
  const data = {
    labels: pointsData.map((user) => user.name),
    datasets: [
      {
        label: 'User Points',
        data: pointsData.map((user) => user.points),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <H1>Admin Dashboard</H1>
      <Text>Total Users: {userCount}</Text>
      <Box marginTop="lg" width="100%" height="400px">
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Points per User',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
