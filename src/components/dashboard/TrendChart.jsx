import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import './TrendChart.css';

const TrendChart = ({ sessionId, lineChartData, lineChartLoading }) => {
  return (
    <Row className="mb-4">
      <Col xs={12}>
        <Card className="trend-card">
          <Card.Body className="p-3">
            {lineChartLoading && lineChartData.series.length === 0 && sessionId ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" size="sm" variant="primary" />
              </div>
            ) : (
              <div>
                <h5 className="trend-title" style={{ fontSize: '1rem' }}>Detection Trend Analysis</h5>
                <Chart
                  options={{
                    chart: {
                      type: "area",
                      toolbar: { show: false },
                      background: "transparent",
                    },
                    stroke: { curve: 'smooth', width: 2 },
                    fill: {
                      type: 'gradient',
                      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] }
                    },
                    dataLabels: { enabled: false },
                    markers: { size: 0 },
                    xaxis: {
                      categories: lineChartData.categories.length > 0 ? lineChartData.categories : ['0', '100', '200', '300'],
                      labels: { style: { colors: "#64748b", fontSize: "10px" } },
                    },
                    yaxis: {
                      labels: { style: { colors: "#f8fafc", fontSize: "10px" } }
                    },
                    grid: { borderColor: "#334155", strokeDashArray: 4 },
                    legend: {
                      position: 'top',
                      labels: { colors: '#94a3b8' },
                      fontSize: '11px',
                    },
                    tooltip: { theme: "dark" },
                    colors: lineChartData.series.length > 0 ? lineChartData.series.map((s, i) => {
                      const classColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
                      return classColors[i % classColors.length];
                    }) : ['#334155']
                  }}
                  series={lineChartData.series.length > 0 ? lineChartData.series : [{ name: 'No Data', data: [0, 0, 0, 0] }]}
                  type="area"
                  height={300}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TrendChart;