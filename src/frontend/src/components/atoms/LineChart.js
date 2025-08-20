import { faker } from '@faker-js/faker';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';

Chart.register(...registerables);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Orders',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

function LineChart() {
  return (
    <Box sx={{ p: 4, backgroundColor: 'white', mt: 4 }}>
      <Line options={options} data={data} />
    </Box>
  );
}

export default LineChart;
