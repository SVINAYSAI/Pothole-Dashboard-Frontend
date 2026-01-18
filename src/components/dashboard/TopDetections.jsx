import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import './TopDetections.css';

const TopDetections = ({ sessionId, donutChartData, donutChartLoading }) => {
  return (
    <Card className="donut-card">
      <Card.Body className="p-3">
        {donutChartLoading && donutChartData.series.length === 0 && sessionId ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <Spinner animation="border" size="sm" variant="primary" />
          </div>
        ) : (
          <div>
            <h5 className="donut-title" style={{ fontSize: '1rem' }}>Top 5 Detected Objects</h5>
            <Chart
              options={{
                chart: {
                  type: "donut",
                  toolbar: { show: false },
                  background: "transparent",
                },
                labels: donutChartData.labels.length > 0 ? donutChartData.labels : ['No Data'],
                colors: donutChartData.colors.length > 0 ? donutChartData.colors : ['#334155'],
                legend: {
                  position: 'bottom',
                  labels: { colors: '#94a3b8' },
                  fontSize: '11px',
                },
                dataLabels: {
                  enabled: true,
                  style: { fontSize: '11px', fontWeight: 'bold', colors: ['#fff'] },
                  formatter: (val) => val.toFixed(1) + '%'
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '70%',
                      labels: {
                        show: true,
                        name: { show: true, fontSize: '12px', color: '#ffffff', offsetY: -5 },
                        value: { show: true, fontSize: '18px', color: '#ffffff', offsetY: 5 },
                        total: { show: true, label: 'Total', fontSize: '10px', color: '#94a3b8' }
                      }
                    }
                  }
                },
                tooltip: { theme: "dark" },
              }}
              series={donutChartData.series.length > 0 ? donutChartData.series : [1]}
              type="donut"
              height={300}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TopDetections;