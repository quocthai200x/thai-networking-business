<template>
    <div class="row">
        <div class="col-6">
            <CanvasJSChart :options="optionLeaderBoard" :style="styleOptions" />

        </div>
        <div class="col-6">
            <CanvasJSChart :key="key" :options="optionsDetailEmployerData" :style="styleOptions" />
        </div>
    </div>
</template>
<script>
import { CanvasJS } from '../../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
import CanvasJSChart from '../../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';



export default {
    props: {
        dataLeaderboard: Array,
        loading: Boolean,
    },
    created() {
        this.optionLeaderBoard.data[0].dataPoints = this.optionLeaderBoard.data[0].dataPoints.map((everyEmployer,index) => {
       
            let newData = everyEmployer.data.map(job => {
                return {
                    ...job,
                    name: job.jobName,
                    y: job.totalScore,
                }
            })
            if(index == 0){
                // console.log(newData)
                this.optionsDetailEmployerData.data[0].dataPoints = newData
                this.key++;
            }
            return {
                data: newData,
                y: everyEmployer.totalScore,
                label: everyEmployer.handleByName
            }
        })
        
    },
    methods: {
        showDetail(e) {
            console.log(e.dataPoint.data)
            this.optionsDetailEmployerData.data[0].dataPoints = e.dataPoint.data
            this.key++;

            // alert(e.dataSeries.type + ", dataPoint { x:" + e.dataPoint.x + ", y: " + newone + " }");
        },
        explodePie(e) {
            if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
                e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
            } else {
                e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
            }
            e.chart.render();

        }
    },
    components: {
        CanvasJSChart
    },
    data() {
        CanvasJS.addColorSet("detailsLeaderboard",
      [//colorSet Array

        "#ff7575",
        "#ff9575",
        "#ffaa75",
        "#ffd175",
        "#ffef75",
      ]);
        CanvasJS.addColorSet("leaderBoardColorSet",
            [//colorSet Array
                "#ff7575",
                // "#ffd175",

            ]);


        return {
            key: 0,
            chart: null,
            styleOptions: {
                maxHeight: '250px'

            },
            optionsDetailEmployerData: {
                animationEnabled: true,
                colorSet: "detailsLeaderboard",
                legend: {
                    cursor: "pointer",
                    itemclick: this.explodePie
                },
                data: [{
                    startAngle: 45,
                    type: "pie",
                    // showInLegend: true,
                    toolTipContent: "<span style='\"'color: {color};'\"'>{name}</span> {y}(#percent%)",
                    cursor: "pointer",
                    indexLabel: "{name}: {y}(#percent%)",
                    dataPoints: []
                }]
            },

            optionLeaderBoard: {
                axisY: {
                    gridThickness: 0
                },
                colorSet: "leaderBoardColorSet",
                animationEnabled: true,
                // exportEnabled: true,
                dataPointMaxWidth: 50,
                data: [{
                    indexLabelPlacement: "outside",  
                    indexLabel: "{y}",
                    click: this.showDetail,
                    cursor: "pointer",
                    type: "bar",
                    // yValueFormatString: "#,###M tonnes",
                    dataPoints: this.dataLeaderboard
                }]
            }
        }
    }
}
</script>
<style lang="scss"></style>