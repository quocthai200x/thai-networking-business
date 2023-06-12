<template>
    <div class="">
        <div class="row justify-between">
            <div class="text-bold q-pa-md text-subtitle2">{{ title }} </div>
            <div>

                <q-btn-toggle v-model="toggle" flat dense toggle-color="deep-orange" :options="[
                    { value: 'table', slot: 'one' },
                    { value: 'chart', slot: 'two' },

                ]">
                    <template v-slot:one>
                        <div class="row items-center no-wrap">
                            <q-icon dense name="table_view" />
                        </div>
                    </template>

                    <template v-slot:two>
                        <div class="row items-center no-wrap">
                            <q-icon dense name="show_chart" />
                        </div>
                    </template>


                </q-btn-toggle>
            </div>
        </div>
        <CanvasJSChart v-if="toggle == 'chart'" :options="options" :styles="styleOptions" />
        <div class="q-pa-md" v-if="toggle == 'table'">
            <q-table :loading="loading" bordered class="my-sticky-header-table" :pagination="myInitialPagination"
                :filter="filter" separator="vertical" flat :rows="rows" :columns="columns" row-key="name"
                no-data-label="Không có dữ liệu">
                <template v-slot:top="props">
                    <q-input style="width: 300px;" v-model="filter" color="deep-orange" outlined dense
                        placeholder="Tìm theo kí tự trên bảng">
                        <template v-slot:prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-space />
                    <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="props.toggleFullscreen" class="q-ml-md" />

                </template>

                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="	  bg-grey-2">
                            <span class="text-bold ">
                                {{ col.label }}
                            </span>
                        </q-th>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </div>
</template>
<script>
import { CanvasJS } from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
import CanvasJSChart from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
import moment from "moment"
export default {

    components: {
        CanvasJSChart
    },
    props: {
        averageTimePerEmployee: Array,
        averageTimePerJob: Array,
        loading: Boolean,
        title: String,
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
        const columns = [
            {
                name: 'Tên',
                required: true,
                label: 'Tên',
                align: 'left',
                field: row => row.name,
                format: val => `${val}`,
                sortable: true
            },

            {
                name: 'Tổng thời gian',
                required: true,
                label: 'Tổng thòi gian',
                align: 'left',
                field: row => this.$moment.duration(row.totalAvg).humanize(),
                format: val => val,
                sortable: true
            },
            {
                name: 'Chờ hồ sơ - Duyệt hồ sơ',
                required: true,
                label: 'Chờ hồ sơ - Duyệt hồ sơ',
                align: 'left',
                field: row => this.$moment.duration(row.avgTimeCreatedToApproved).humanize(),
                format: val => val,
                sortable: true
            },
            {
                name: 'Duyệt hồ sơ - Phỏng vấn',
                required: true,
                label: 'Duyệt hồ sơ - Phỏng vấn',
                align: 'left',
                field: row => this.$moment.duration(row.avgTimeApproveToInterview).humanize(),
                format: val => val,
                sortable: true
            },
            {
                name: 'Phỏng vấn - Offer',
                required: true,
                label: 'Phỏng vấn - Offer',
                align: 'left',
                field: row => this.$moment.duration(row.avgTimeInterviewToOffer).humanize(),
                format: val => val,
                sortable: true
            },
            {
                name: 'Offer - Nhận việc',
                required: true,
                label: 'Offer - Nhận việc',
                align: 'left',
                field: row => this.$moment.duration(row.avgTimeOfferToHired).humanize(),
                format: val => val,
                sortable: true
            },
        ]
        return {
            columns,

            myInitialPagination: {
                rowsPerPage: 10
            },
            filter: "",
            rows: [],
            toggle: "table",
            options: {
                animationEnabled: true,
                exportEnabled: true,
                // theme: "light2",

                colorSet: "fiveStatus",
                axisY: {
                    gridThickness: 0,
                    labelFormatter: function (e) {
                        return moment.duration(e.value).humanize();
                    }
                },
                legend: {
                    cursor: "pointer",
                    itemclick: this.toggleDataSeries,
                    fontSize: 12,
                },
                toolTip: {
                    shared: true,
                    animationEnabled: true,
                 
                    contentFormatter: function (e) {
                        var content = " ";
                   
                        for (var i = 0; i < e.entries.length; i++) {
                            content += `<span >` + e.entries[i].dataSeries.name + "</span>" + ": " + "<strong>" + moment.duration(e.entries[i].dataPoint.y).humanize() + "</strong>";
                            content += "<br/>";
                        }
                        return content;
                    }

                },
                data: [{
                    type: "column",
                    name: "Tổng",
                    showInLegend: true,
                    indexLabelPlacement: "outside",
                    // toolTipContent: `<span style='\"'color: {color};'\"'>Tổng</span> ${moment.duration("{y}").humanize()}`,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Chờ xử lý - Duyệt",
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    // toolTipContent: `<span style='\"'color: {color};'\"'>Chờ xử lý - Duyệt</span> ${moment.duration("{y}").humanize()}`,
                    // yValueFormatString: moment.duration("######").humanize(),
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Duyệt - Phỏng vấn",
                    indexLabelPlacement: "outside",
                    // toolTipContent: `<span style='\"'color: {color};'\"'>Duyệt - Phỏng vấn</span> ${moment.duration("{y}").humanize()}`,
                    showInLegend: true,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Phỏng vấn - Offer",
                    indexLabelPlacement: "outside",

                    // toolTipContent: `<span style='\"'color: {color};'\"'>Phỏng vấn - Offer</span> ${moment.duration("{y}").humanize()}`,
                    showInLegend: true,
                    // yValueFormatString: "$##,###K",
                    dataPoints: [

                    ]
                },
                {
                    type: "column",
                    name: "Offer - Nhận việc",
                    indexLabelPlacement: "outside",
                    // toolTipContent: `<span style='\"'color: {color};'\"'>Offer - Nhận việc</span> ${moment.duration("{y}").humanize()}`,
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
                    this.rows = [{
                        name: "Trung bình tổng",
                        totalAvg: data.totalAvg,
                        avgTimeCreatedToApproved: data.avgTimeCreatedToApproved,
                        avgTimeApproveToInterview: data.avgTimeApproveToInterview,
                        avgTimeInterviewToOffer: data.avgTimeInterviewToOffer,
                        avgTimeOfferToHired: data.avgTimeOfferToHired
                    }]
                    data.dataEachEmployer.forEach(employer => {
                        this.rows.push({
                            name: employer._id.handleByName,
                            totalAvg: employer.totalAvg,
                            avgTimeCreatedToApproved: employer.avgTimeCreatedToApproved,
                            avgTimeApproveToInterview: employer.avgTimeApproveToInterview,
                            avgTimeInterviewToOffer: employer.avgTimeInterviewToOffer,
                            avgTimeOfferToHired: employer.avgTimeOfferToHired,
                        })
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
                    this.rows = [{
                        name: "Trung bình tổng",
                        totalAvg: data.totalAvg,
                        avgTimeCreatedToApproved: data.avgTimeCreatedToApproved,
                        avgTimeApproveToInterview: data.avgTimeApproveToInterview,
                        avgTimeInterviewToOffer: data.avgTimeInterviewToOffer,
                        avgTimeOfferToHired: data.avgTimeOfferToHired
                    }]
                    data.dataEachJob.forEach(job => {
                        this.rows.push({
                            name: job._id.jobName,
                            totalAvg: job.totalAvg,
                            avgTimeCreatedToApproved: job.avgTimeCreatedToApproved,
                            avgTimeApproveToInterview: job.avgTimeApproveToInterview,
                            avgTimeInterviewToOffer: job.avgTimeInterviewToOffer,
                            avgTimeOfferToHired: job.avgTimeOfferToHired,
                        })
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
