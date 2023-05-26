<template >
  <CanvasJSChart :options="options" :style="styleOptions" />
</template>
<script>
import { CanvasJS } from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
import CanvasJSChart from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';

export default {
  components: {
    CanvasJSChart
  },
  props: {
    countTurnIn: Number,
    countApproved: Number,
    countInterview: Number,
    countOffer: Number,
    countGetHired: Number
  },
  methods: {
    calculatePercentage() {
      var dataPoint = this.options.data[0].dataPoints;
      var total = dataPoint[0].y;
      for (var i = 0; i < dataPoint.length; i++) {
        if (i == 0) {
          this.options.data[0].dataPoints[i].percentage = 100;
        } else {
          this.options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
        }
        // this.options.data[0].dataPoints[i].y++;
      }
    }
  },
  created() {
    this.calculatePercentage()
  },
  data() {
    CanvasJS.addColorSet("greenShades",
      [//colorSet Array

        "#ff7575",
        "#ff9575",
        "#ffaa75",
        "#ffd175",
        "#ffef75",
      ]);
    // console.log(this.countTurnIn, this.countApproved, this.countInterview, this.countOffer, this.countGetHired)
    return {
      chart: null,
      options: {
        // theme: "light2",
        animationEnabled: true,
        colorSet: "greenShades",
        title: {
          //   text: "Sales Lifecycle"
        },
        // dataPointMinWidth: 50,
        data: [{

          type: "funnel",
          indexLabel: "{name}: {y}",
          valueRepresents: "area",
     
          toolTipContent: "<b>{name}</b>: {y} <b>({percentage}%)</b>",
          // neckWidth: 1,
          legendText: "{label}",
          neckWidth: 100,
          neckHeight: 80,
          dataPoints: [
            { y: this.countTurnIn, name: "Chờ", },
            { y: this.countApproved, name: "Duyệt" },
            { y: this.countInterview, name: "Phỏng vấn" },
            { y: this.countOffer, name: "Đề nghị" },
            { y: this.countGetHired, name: "Nhận việc" },
            // { y: 0, name: "" }

          ]
        }]
      },
      styleOptions: {
        width: "100%",
        height: "300px"
      }
    }
  }
}
</script>
<style lang="scss"></style>