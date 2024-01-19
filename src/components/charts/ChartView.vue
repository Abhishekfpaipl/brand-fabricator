<template>
  <div style="max-height: 80vh;">
    <div v-if="showChartTypeOptions">
      <label for="chartType">Select Chart Type:</label>
      <select id="chartType" v-model="selectedChartType" @change="updateChartType">
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
        <option value="doughnut">Doughnut Chart</option>
        <option value="polarArea">Polar Area Chart</option>
        <option value="radar">Radar Chart</option>
        <option value="pie">Pie Chart</option>
      </select>
    </div>
    <canvas :id="'myChart' + chartIndex"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: ['chart', 'chartIndex'],
  data() {
    return {
      showChartTypeOptions: false,
      selectedChartType: 'bar', // Default chart type is bar
      chartInstance: null, // Store the chart instance
    };
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      if (!this.chart || !this.chart.data) return;
      const ctx = document.getElementById('myChart' + this.chartIndex).getContext('2d');

      let scales = {};
      if (this.selectedChartType === 'line' || this.selectedChartType === 'bar') {
        scales = {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.chart.titleY,
            },
          },
        };
      }
      this.chartInstance = new Chart(ctx, {
        type: this.selectedChartType, // Use the selected chart type
        data: this.chart.data,
        options: {
          scales,
        },
      });
    },
    updateChartType() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.createChart();
      }
    },
  },
};
</script>
