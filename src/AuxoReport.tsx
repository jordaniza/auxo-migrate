import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useReadBalances, useVeDough } from "./hooks/useReadBalances"; // Import the custom hook
import { BigNumber, ethers } from "ethers";
import { useBlockNumber } from 'wagmi'

const format = (data?: BigNumber) => data ? Math.round(Number(ethers.utils.formatEther(data))) : 0;

const createChartData = (data: any) => {
  return {
    labels: ["Auxo Minted", "Auxo Staked", "ARV Minted", "PRV Minted", "PRV Staked"],
    datasets: [
      {
        label: "Total",
        data: data?.map(format) ?? [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 0.2)"
        ],
        borderWidth: 1,
      },
    ],
  };
};

function pc(vedough: number | string, auxo: number | string) {
  return parseFloat(String((Number(vedough)/(Number(auxo)*100+Number(vedough)))*100)).toFixed(2)
}

function arvprv(arv: number | string, prv: number | string) {
  const nArv = Number(arv)
  const nPrv = Number(prv)
  const total = nArv + nPrv
  const arvPc = (nArv/total)*100
  const prvPc = (nPrv/total)*100
  return `${arvPc.toFixed(0)}/${prvPc.toFixed(0)}  ARV/PRV`
}

function calculateRatios(_arv: string | number, _prv: string | number) {
  const arv = Number(_arv);
  const prv = Number(_prv);

  const total = arv + prv;
  return {
    arvPercentage: (arv / total) * 100,
    prvPercentage: (prv / total) * 100,
  };
}

const Ratio: React.FC<{ arv: string | number; prv: string | number }> = ({ arv, prv }) => {
  const { arvPercentage, prvPercentage } = calculateRatios(arv, prv);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fontSize = windowWidth < 500 ? '10px' : '12px';

  return (
    <>
      {arv && prv &&   (
      <div style={{ maxWidth: '600px', margin: '20px auto' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '100%', height: '20px', position: 'relative' }}>
          <div
            style={{
              background: `linear-gradient(90deg, rgba(255, 206, 86, 0.3) ${arvPercentage}%, rgba(75, 192, 192, 0.2) ${arvPercentage}%)`,
              width: '100%',
              height: '20px',
            }}
          ></div>
          <div style={{ position: 'absolute', left: '5px', top: '2px', color: 'white', fontSize: fontSize }}>
            ARV: {arvPercentage.toFixed(2)}%
          </div>
          <div style={{ position: 'absolute', right: '5px', top: '2px', color: 'white', fontSize: fontSize }}>
            PRV: {prvPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
      )}
    </>
  );
};



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
  const arv = data ? format((data[2] as any)) : 0;
  const prv = data ? format((data[3] as any)) : 0;

  return (
    <div>
      <header>
        <h1>Auxo Migration Stats</h1>
      </header>
      <section className="text">
        <p>
          {data ? auxo.toLocaleString() : '...'} Auxo Minted {data && `- ${arvprv(arv, prv)}`}
        </p>
        <p>
        {veDoughData ? `${vedough.toLocaleString()} (${pc(vedough, auxo)}%)` : '...'} veDOUGH remaining
        </p>
        <div>
        <Ratio arv={arv} prv={prv} />
      </div>
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
