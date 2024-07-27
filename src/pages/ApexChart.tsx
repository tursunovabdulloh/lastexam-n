import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApexChart = () => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartSeries, setChartSeries] = useState<number[]>([]);
  const [timeChartLabels, setTimeChartLabels] = useState<string[]>([]);
  const [timeChartSeries, setTimeChartSeries] = useState<number[]>([]);
  const theme = useSelector((state: any) => state.theme.theme);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipe"));
        const products = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.title,
            cookingTime: data.cookingTime || 0,
            nation: data.nation,
          };
        });

        const nationalityCounts = products.reduce((acc, product) => {
          const nation = product.nation;
          if (acc[nation]) {
            acc[nation] += 1;
          } else {
            acc[nation] = 1;
          }
          return acc;
        }, {} as Record<string, number>);

        setChartLabels(Object.keys(nationalityCounts));
        setChartSeries(Object.values(nationalityCounts));

        const sortedProducts = products.sort(
          (a, b) => a.cookingTime - b.cookingTime
        );
        setTimeChartLabels(sortedProducts.map((product) => product.title));
        setTimeChartSeries(
          sortedProducts.map((product) => product.cookingTime)
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: chartLabels,
    title: {
      text: "Food Distribution by Nationality",
      style: {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: theme === "synthwave" ? "#FFFFFF" : "#000000",
      },
    },
    legend: {
      labels: {
        colors: theme === "synthwave" ? "#FFFFFF" : "#000000",
      },
    },
    dataLabels: {
      style: {
        colors: [theme === "synthwave" ? "#FFFFFF" : "#000000"],
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
      },
    },
  };

  const timeChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: timeChartLabels,
      title: {
        text: "Recipe Title",
        style: {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: theme === "synthwave" ? "#FFFFFF" : "#000000",
        },
      },
      labels: {
        style: {
          colors: theme === "synthwave" ? "#FFFFFF" : "#000000",
        },
      },
    },
    yaxis: {
      title: {
        text: "Cooking Time (minutes)",
        style: {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: theme === "synthwave" ? "#FFFFFF" : "#000000",
        },
      },
      labels: {
        style: {
          colors: theme === "synthwave" ? "#FFFFFF" : "#000000",
        },
      },
    },
    title: {
      text: "Cooking Time Distribution",
      style: {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: theme === "synthwave" ? "#FFFFFF" : "#000000",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      style: {
        colors: [theme === "synthwave" ? "#FFFFFF" : "#000000"],
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
      },
    },
  };

  return (
    <div className="container p-8">
      <div className="chart">
        <ApexCharts
          options={chartOptions}
          series={chartSeries}
          type="pie"
          height={350}
        />
      </div>
      <div className="chart mt-10">
        <ApexCharts
          options={timeChartOptions}
          series={[{ name: "Cooking Time", data: timeChartSeries }]}
          type="bar"
          height={350}
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition mt-5"
        onClick={() => navigate("/")}
      >
        Back
      </button>
    </div>
  );
};

export default ApexChart;
