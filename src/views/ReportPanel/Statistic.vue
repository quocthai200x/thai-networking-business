<template>
    <div v-if="visiblePage" class="q-my-md">
        <div>
            <StatusAmount :key="keyStatusAmount" :loading="loadingStatusAmount" :statusAmountData="statusAmountData">
            </StatusAmount>
        </div>
        <q-card flat>
            <q-card-section class="q-mb-md">
                <div class="text-bold q-pa-md text-subtitle2">Sự thay đổi trong số lượng ứng viên</div>

                <div class="row">
                    <div class="col-4">
                        <PieChart :key="keyPieChartCreatedBy" :loading="loadingPieChartCreatedBy"
                            :created-by-company="pieChartCreatedByData.createdByCompany"
                            :created-by-user="pieChartCreatedByData.createdByUser"></PieChart>
                    </div>
                    <div class="col-8">
                        COL 8
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <q-card flat>
            <q-card-section class="q-mb-md">

                <MultiSeriesColumn title="Thời gian trung bình theo nhân viên "
                    :average-time-per-employee="avgTimeData.averageTimePerEmployee" :key="keyAvgTimeData"
                    :loading="loadingAvgTimeData"></MultiSeriesColumn>

            </q-card-section>
        </q-card>
        <q-card flat>
            <q-card-section class="q-mb-md">

                <MultiSeriesColumn title="Thời gian trung bình theo công việc"
                    :average-time-per-job="avgTimeData.averageTimePerJob" :key="keyAvgTimeData"
                    :loading="loadingAvgTimeData"></MultiSeriesColumn>

            </q-card-section>
        </q-card>

        <q-card flat>
            <q-card-section class="q-mb-md">


                <LeaderBoard :dataLeaderboard="leaderBoard" :key="keyLeaderBoard" :loading="loadingLeaderBoard">
                </LeaderBoard>
            </q-card-section>
        </q-card>



        <q-card flat>
            <q-card-section class="q-mb-md">

                <div class="text-bold q-pa-md text-subtitle2">Tỉ lệ chuyển đổi </div>

                <CandidateFunnel :key="keyFunnel" :count-approved="funnel.countApproved"
                    :count-get-hired="funnel.countGetHired" :count-interview="funnel.countInterview"
                    :count-offer="funnel.countOffered" :count-turn-in="funnel.countTurnIn">
                </CandidateFunnel>
            </q-card-section>
        </q-card>



        <q-card flat>
            <q-card-section class="">
                <div class="text-bold q-pa-md text-subtitle2">Bảng hoạt động </div>
                <TableActivity :loading="loadingTableActivity" :list="dataTableActitivy.data" :key="keyTableActivity"
                    :isQueryEmployer="dataTableActitivy.isQueryEmployer" :isQueryJob="dataTableActitivy.isQueryJob">
                </TableActivity>
            </q-card-section>
        </q-card>
        <q-page-sticky class="bg-grey-3 q-pa-sm  row justify-between" expand position="top">
            <!-- <q-card flat class=" "> -->
            <div class="row q-ml-xl q-gutter-md">

                <div>
                    <q-select style="width: 300px;" v-model="selectedEmployer" :options="listEmployerShow"
                        :option-value="opt => Object(opt) === opt && opt != '' ? opt : ''"
                        :option-label="opt => Object(opt) === opt && opt != '' ? opt.info.name : 'Tất cả'"
                        color="deep-orange" label="Nhân viên" outlined hide-selected fill-input input-debounce="0" use-input
                        @filter="filterFnEmployer" dense placeholder="Tìm theo kí tự trên bảng"></q-select>
                </div>
                <div>

                    <q-select style="width: 300px;" v-model="selectedJob" :options="listJobShow"
                        :option-value="opt => Object(opt) === opt ? opt : null"
                        :option-label="opt => Object(opt) === opt ? opt.info.name : 'Tất cả'" color="deep-orange" outlined
                        label="Công việc" hide-selected fill-input input-debounce="0" use-input @filter="filterFnJob" dense
                        placeholder="Tìm theo kí tự trên bảng"></q-select>
                </div>
            </div>
            <div class=" q-mr-xl">
                <VueDatePicker v-model="date" range :format="formatDate" />
            </div>



            <!-- </q-card> -->
        </q-page-sticky>
    </div>
</template>
<script>
import { getJobsNameOfCompany } from "../../apis/job";
import { getCandidateFunnel, getCountAllStatus, getListStatistic, getCreatedByCount, getLeaderBoard, getAverageTime } from "../../apis/statistic"

import CandidateFunnel from "../../components/Statistic/CandidateFunnel.vue";
import Employer from "./Statistic/Employer.vue"
import { getAllEmployeeOfCompany } from '../../apis/user';
import TableActivity from "./Statistic/TableActivity.vue";
import Drawer from "../../layouts/Drawer.vue";
import StatusAmount from "./Statistic/StatusAmount.vue";
import PieChart from "../../components/Statistic/PieChart.vue";
import LeaderBoard from "./Statistic/LeaderBoard.vue";
import MultiSeriesColumn from "../../components/Statistic/MultiSeriesColumn.vue";

export default {
    components: {
        Employer, TableActivity, CandidateFunnel, StatusAmount, PieChart, LeaderBoard, MultiSeriesColumn
    },

    data() {
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const procedure_label = ['Nhận hồ sơ', "Duyệt hồ sơ", "Phỏng vấn", "Đề nghị nhận việc", "Đã tuyển", "Không đạt", "Ứng viên từ chối"]
        return {
            visiblePage: false,
            keyTableActivity: 0,
            dataTableActitivy: {
                data: [],
                isQueryEmployer: false,
                isQueryJob: false,
            },
            procedure_label: procedure_label,
            key: 0,
            date: [startDate, endDate],
            selectedEmployer: "",
            listEmployer: [],
            listEmployerShow: [],
            allFormatInput: {
                info: {
                    name: "- Tất cả - "
                }
            },
            selectedJob: "",
            listJob: [],
            listJobShow: [],
            keyFunnel: 0,
            funnel: {
                countApproved: 0,
                countGetHired: 0,
                countInterview: 0,
                countOffered: 0,
                countTurnIn: 0,
            },
            loadingTableActivity: true,
            loadingStatusAmount: true,
            keyStatusAmount: 0,
            statusAmountData: {
                countTurnIn: 0,
                countApproved: 0,
                countInterview: 0,
                countOffered: 0,
                countGetHired: 0,
                countNotQualify: 0,
                countRejectByUser: 0
            },
            loadingPieChartCreatedBy: true,
            keyPieChartCreatedBy: 0,
            pieChartCreatedByData: {
                createdByUser: 0,
                createdByCompany: 0
            },
            leaderBoard: [],
            keyLeaderBoard: 0,
            loadingLeaderBoard: true,

            avgTimeData: {
                averageTimePerEmployee: [],
                averageTimePerJob: [],
            },
            loadingAvgTimeData: true,
            keyAvgTimeData: 0,


        }
    },
    watch: {
        "selectedEmployer"(newValue, oldValue) {
            this.reloadStatistic()
        },
        "selectedJob"(newValue, oldValue) {
            this.reloadStatistic()
        },
        "date"(newValue, oldValue) {
            console.log(newValue)
            this.reloadStatistic()
        }
    },
    created() {
        this.$emit("update:layout", Drawer)
        setTimeout(() => {
            this.visiblePage = true;
        }, 0)
        this.init();
    },
    methods: {
        reloadStatistic() {
            this.getCandidateFunnelFunc();
            this.getListStatisticFunc();
            this.getCountAllStatusFunc();
            this.getPieChartCreatedByFunc();
            this.getLeaderBoardFunc();
            this.getAvgTimeDataFunc();
        },
        getAvgTimeDataFunc() {
            this.loadingAvgTimeData = true;
            this.keyAvgTimeData++;
            let checkSeletecedEmployer = this.selectedEmployer.info.name !== this.allFormatInput.info.name
            let checkSeletecedJob = this.selectedJob.info.name !== this.allFormatInput.info.name
            getAverageTime({ from: this.date[0], to: this.date[1], employerEmail: checkSeletecedEmployer ? this.selectedEmployer.email : "", jobName: checkSeletecedJob ? this.selectedJob.info.name : "" }).then(data => {
                if (data) {
                    this.avgTimeData = data;

                }
                this.loadingAvgTimeData = false;
                this.keyAvgTimeData++;
            })
        },
        getLeaderBoardFunc() {
            this.loadingLeaderBoard = true;
            this.keyLeaderBoard++;
            let checkSeletecedEmployer = this.selectedEmployer.info.name !== this.allFormatInput.info.name
            let checkSeletecedJob = this.selectedJob.info.name !== this.allFormatInput.info.name
            getLeaderBoard({ from: this.date[0], to: this.date[1], employerEmail: checkSeletecedEmployer ? this.selectedEmployer.email : "", jobName: checkSeletecedJob ? this.selectedJob.info.name : "" }).then(data => {
                if (data) {
                    this.leaderBoard = data;

                }
                this.loadingLeaderBoard = false;
                this.keyLeaderBoard++;
            })
        },
        getPieChartCreatedByFunc() {
            this.loadingPieChartCreatedBy = true;
            this.keyPieChartCreatedBy++;
            let checkSeletecedEmployer = this.selectedEmployer.info.name !== this.allFormatInput.info.name
            let checkSeletecedJob = this.selectedJob.info.name !== this.allFormatInput.info.name
            getCreatedByCount({ from: this.date[0], to: this.date[1], employerEmail: checkSeletecedEmployer ? this.selectedEmployer.email : "", jobName: checkSeletecedJob ? this.selectedJob.info.name : "" }).then(data => {
                if (data) {
                    this.pieChartCreatedByData = data;
                }
                this.loadingPieChartCreatedBy = false;
                this.keyPieChartCreatedBy++;
            })
        },
        getCountAllStatusFunc() {
            this.loadingStatusAmount = true;
            this.keyStatusAmount++;
            let checkSeletecedEmployer = this.selectedEmployer.info.name !== this.allFormatInput.info.name
            let checkSeletecedJob = this.selectedJob.info.name !== this.allFormatInput.info.name
            getCountAllStatus({ from: this.date[0], to: this.date[1], employerEmail: checkSeletecedEmployer ? this.selectedEmployer.email : "", jobName: checkSeletecedJob ? this.selectedJob.info.name : "" }).then(data => {
                if (data) {
                    this.statusAmountData = data;
                }
                this.loadingStatusAmount = false;
                this.keyStatusAmount++;
            })
        },
        getListStatisticFunc() {
            this.loadingTableActivity = true;
            this.keyTableActivity++;
            let checkSeletecedEmployer = this.selectedEmployer.info.name !== this.allFormatInput.info.name
            let checkSeletecedJob = this.selectedJob.info.name !== this.allFormatInput.info.name
            getListStatistic({ from: this.date[0], to: this.date[1], employerEmail: checkSeletecedEmployer ? this.selectedEmployer.email : "", jobName: checkSeletecedJob ? this.selectedJob.info.name : "" }).then(data => {
                if (data) {
                    this.dataTableActitivy = data;

                }
                this.loadingTableActivity = false;
                this.keyTableActivity++;
            })
        },
        getCandidateFunnelFunc() {
            let checkSeletecedEmployer = this.selectedEmployer.info.name !== this.allFormatInput.info.name
            let checkSeletecedJob = this.selectedJob.info.name !== this.allFormatInput.info.name
            getCandidateFunnel({ from: this.date[0], to: this.date[1], employerEmail: checkSeletecedEmployer ? this.selectedEmployer.email : "", jobName: checkSeletecedJob ? this.selectedJob.info.name : "" }).then(data => {
                if (data) {
                    // console.log(data);
                    this.funnel = data

                }
                this.keyFunnel++;
            })
        },
        init() {
            Promise.all([
                getAllEmployeeOfCompany(), getJobsNameOfCompany()
            ])
                .then((responses) => {
                    // responses is an array containing the resolved values of the promises
                    const listEmployerRes = responses[0];
                    const listJobRes = responses[1];
                    this.listEmployer = [this.allFormatInput, ...listEmployerRes];
                    this.listEmployerShow = [this.allFormatInput, ...listEmployerRes];
                    this.selectedEmployer = this.allFormatInput
                    // Handle the responses as needed
                    this.listJob = [this.allFormatInput, ...listJobRes];
                    this.listJobShow = [this.allFormatInput, ...listJobRes];
                    this.selectedJob = this.allFormatInput
                    // console.log('Response 1:', response1);
                    // console.log('Response 2:', response2);

                    // You can further process the responses or extract data from them
                    // return Promise.all([response1.json(), response2.json()]);
                })
                .catch((error) => {
                    // Handle any errors that occurred during the API calls or promise handling
                    console.error('Error:', error);
                });





        },
        formatDate(date) {
            const dayFrom = date[0].getDate();
            const monthFrom = date[0].getMonth() - 3;
            const yearFrom = date[0].getFullYear();

            const dayTo = date[1].getDate();
            const monthTo = date[1].getMonth() + 3;
            const yearTo = date[1].getFullYear();

            return `${dayFrom}/${monthFrom}/${yearFrom} - ${dayTo}/${monthTo}/${yearTo}  `;
        },
        filterFnJob(val, update) {
            if (val === '') {
                update(() => {
                    this.listJobShow = this.listJob

                    // here you have access to "ref" which
                    // is the Vue reference of the QSelect
                })
                return
            }

            update(() => {
                this.listJobShow = this.listJob.filter(v => v.info.name.includes(val))
            })
        },

        filterFnEmployer(val, update) {
            if (val === '') {
                update(() => {
                    this.listEmployerShow = this.listEmployer

                    // here you have access to "ref" which
                    // is the Vue reference of the QSelect
                })
                return
            }

            update(() => {
                this.listEmployerShow = this.listEmployer.filter(v => v.info.name.includes(val))


            })
        },

    },

}
</script>
<style lang="">
    
</style>