<template>
    <div class="">
        <CanvasJSChart :options="options" :styles="styleOptions" />
    </div>
</template>
<script>
import { CanvasJS } from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
import CanvasJSChart from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
export default {

    components: {
        CanvasJSChart
    },
    props: {
        averageTimePerEmployee: Array,
        averageTimePerJob: Array,
        loading: Boolean
    },
    created() {
        this.initData();
    },
    data() {
        CanvasJS.addColorSet("fiveStatus",
            [//colorSet Array

                "#ff7575",
                "#ff9575",
                "#ffaa75",
                "#ffd175",
                "#ffef75",
            ]);
        return {
            options: {
                animationEnabled: true,
                exportEnabled: true,
                // theme: "light2",
               
                colorSet: "fiveStatus",
                axisY: {
                    gridThickness: 0
                },
                legend: {
                    cursor: "pointer",
                    itemclick: this.toggleDataSeries,
                    fontSize: 12,
                },
                toolTip: {
                    shared: true
                },
                data: [{
                    type: "column",
                    name: "Tổng",
                    showInLegend: true,
                    indexLabelPlacement: "outside",
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Chờ xử lý - Duyệt",
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Duyệt - Phỏng vấn",
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Phỏng vấn - Offer",
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Offer - Nhận việc",
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                }]



            },
            styleOptions: {
                width: "100%",
                height: "360px"
            }
        }
    },
    methods: {
        initData() {
            if (this.averageTimePerEmployee) {
                if (this.averageTimePerEmployee.length > 0) {
                    let data = this.averageTimePerEmployee[0]
                    let totalAvg = [{ label: "Trung bình tổng", y: data.totalAvg }]
                    let avgTimeCreatedToApproved = [{ label: "Trung bình tổng", y: data.avgTimeCreatedToApproved }]
                    let avgTimeApproveToInterview = [{ label: "Trung bình tổng", y: data.avgTimeApproveToInterview }]
                    let avgTimeInterviewToOffer = [{ label: "Trung bình tổng", y: data.avgTimeInterviewToOffer }]
                    let avgTimeOfferToHired = [{ label: "Trung bình tổng", y: data.avgTimeOfferToHired }]
                    data.dataEachEmployer.forEach(employer => {
                        totalAvg.push({ label: employer._id.handleByName, y: employer.totalAvg })
                        avgTimeCreatedToApproved.push({ label: employer._id.handleByName, y: employer.avgTimeCreatedToApproved })
                        avgTimeApproveToInterview.push({ label: employer._id.handleByName, y: employer.avgTimeApproveToInterview })
                        avgTimeInterviewToOffer.push({ label: employer._id.handleByName, y: employer.avgTimeInterviewToOffer })
                        avgTimeOfferToHired.push({ label: employer._id.handleByName, y: employer.avgTimeOfferToHired })

                    })
                    this.options.data[0].dataPoints = totalAvg
                    this.options.data[1].dataPoints = avgTimeCreatedToApproved
                    this.options.data[2].dataPoints = avgTimeApproveToInterview
                    this.options.data[3].dataPoints = avgTimeInterviewToOffer
                    this.options.data[4].dataPoints = avgTimeOfferToHired
                   

                }
            }
            if (this.averageTimePerJob) {
                if (this.averageTimePerJob.length > 0) {
                    let data = this.averageTimePerJob[0]
                    let totalAvg = [{ label: "Trung bình tổng", y: data.totalAvg }]
                    let avgTimeCreatedToApproved = [{ label: "Trung bình tổng", y: data.avgTimeCreatedToApproved }]
                    let avgTimeApproveToInterview = [{ label: "Trung bình tổng", y: data.avgTimeApproveToInterview }]
                    let avgTimeInterviewToOffer = [{ label: "Trung bình tổng", y: data.avgTimeInterviewToOffer }]
                    let avgTimeOfferToHired = [{ label: "Trung bình tổng", y: data.avgTimeOfferToHired }]
                    data.dataEachJob.forEach(job => {
                        totalAvg.push({ label: job._id.jobName, y: job.totalAvg })
                        avgTimeCreatedToApproved.push({ label: job._id.jobName, y: job.avgTimeCreatedToApproved })
                        avgTimeApproveToInterview.push({ label: job._id.jobName, y: job.avgTimeApproveToInterview })
                        avgTimeInterviewToOffer.push({ label: job._id.jobName, y: job.avgTimeInterviewToOffer })
                        avgTimeOfferToHired.push({ label: job._id.jobName, y: job.avgTimeOfferToHired })

                    })
                    this.options.data[0].dataPoints = totalAvg
                    this.options.data[1].dataPoints = avgTimeCreatedToApproved
                    this.options.data[2].dataPoints = avgTimeApproveToInterview
                    this.options.data[3].dataPoints = avgTimeInterviewToOffer
                    this.options.data[4].dataPoints = avgTimeOfferToHired
                   
                }
            }

        },
        toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    }
}
</script>
