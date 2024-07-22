import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApexChart = () => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartSeries, setChartSeries] = useState<number[]>([]);
  const theme = useSelector((state: any) => state.theme.theme);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipe"));
        const products = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
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
  };

  return (
    <div className="container p-10">
      <div className="chart">
        <ApexCharts
          options={chartOptions}
          series={chartSeries}
          type="pie"
          height={350}
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        onClick={() => navigate("/")}
      >
        Back
      </button>
    </div>
  );
};

export default ApexChart;
