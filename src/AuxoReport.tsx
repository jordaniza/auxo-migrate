import React from "react";
import { Bar } from "react-chartjs-2";
import { useReadBalances, useVeDough } from "./hooks/useReadBalances"; // Import the custom hook
import { BigNumber, ethers } from "ethers";
import { useBlockNumber } from 'wagmi'

const format = (data?: BigNumber) => data ? Math.round(Number(ethers.utils.formatEther(data))) : 0;

const createChartData = (data: any) => {
  return {
    labels: ["Auxo Minted", "ARV Staked", "PRV Minted", "PRV Staked"],
    datasets: [
      {
        label: "Total",
        data: data?.map(format) ?? [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
};

function pc(vedough: number | string, auxo: number | string) {
  return parseFloat(String((Number(vedough)/(Number(auxo)*100+Number(vedough)))*100)).toFixed(2)
}

const AuxoReport: React.FC = () => {
  const { data, isLoading, error } = useReadBalances();
  const { data: veDoughData } = useVeDough()
  const { data: block, isLoading: blockLoading } = useBlockNumber()
  console.log(data);
  const chartData = React.useMemo(() => createChartData(data), [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const auxo = data ? format((data[0] as any)) : 0;
  const vedough = veDoughData ? format((veDoughData[0] as any)) : 0;

  return (
    <div>
      <header>
        <h1>Auxo Migration Stats</h1>
      </header>
      <section className="text">
        <p>
          {data ? auxo.toLocaleString() : '...'} Auxo Minted
        </p>
        <p>
        {veDoughData ? `${vedough.toLocaleString()} (${pc(vedough, auxo)}%)` : '...'} veDOUGH remaining
        </p>
      </section>
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </div>
        <section className="text">
          <p>Last Updated {blockLoading ? '...' : block}</p>
        </section>
    </div>
  );
};

export default AuxoReport;
