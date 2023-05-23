<template >
    <q-card flat>
        <div class="row justify-between q-pa-md">

            <div class="text-bold  text-subtitle2">Thống kê theo nhân viên </div>
            <q-btn square flat  icon="download" />
        </div>
        <q-card-section class="row justify-between">

            <div class="row q-gutter-md">

                <q-select style="width: 300px;" v-model="selectedEmployer" :options="listEmployerShow"
                :option-value="opt => Object(opt) === opt ? opt : null"
                :option-label="opt => Object(opt) === opt ? opt.info.name : '- Chưa chọn -'" color="deep-orange" outlined
                hide-selected fill-input input-debounce="0" use-input @filter="filterFn" dense
                placeholder="Tìm theo kí tự trên bảng"></q-select>
                <div>
                    <VueDatePicker v-model="date" range :format="formatDate" />
                </div>
            </div>
            
        
          
         


        </q-card-section>
        <q-card-section class="row">
            <HorizontalBarChart axis="x" :key="key" label="Tổng quan" :list-data="final_summary"
                    :list-label="procedure_label"></HorizontalBarChart>
        </q-card-section>
        <q-card-section>
            <div class="row" :key="key">
                <div class="col-6" v-for="(job,index) in summary_each_jobs" :key="index">
                    <HorizontalBarChart axis="y"  :label="job.jobName" :list-data="job.array" :list-label="procedure_label"></HorizontalBarChart>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>
<script>
import { getCountEachEmployer } from '../../../apis/statistic';
import { getAllEmployeeOfCompany } from '../../../apis/user';
import HorizontalBarChart from '../../../components/Statistic/HorizontalBarChart.vue';



export default {
    components: {
        HorizontalBarChart,
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
            statisticEmployer: {

            },
            final_summary: Array(procedure_label.length).fill(0),
            summary_each_jobs: [],


        }
    },
    watch: {
        "selectedEmployer"(newValue, oldValue) {
            this.getCountEachEmployerFunc()
        },
        "date"(newValue, oldValue) {
            console.log(newValue)
            this.getCountEachEmployerFunc()
        }
    },
    created() {
        this.init()
    },
    methods: {
        formatDate(date) {
            const dayFrom = date[0].getDate();
            const monthFrom = date[0].getMonth() + 1;
            const yearFrom = date[0].getFullYear();

            const dayTo = date[1].getDate();
            const monthTo = date[1].getMonth() + 1;
            const yearTo = date[1].getFullYear();

            return `${dayFrom}/${monthFrom}/${yearFrom} - ${dayTo}/${monthTo}/${yearTo}  `;
        },
        filterFn(val, update) {
            console.log(val)
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
        init() {
            getAllEmployeeOfCompany().then(data => {
                if (data) {
                    this.listEmployer = data;
                    this.listEmployerShow = data;
                    this.selectedEmployer = data[0];
                } else {

                }
            })
        },
        getCountEachEmployerFunc() {
            if (this.listEmployer.length > 0) {

                getCountEachEmployer({ email: this.selectedEmployer.email, from: this.date[0], to: this.date[1] }).then(data => {
                    if (data) {
                        data.final_summary.forEach(ele => this.final_summary[ele.statusValue] = ele.count)
                        this.summary_each_jobs = data.data.map(job=>{
                            let array = Array(this.procedure_label.length).fill(0);
                            let jobName = job.jobName
                            job.newStatusCounts.forEach(status=> array[status.statusValue] = status.count)
                            return {array, jobName};
                        })
                        this.key++;
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
:root {
    /*General*/
    --dp-font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --dp-border-radius: 8px;
    /*Configurable border-radius*/
    --dp-cell-border-radius: 8px;
    /*Specific border radius for the calendar cell*/
    --dp-common-transition: all 0.1s ease-in;
    /*Generic transition applied on buttons and calendar cells*/

    /*Sizing*/
    --dp-button-height: 35px;
    /*Size for buttons in overlays*/
    --dp-month-year-row-height: 35px;
    /*Height of the month-year select row*/
    --dp-month-year-row-button-size: 35px;
    /*Specific height for the next/previous buttons*/
    --dp-button-icon-height: 20px;
    /*Icon sizing in buttons*/
    --dp-cell-size: 35px;
    /*Width and height of calendar cell*/
    --dp-cell-padding: 5px;
    /*Padding in the cell*/
    --dp-common-padding: 10px;
    /*Common padding used*/
    --dp-input-icon-padding: 35px;
    /*Padding on the left side of the input if icon is present*/
    --dp-input-padding: 9px 30px 9px 12px;
    /*Padding in the input*/
    --dp-menu-min-width: 260px;
    /*Adjust the min width of the menu*/
    --dp-action-buttons-padding: 2px 5px;
    /*Adjust padding for the action buttons in action row*/
    --dp-row-maring: 5px 0;
    /*Adjust the spacing between rows in the calendar*/
    --dp-calendar-header-cell-padding: 0.5rem;
    /*Adjust padding in calendar header cells*/
    --dp-two-calendars-spacing: 10px;
    /*Space between multiple calendars*/
    --dp-overlay-col-padding: 3px;
    /*Padding in the overlay column*/
    --dp-time-inc-dec-button-size: 32px;
    /*Sizing for arrow buttons in the time picker*/
    --dp-menu-padding: 6px 8px;
    /*Menu padding*/

    /*Font sizes*/
    --dp-font-size: 14px;
    /*Default font-size*/
    --dp-preview-font-size: 0.8rem;
    /*Font size of the date preview in the action row*/
    --dp-time-font-size: 0.8rem;
    /*Font size in the time picker*/

    /*Transitions*/
    --dp-animation-duration: 0.1s;
    /*Transition duration*/
    --dp-menu-appear-transition-timing: cubic-bezier(.4, 0, 1, 1);
    /*Timing on menu appear animation*/
    --dp-transition-timing: ease-out;
    /*Timing on slide animations*/
}

.dp__theme_light {
    --dp-background-color: #ffffff;
    --dp-text-color: #212121;
    --dp-hover-color: #f3f3f3;
    --dp-hover-text-color: #212121;
    --dp-hover-icon-color: #959595;
    --dp-primary-color: #ff5722;
    --dp-primary-text-color: #f8f5f5;
    --dp-secondary-color: #c0c4cc;
    --dp-border-color: #ddd;
    --dp-menu-border-color: #ddd;
    --dp-border-color-hover: #aaaeb7;
    --dp-disabled-color: #f6f6f6;
    --dp-scroll-bar-background: #f3f3f3;
    --dp-scroll-bar-color: #959595;
    --dp-success-color: #76d275;
    --dp-success-color-disabled: #a3d9b1;
    --dp-icon-color: #959595;
    --dp-danger-color: #ff6f60;
    --dp-highlight-color: rgba(25, 118, 210, 0.1);
}</style>