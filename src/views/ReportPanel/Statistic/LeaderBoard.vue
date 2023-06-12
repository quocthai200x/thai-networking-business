<template>
    <div class="row">
        <div class="col-6">
            <div class="q-mr-md">
                <div class=" col-6 text-bold q-pa-md text-subtitle2">Bảng xếp hạng </div>
                <CanvasJSChart :options="optionLeaderBoard" :style="styleOptions" />
            </div>
        </div>
        <div class="col-6">
            <div>
                <div class="col-6 text-bold q-pa-md text-subtitle2 ">Thông số chi tiết về {{ selectedEmployer }}</div>
                <CanvasJSChart :key="key" :options="optionsDetailEmployerData" :style="styleOptions" />
            </div>
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
        let topLeaderBoard = { y: 0 };
        this.optionLeaderBoard.data[0].dataPoints = this.optionLeaderBoard.data[0].dataPoints.map((everyEmployer, index) => {

            let newData = everyEmployer.data.map(job => {
                return {
                    ...job,
                    name: job.jobName,
                    y: job.totalScore,
                    count: job.total,
                }
            })
            if (everyEmployer.totalScore >= topLeaderBoard.y) {
                topLeaderBoard = {
                    data: newData,
                    y: everyEmployer.totalScore,
                    count: everyEmployer.total,
                    label: everyEmployer.handleByName
                }
            }
            return {
                data: newData,
                y: everyEmployer.totalScore,
                count: everyEmployer.total,
                label: everyEmployer.handleByName
            }
        })

        this.optionsDetailEmployerData.data[0].dataPoints = topLeaderBoard.data;
        this.selectedEmployer = topLeaderBoard.label
        this.key++;


    },
    methods: {
        showDetail(e) {
            console.log(e.dataPoint.data)
            this.optionsDetailEmployerData.data[0].dataPoints = e.dataPoint.data
            this.selectedEmployer = e.dataPoint.label
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
            selectedEmployer: "",
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
                    indexLabel: "{name}({total}): {y} điểm (#percent%) ",
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
                    toolTipContent: "<span style='\"'color: {color};'\"'>{label}</span> {y} điểm ({count} công việc)",
                    indexLabel: `{y} điểm `,
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