<template>
    <q-card>
        <q-card-section class="row justify-between">

            <div class="row q-gutter-md">

                <q-select style="width: 300px;" v-model="selectedEmployer" :options="listEmployerShow"
                    :option-value="opt => Object(opt) === opt ? opt : null"
                    :option-label="opt => Object(opt) === opt ? opt.info.name : '- Tất cả -'" color="deep-orange" outlined
                    hide-selected fill-input input-debounce="0" use-input @filter="filterFnEmployer" dense
                    placeholder="Tìm theo kí tự trên bảng"></q-select>
                <q-select style="width: 300px;" v-model="selectedJob" :options="listJobShow"
                    :option-value="opt => Object(opt) === opt ? opt : null"
                    :option-label="opt => Object(opt) === opt ? opt.info.name : '- Tất cả -'" color="deep-orange" outlined
                    hide-selected fill-input input-debounce="0" use-input @filter="filterFnJob" dense
                    placeholder="Tìm theo kí tự trên bảng"></q-select>
                <div>
                    <VueDatePicker v-model="date" range :format="formatDate" />
                </div>
            </div>

        </q-card-section>
        <Employer></Employer>
        <CandidateFunnel :key="keyFunnel" :count-approved="funnel.countApproved" :count-get-hired="funnel.countGetHired"
            :count-interview="funnel.countInterview" :count-offer="funnel.countOffered" :count-turn-in="funnel.countTurnIn">
        </CandidateFunnel>
    </q-card>
</template>
<script>
import { getJobsNameOfCompany } from "../../apis/job";
import { getCandidateFunnel, getCountAllStatusDevideToEmployee } from "../../apis/statistic"

import CandidateFunnel from "../../components/Statistic/CandidateFunnel.vue";
import Employer from "./Statistic/Employer.vue"
import { getAllEmployeeOfCompany } from '../../apis/user';

export default {
    components: {
        Employer,
    },
    data() {
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const procedure_label = ['Nhận hồ sơ', "Duyệt hồ sơ", "Phỏng vấn", "Đề nghị nhận việc", "Đã tuyển", "Không đạt", "Ứng viên từ chối"]
        return {
            procedure_label: procedure_label,
            key: 0,
            date: [startDate, endDate],
            selectedEmployer: "",
            listEmployer: [],
            listEmployerShow: [],

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
            }

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
        this.init();
    },
    methods: {
        reloadStatistic() {
            this.getCandidateFunnelFunc()
        },
        getCandidateFunnelFunc() {
            getCandidateFunnel({ from: this.date[0], to: this.date[1], employerEmail: this.selectedEmployer.email, jobName: this.selectedJob.info.name }).then(data => {
                if (data) {
                    console.log(data);
                    this.funnel = data
                    this.keyFunnel++;
                }
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
                    this.listEmployer = listEmployerRes;
                    this.listEmployerShow = listEmployerRes;
                    this.selectedEmployer = listEmployerRes[0];
                    // Handle the responses as needed
                    this.listJob = listJobRes;
                    this.listJobShow = listJobRes;
                    this.selectedJob = listJobRes[0]
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
            const monthFrom = date[0].getMonth() + 1;
            const yearFrom = date[0].getFullYear();

            const dayTo = date[1].getDate();
            const monthTo = date[1].getMonth() + 1;
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
        // init() {
        //     getCountAllStatusDevideToEmployee({ from: this.from, to: this.to }).then(data => {
        //     });
        // }
    },
    components: { Employer, CandidateFunnel }
}
</script>
<style lang="">
    
</style>