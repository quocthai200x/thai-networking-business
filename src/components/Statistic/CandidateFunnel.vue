<template >
      <CanvasJSChart :options="options" :style="styleOptions" />
</template>
<script>
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
    data() {
      return {
        chart: null,
        options: {
          theme: "light2",
          animationEnabled: true,
          title: {
        //   text: "Sales Lifecycle"
          },
          data: [{
            type: "funnel",
            indexLabel: "{name}: {y}",
            valueRepresents: "area",
            dataPoints: [
              { y: this.countTurnIn, name: "Chờ" },
              { y: this.countApproved, name: "Duyệt" },
              { y: this.countInterview, name: "Phỏng vấn" },
              { y: this.countOffer, name: "Đề nghị nhận việc" },
              { y: this.countGetHired, name: "Nhận việc" }
            ]
          }]
        },
        styleOptions: {
          width: "100%",
          height: "360px"
        }
      }
    }
  }
</script>
<style lang="scss"></style>