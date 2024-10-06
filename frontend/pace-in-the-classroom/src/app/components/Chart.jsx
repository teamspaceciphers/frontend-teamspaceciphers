import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react'; // Ensure you have this package installed via npm/yarn

const Chart = ({ dataFile, labelName, dataType, color, xLabel, yLabel }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetching JSON data based on the provided dataFile prop
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/${dataFile}`); // Use the dataFile prop for the JSON path
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const base = +new Date(2024, 0, 1); // Starting from January 1, 2024
        const oneDay = 24 * 3600 * 1000;

        // Determine which key to use based on the dataFile
        const key = Object.keys(jsonData).find(k => jsonData[k]); // Dynamically get the first key
        const values = jsonData[key];

        // Generating date-concentration pairs based on the values
        const data = values.map((value, index) => {
          const date = new Date(base + index * oneDay);
          return [date, value];
        });

        setChartData(data); // Set chart data to the state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataFile]);

  const getOption = () => ({
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: labelName,
      textStyle: {
        fontWeight: 'bold', // Make the font bold
        fontSize: 20, // Optional: adjust font size as needed
        color: '#333', // Optional: change color if desired
      }, // Use the labelName prop for the chart title
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      name: xLabel, // Use the xLabel prop for the x-axis label
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 24,
        padding: [20, 0, 0, 0], // Adds spacing below the x-axis label
      },
      textStyle: {
        fontWeight: 'bold', // Make the font bold
        fontSize: 20, // Optional: adjust font size as needed
        color: '#333', // Optional: change color if desired
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      name: yLabel, // Use the yLabel prop for the y-axis label
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 24,
        padding: [0, 0, 30, 0], // Adds spacing to the y-axis label
      },
      textStyle: {
        fontWeight: 'bold', // Make the font bold
        fontSize: 20, // Optional: adjust font size as needed
        color: '#333', // Optional: change color if desired
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: labelName, // Use the labelName prop for the series name
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        lineStyle: {
          color: color || '#5470C6', // Use provided color or default to a specific color
        },
        data: chartData
      }
    ]
  });

  return (
    <div className='mt-10'>
      <ReactEcharts option={getOption()} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default Chart;
