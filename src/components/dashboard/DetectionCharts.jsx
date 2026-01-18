import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import './DetectionCharts.css';

const DetectionCharts = ({ 
  sessionId, 
  chartData, 
  chartLoading, 
  chartError,
  pieChartData,
  pieChartLoading,
  pieChartError 
}) => {
  return (
    <Row className="mb-4 g-3">
      {/* Bar Chart - Cumulative Counts */}
      <Col xs={12} lg={7}>
        <Card className="chart-card">
          <Card.Body className="p-4">
            {!sessionId ? (
              <div className="text-center py-5">
                <p className="text-muted">No active session. Start detection to view chart.</p>
              </div>
            ) : chartLoading && chartData.series.length === 0 ? (
              <div>
                <h5 className="chart-title">Cumulative Object Detection Counts</h5>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '420px' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              </div>
            ) : chartError ? (
              <div>
                <h5 className="chart-title">Cumulative Object Detection Counts</h5>
                <div className="alert alert-warning text-center" role="alert">
                  {chartError}
                </div>
              </div>
            ) : chartData.series.length === 0 ? (
              <div>
                <h5 className="chart-title">Cumulative Object Detection Counts</h5>
                <div className="text-center text-muted py-5">
                  No detections yet. Chart will update as objects are detected.
                </div>
              </div>
            ) : (
              <div>
                <h5 className="chart-title">Cumulative Object Detection Counts</h5>
                <Chart
                  options={{
                    chart: {
                      type: "bar",
                      toolbar: { show: false },
                      background: "transparent",
                      animations: {
                        enabled: true,
                        dynamicAnimation: {
                          enabled: true,
                          speed: 350
                        }
                      }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        borderRadius: 8,
                        barHeight: "60%",
                      },
                    },
                    colors: ["#1E90FF"],
                    dataLabels: {
                      enabled: true,
                      style: { colors: ["#fff"], fontSize: "13px", fontWeight: "bold" },
                    },
                    xaxis: {
                      categories: chartData.categories,
                      title: {
                        text: "Count",
                        style: { fontSize: "14px", fontWeight: "bold", color: "#666" },
                      },
                      labels: {
                        style: { colors: "#888", fontSize: "13px" },
                      },
                    },
                    yaxis: {
                      labels: {
                        style: { colors: "#ffffff", fontSize: "14px", fontWeight: 600 },
                      },
                      title: {
                        text: "Classes",
                        style: { fontSize: "14px", fontWeight: "bold", color: "#ffffff" },
                      },
                    },
                    grid: {
                      borderColor: "#e0e0e0",
                      strokeDashArray: 4,
                    },
                    tooltip: {
                      theme: "dark",
                      y: {
                        formatter: (val) => `${val} detections`,
                      },
                    },
                  }}
                  series={[
                    {
                      name: "Cumulative Count",
                      data: chartData.series,
                    },
                  ]}
                  type="bar"
                  height={420}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Pie Chart - Percentage Distribution */}
      <Col xs={12} lg={5}>
        <Card className="chart-card">
          <Card.Body className="p-4">
            {!sessionId ? (
              <div className="text-center py-5">
                <p className="text-muted">No active session. Start detection to view chart.</p>
              </div>
            ) : pieChartLoading && pieChartData.series.length === 0 ? (
              <div>
                <h5 className="chart-title">Detection Distribution (%)</h5>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '420px' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              </div>
            ) : pieChartError ? (
              <div>
                <h5 className="chart-title">Detection Distribution (%)</h5>
                <div className="alert alert-warning text-center" role="alert">
                  {pieChartError}
                </div>
              </div>
            ) : pieChartData.series.length === 0 ? (
              <div>
                <h5 className="chart-title">Detection Distribution (%)</h5>
                <div className="text-center text-muted py-5">
                  No detections yet. Chart will update as objects are detected.
                </div>
              </div>
            ) : (
              <div>
                <h5 className="chart-title">Detection Distribution (%)</h5>
                <Chart
                  options={{
                    chart: {
                      type: "pie",
                      toolbar: { show: false },
                      background: "transparent",
                      animations: {
                        enabled: true,
                        dynamicAnimation: {
                          enabled: true,
                          speed: 350
                        }
                      }
                    },
                    labels: pieChartData.labels,
                    colors: pieChartData.colors,
                    legend: {
                      position: 'bottom',
                      labels: {
                        colors: '#ffffff',
                        useSeriesColors: false
                      },
                      fontSize: '13px',
                      fontWeight: 600,
                      itemMargin: {
                        horizontal: 10,
                        vertical: 5
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        colors: ['#fff']
                      },
                      dropShadow: {
                        enabled: true,
                        top: 1,
                        left: 1,
                        blur: 1,
                        opacity: 0.8
                      },
                      formatter: function(val, opts) {
                        return val.toFixed(1) + '%';
                      }
                    },
                    tooltip: {
                      theme: "dark",
                      y: {
                        formatter: function(val, opts) {
                          const total = pieChartData.series.reduce((a, b) => a + b, 0);
                          const percentage = ((val / total) * 100).toFixed(1);
                          return `${val} detections (${percentage}%)`;
                        }
                      }
                    },
                    plotOptions: {
                      pie: {
                        expandOnClick: true,
                        donut: {
                          labels: {
                            show: false
                          }
                        }
                      }
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: 300
                        },
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }]
                  }}
                  series={pieChartData.series}
                  type="pie"
                  height={420}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DetectionCharts;