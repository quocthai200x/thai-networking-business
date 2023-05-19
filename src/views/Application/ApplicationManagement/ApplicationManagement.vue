<template >
    <div v-if="!roleStore.settings.applierFunction.canRead" class="text-caption text-capitalize text-negative"><i>**
            Bạn không có quyền đọc thông tin</i></div>
    <div v-if="!roleStore.settings.applierFunction.canWrite" class="text-caption text-capitalize text-negative"><i>**
            Bạn không có quyền sửa thông tin</i></div>
    <q-card flat class="q-pa-md">
        <q-card-section class="row">
            <div class="text-bold  text-h6">Danh sách ứng tuyển </div>
        </q-card-section>

        <q-card-section class="row justify-between ">
            <div>

                <q-select style="width: 300px;" dense color="deep-orange" outlined v-model="jobSelected"
                    :options="listJobsName">
                </q-select>
            </div>
            <div class="q-gutter-md row justify-end">

                <q-input style="width: 300px;" v-model="filter" color="deep-orange" outlined dense
                    placeholder="Tìm theo kí tự trên bảng">
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-select style="width: 300px;" dense color="deep-orange" outlined v-model="statusSelected"
                    :options="listRecruimentStatusOfJob">
                </q-select>
            </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
            <q-table :pagination="myInitialPagination" :filter="filter" separator="vertical" flat
                :rows="listApplicationShow" :columns="columns" row-key="name">
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="">
                            <span class="text-bold text-subtitle2">
                                {{ col.label }}
                            </span>
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="Ứng viên" :props="props">
                            <router-link :to="`/application/detail?id=${props.row._id}`">
                                <div class="">

                                    <q-avatar class="q-mr-md">
                                        <img :src="props.row.candidateId.info.avatar" />
                                    </q-avatar>
                                    <span class="cursor-pointer text-bold hover-text">
                                        {{ props.row.candidateId.info.name }}
                                    </span>
                                </div>

                            </router-link>
                        </q-td>
                        <q-td key="Chức danh" :props="props">

                            <div class="">
                                <span v-if="props.row.candidateId.info.positionPresent" class="">
                                    {{ props.row.candidateId.info.positionPresent }}
                                </span>
                                <span v-else>
                                    Chưa cập nhật
                                </span>
                            </div>


                        </q-td>
                        <q-td key="Nơi sinh sống" :props="props">

                            <div class="">
                                <span class="" v-if="props.row.candidateId.info.city">
                                    {{ props.row.candidateId.info.city }}
                                </span>
                                <span v-else>
                                    Chưa cập nhật
                                </span>
                            </div>


                        </q-td>
                        <q-td key="Thời gian tạo" :props="props">

                            <div class="">
                                <span class="">
                                    {{
                                        $moment((props.row.createdAt)).fromNow()
                                    }}
                                </span>
                            </div>


                        </q-td>
                        <q-td key="Trạng thái" :props="props" v-if="statusSelected == 'Tất cả'">

                            <div class="">
                                <span class=""
                                    v-if="!(props.row.status.value == 2 && this.listRecruitmentProcess[this.listJobsName.indexOf(this.jobSelected)].length > 0)">
                                    {{ props.row.status.name }}
                                </span>
                                <span class="" v-else>
                                    {{ props.row.status.note.name }}
                                </span>

                            </div>


                        </q-td>

                        <q-td key="Người xử lí" :props="props" v-if="userStore.roleNumber == 1">
                            <div class="">
                                <span class="">
                                    {{ props.row.handleBy.info.name ? props.row.handleBy.info.name : companyStore.info.name
                                    }}
                                    <!-- {{ props.row.handleBy }} -->
                                </span>

                            </div>


                        </q-td>
                        <q-td key="button-edit" :props="props">
                            <div class=" q-gutter-md justify-center row">
                                <div>
                                    <q-btn @click="attachNewEmployeeExcute(props.row)" size="sm" color="light-blue-6"
                                        icon="start" dense unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Chuyển tiếp</q-tooltip>
                                </div>

                            </div>
                        </q-td>

                    </q-tr>
                </template>
            </q-table>
        </q-card-section>
        <q-dialog v-model="popUp">
            <q-card style="width: 1000px; max-width: 80vw; max-height: 95vh;" flat>
                <q-card-section>
                    <div class="text-h6 text-bold">Chuyển tiếp ứng viên </div>
                </q-card-section>

                <q-card-section>
                    <div class="row">
                        <div class="col-7 q-pr-md">
                            <div class="text-bold q-mb-md">Ứng viên</div>
                            <div class="">
                                <CandidateCV class="" :candidateDetail="chosenApplication.candidateId.info"></CandidateCV>
                            </div>
                        </div>
                        <div class="col-5 column  justify-between">
                            <div>
                                <div class="text-bold q-mb-md">Nhân viên</div>

                                <q-select class="q-mb-md" style="width: 300px;" dense color="deep-orange" outlined
                                    v-model="employeeSelected" :options="listEmployee"
                                    :option-value="opt => Object(opt) === opt && 'email' in opt ? opt : null"
                                    :option-label="opt => Object(opt) === opt && 'email' in opt ? opt.info.name : '- Không có -'"
                                    emit-value map-options></q-select>
                                <div class="text-bold">Thông tin nhân viên</div>
                                <div class="row">
                                    <div class="col-3">Nhân viên: </div>
                                    <div class="col-9">{{ employeeSelected.info.name }}</div>
                                    <div class="col-3">Email: </div>
                                    <div class="col-9">{{ employeeSelected.email }}</div>
                                    <div class="col-3">Vai trò: </div>
                                    <div class="col-9">{{ employeeSelected.roleId.name }}</div>

                                </div>

                            </div>
                            <div class="row justify-end">

                                <q-btn @click="resetChosenApplication" flat color="black" label="Đóng" v-close-popup />
                                <q-btn :disable="!roleStore.settings.applierFunction.canWrite" @click="switchEmployeeHandle"
                                    flat color="negative" label="Chuyển tiếp" v-close-popup />
                            </div>
                        </div>
                    </div>

                </q-card-section>

            </q-card>

        </q-dialog>
    </q-card>
</template>
<script>
import { getApplicationByJobName, attachNewEmployee } from '../../../apis/application';
import { getJobsNameOfCompany } from '../../../apis/job';
import { applicationDictionary } from "../../../assets/dictionary/application"
import Drawer from '../../../layouts/Drawer.vue';
import { useCompanyStore } from '../../../stores/companyStore';
import { useRoleStore } from '../../../stores/roleStore';
import { useUserStore } from '../../../stores/userStore';
import { getAllEmployeeOfCompany } from "../../../apis/user"
import CandidateCV from "../../../components/Candidate/CandidateCV.vue"
import { useQuasar } from 'quasar'

export default {
    components: {
        CandidateCV,
    },
    data() {
        let columns = [

            {
                name: 'Ứng viên',
                required: true,
                label: 'Ứng viên',
                align: 'left',
                field: row => row.candidateId.info.name,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Chức danh',
                required: true,
                label: 'Chức danh',
                align: 'left',
                field: row => row.candidateId.info.positionPresent,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Nơi sinh sống',
                required: true,
                label: 'Nơi sinh sống',
                align: 'left',
                field: row => row.candidateId.info.city,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Thời gian tạo',
                required: true,
                label: 'Ứng tuyển vào',
                align: 'left',
                field: row => this.$moment((row.createdAt)).fromNow(),
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Trạng thái',
                label: 'Trạng thái',
                align: 'left',
                field: row => {
                    if (row.status.value == 2 && this.listRecruitmentProcess[this.listJobsName.indexOf(this.jobSelected)].length > 0) {
                        return row.status.note.name
                    } else {
                        return row.status.name
                    }
                },
                format: val => `${val}`,
                sortable: true
            },



        ]
        let userStore = useUserStore()
        let companyStore = useCompanyStore()
        if (userStore.roleNumber == 1) {
            columns.push({
                name: 'Người xử lí',
                required: true,
                label: 'Người xử lí',
                align: 'left',
                field: row => row.handleBy.info.name ? row.handleBy.info.name : companyStore.info.name,
                format: val => `${val}`,
                sortable: true

            })
        }
        columns.push({
            label: 'Hành động',
            name: 'button-edit',
            required: true,
            align: 'center',
        })
        return {
            $q: useQuasar(),
            employeeSelected: {},
            popUp: false,
            roleStore: useRoleStore(),
            userStore: userStore,
            companyStore: companyStore,
            filter: "",
            columns,
            myInitialPagination: {
                rowsPerPage: 10
            },
            listEmployee: [],
            listApplication: [],
            listApplicationShow: [],
            listJobsName: [],
            jobSelected: "",
            statusSelected: "Tất cả",
            listRecruimentStatusOfJob: [],
            listRecruitmentProcess: [],
            chosenApplication: "",
        }
    },

    watch: {
        "employeeSelected"(newValue) {
            console.log(newValue.email)
        },
        "listApplication"(newValue, oldValue) {
            this.listApplicationShow = [...this.listApplication];
            this.initStatus();
        },
        "statusSelected"(newValue, oldValue) {
            // modify column table
            if (newValue == "Tất cả") {
                // chưa có cột trạng thái
                if (!this.columns.some(element => element.name == "Trạng thái")) {
                    this.columns.splice(4, 0,
                        {
                            name: 'Trạng thái',
                            label: 'Trạng thái',
                            align: 'left',
                            field: row => {
                                if (row.status.value == 2 && this.listRecruitmentProcess[this.listJobsName.indexOf(this.jobSelected)].length > 0) {
                                    return row.status.note.name
                                } else {
                                    return row.status.name
                                }
                            },
                            format: val => `${val}`,
                            sortable: true
                        },
                    )
                }
            } else {
                this.columns = this.columns.filter(element => element.name != "Trạng thái")
            }

            // filter application

            this.listApplicationShow = this.listApplication.filter(element => {
                if (newValue == "Tất cả") {
                    return element
                }
                else if (element.status.name == newValue) {
                    return element
                } else if (element.status.note) {
                    if (element.status.note.name == newValue) {
                        return element
                    }
                }

            })
            console.log(this.listApplication)
            console.log(this.listApplicationShow)
        },
        "jobSelected"(newValue, oldValue) {
            if (newValue != oldValue && this.listJobsName.includes(newValue)) {
                this.$router.push({ path: '/application/management', query: { job: newValue } })
                this.fetchApplicationByJob()
                // console.log("hi")

            }
        },
        "$route.query.job"(newValue, oldValue) {
            if (newValue != oldValue && newValue) {
                this.jobSelected = newValue;
            }
        }
    },
    created() {
        this.$emit("update:layout", Drawer)
        if (this.roleStore.settings.applierFunction.canRead) {
            this.init();
        }

    },
    methods: {
        resetChosenApplication() {

        },
        switchEmployeeHandle() {
            console.log(this.chosenApplication._id)
            console.log(this.employeeSelected.email)
            attachNewEmployee({ applicationId: this.chosenApplication._id, newEmployeeHandle: this.employeeSelected.email }).then(data => {
                if (data) {
                    this.listApplication = this.listApplication.filter(item => item._id != data._id)
                    this.$q.notify({
                        message: `Chuyển tiếp cho nhân viên ${this.employeeSelected.info.name} thành công`,
                        color: 'green-6',
                        position: "bottom-right",
                        icon: 'check_circle',
                    })
                } else {
                    this.$q.notify({
                        message: 'Chuyển tiếp thất bại',
                        color: 'deep-orange',
                        position: "bottom-right",
                        icon: 'check_circle',
                    })
                }
            })

        },
        attachNewEmployeeExcute(application) {
            this.popUp = true;
            this.chosenApplication = application
        },
        init() {
            getAllEmployeeOfCompany().then(data => {
                if (data) {
                    // console.log(data)
                    this.listEmployee = data.filter(item => item.email != this.userStore.email)
                    this.employeeSelected = this.listEmployee[0]
                }
            })
            getJobsNameOfCompany().then(data => {
                if (data) {
                    data.forEach(element => {
                        this.listJobsName.push(element.info.name)
                        this.listRecruitmentProcess.push(element.info.recruitmentProcess)
                    })

                    if (this.$route.query.job && this.listJobsName.includes(this.$route.query.job)) {
                        this.jobSelected = this.$route.query.job
                    } else {
                        this.jobSelected = this.listJobsName[0]
                    }
                }
            })
        },
        fetchApplicationByJob() {
            if (this.jobSelected) {
                getApplicationByJobName({ jobName: this.jobSelected }).then(data => {
                    if (data) {
                        console.log(data)
                        this.listApplication = data;
                    }
                })

            }

        },
        initStatus() {
            this.listRecruimentStatusOfJob = [];
            let recruitmentProcessIfNeeded = [... this.listRecruitmentProcess[this.listJobsName.indexOf(this.jobSelected)]]
            this.statusSelected = "Tất cả"
            this.listRecruimentStatusOfJob.push("Tất cả")
            for (const key in applicationDictionary.status) {
                if (Object.hasOwnProperty.call(applicationDictionary.status, key)) {
                    const element = applicationDictionary.status[key];
                    if (element.value == 2 && recruitmentProcessIfNeeded.length > 0) {
                        recruitmentProcessIfNeeded.forEach(process => {
                            this.listRecruimentStatusOfJob.push(process.name)
                        })
                    }
                    else {
                        this.listRecruimentStatusOfJob.push(element.name)
                    }
                }
            }
            // console.log(this.listApplication)

        }
    }
}
</script>
<style lang="scss">
.hover-text:hover {
    color: $deep-orange;
    transition: ease-in-out 200ms;
}
</style>