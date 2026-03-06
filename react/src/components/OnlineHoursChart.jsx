import { useState, useEffect, useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import echo from '../services/echo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function OnlineHoursChart({ period = 'week' }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchChartData();

    // Listen for real-time session updates
    const channel = echo.channel('user-sessions');
    
    channel.listen('.session.updated', (data) => {
      console.log('Session updated:', data);
      // Refresh chart data when sessions change
      fetchChartData();
    });

    return () => {
      channel.stopListening('.session.updated');
      echo.leaveChannel('user-sessions');
    };
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 7;
      
      const response = await axios.get(
        `http://localhost:8000/api/dashboard/online-hours-chart?days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = response.data;
      
      setChartData({
        labels: data.map(item => item.day),
        datasets: [
          {
            label: 'Total Hours Online',
            data: data.map(item => item.hours),
            backgroundColor: 'rgba(236, 72, 153, 0.6)', // Pink theme
            borderColor: 'rgba(236, 72, 153, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Active Users',
            data: data.map(item => item.users_count),
            backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue theme
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y1',
          }
        ],
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `🔴 LIVE - User Online Hours - Last ${period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : 'Day'}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1f2937',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Hours: ${context.parsed.y}h`;
            } else {
              return `Users: ${context.parsed.y}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Hours Online',
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Users',
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchChartData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        {chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
}