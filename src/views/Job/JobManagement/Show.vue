<template>
    <div class="">

        <q-input style="width: 300px;" v-model="filter" color="deep-orange" outlined dense placeholder="Tìm theo tên">
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="q-pt-lg">
            <q-table :pagination="myInitialPagination" :filter="filter" separator="vertical" flat :rows="data"
                :columns="columns" row-key="name">
                <template v-slot:header="props">
                    <q-tr class="bg-grey-2" :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="">
                            <span class="text-bold text-subtitle2">
                                {{ col.label }}

                            </span>
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="name" :props="props">

                            <router-link :to="`/application/management?job=${props.row.info.name}`">
                                <span class="cursor-pointer text-bold hover-text">
                                    {{ props.row.info.name }}
                                </span>
                            </router-link>

                        </q-td>
                        <q-td key="location" :props="props">
                            {{
                                props.row.info.workingAddress.map(element => (element.province)).join(", ")
                            }}
                        </q-td>
                        <q-td key="outdate" :props="props">
                            {{
                                $moment((props.row.info.outdate)).format("DD-MM-YYYY")
                            }}
                        </q-td>
                        <q-td key="button-edit" :props="props">
                            <div class=" q-gutter-md justify-center row">
                                <div>
                                    <q-btn @click="editJob(props.row._id)" size="sm" color="light-blue-6" icon="edit" dense
                                        unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Chỉnh
                                        sửa</q-tooltip>
                                </div>
                                <!-- <div>
                                    <q-btn @click="removeJob(props.row._id)" size="sm" color="deep-orange-6"
                                        icon="backspace" dense unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Xóa </q-tooltip>
                                </div> -->
                                <div>
                                    <q-btn @click="removeJob(props.row._id)" size="sm" color="grey-6" icon="visibility_off"
                                        dense unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Ẩn </q-tooltip>
                                </div>
                                <div>
                                    <q-btn @click="draftJob(props.row._id)" size="sm" color="lime-6" icon="drafts" dense
                                        unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Nháp </q-tooltip>
                                </div>
                                <div>
                                    <q-btn @click="saveToKeyBoard(props.row)" size="sm" color="grey-4" icon="save" dense
                                        unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Copy </q-tooltip>
                                </div>
                                <div>
                                    <q-btn @click="addHandler(props.row)" size="sm" color="green-4" icon="add" dense
                                        unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Thêm nhân viên xử lý </q-tooltip>
                                </div>

                            </div>
                        </q-td>

                    </q-tr>
                </template>
            </q-table>
        </div>
        <q-dialog full-width="" v-model="isEdit">
            <q-card>

                <q-card-section>
                    <EditPopUpVue></EditPopUpVue>
                </q-card-section>

                <q-card-actions class="q-px-xl q-mb-xl" align="center">
                    <q-btn @click="resetJobStore" size="16px" color="grey-8" label="Đóng" outline v-close-popup />
                    <q-btn :disable="!roleStore.settings.recruitmentFunction.canWrite" @click="updateJobInfo" size="16px"
                        unelevated label="Lưu" color="deep-orange-6" v-close-popup />
                </q-card-actions>
            </q-card>

        </q-dialog>
        <q-dialog v-model="isAddHandler">
            <q-card style="padding: 24px 12px 4px 12px;max-width: 80vw; max-height: 95vh;" flat>
                <q-card-section>
                    <div class="text-bold q-mb-md">Thêm nhân viên xử lý</div>


                    <div class="column  justify-between">
                        <div>


                            <q-select class="q-mb-md" style="width: 300px;" dense color="deep-orange" outlined
                                v-model="recruiterList" :options="optionEmployerListShow" multiple use-input
                                @filter="filterFn"
                                :option-value="opt => Object(opt) === opt && 'email' in opt && opt.email ? opt : null"
                                :option-label="opt => Object(opt) === opt && 'email' in opt && opt.email ? opt.info.name : '- Không có -'"
                                emit-value map-options></q-select>
                            <div>
                                <div class="text-bold q-mb-md">Danh sách </div>
                                <q-list bordered class="rounded-borders" style="overflow-y: scroll; max-height: 300px;">
                                    <q-item v-for="recruiter, index in recruiterList" :key="index">
                                    <q-item-section top>
                                        <q-item-label lines="1">
                                            <span class="text-weight-medium">{{recruiter.info.name }}</span>
                                        </q-item-label>
                                        <q-item-label caption lines="1">
                                           {{ recruiter.email }}
                                        </q-item-label>
                           
                                    </q-item-section>

                                    <q-item-section top side>
                                        <div class="text-grey-8 q-gutter-xs">
                                            <q-btn @click="deleteRecruiter(recruiter)" class="gt-xs" size="12px" flat dense round icon="delete" />
                                        </div>
                                    </q-item-section>
                                    </q-item>
                                </q-list>
                            </div>
                        </div>
                        <div class="row q-gutter-md justify-end q-mt-md">
                            <q-btn dense  @click="resetRecruiterListShow" flat color="black" label="Đóng" v-close-popup />
                            <q-btn dense :disable="!roleStore.settings.recruitmentFunction.canWrite" @click="updateRecruiterList"
                                flat color="negative" label="Cập nhật" v-close-popup />
                        </div>
                    </div>


                </q-card-section>

            </q-card>

        </q-dialog>

    </div>
</template>
<script>
import { useQuasar, QSpinnerFacebook } from 'quasar'
import { getJobByStatus, updateJob, updateStatus, getHandlerByJob, updateAttachEmployer } from "../../../apis/job"
import { getAllEmployeeOfCompany } from "../../../apis/user"

import { jobDictionary } from '../../../assets/dictionary/job'
import { useJobStore } from '../../../stores/jobStore'
import { useRoleStore } from '../../../stores/roleStore'
import EditPopUpVue from './EditPopUp.vue'
import { LinkJobForRecruiter } from "../../../constant/domain"
import { useCompanyStore } from '../../../stores/companyStore'
import { useUserStore } from '../../../stores/userStore'

export default {
    components: {
        EditPopUpVue
    },
    data() {
        let columns = [
            {
                name: 'name',
                required: true,
                label: 'Tên công việc',
                align: 'left',
                field: row => row.info.name,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'location',
                required: true,
                label: 'Địa điểm',
                align: 'left',
                field: row => row.info.workingAddress,
                format: val => {
                    if (val) {
                        let arr = []
                        val.forEach(location => {
                            arr.push(location.province)
                        })
                        return arr.join(", ")
                    }
                },
                sortable: true
            },
            {
                name: 'outdate',
                required: true,
                label: 'Ngày hết hạn',
                align: 'left',
                field: row => row.info.outdate,
                format: val => `${val} + 1`,
                sortable: true
            },
            {
                label: 'Hành động',
                name: 'button-edit',
                required: true,
                align: 'center',
            }


        ]
        return {
            companyStore: useCompanyStore(),
            userStore: useUserStore(),
            roleStore: useRoleStore(),
            choosenEditIndex: -1,
            isEdit: false,
            isAddHandler: false,
            jobStore: useJobStore(),
            filter: "",
            data: [],
            loadData: false,
            columns,
            $q: useQuasar(),
            myInitialPagination: {
                rowsPerPage: 10
            },
            optionEmployerList: [],
            optionEmployerListShow: [],
            recruiterList: [],
            jobSelected: {

            },
        }
    },
    created() {
        this.getJobs();
        this.getEmployer();
    },
    methods: {
        deleteRecruiter(recruiter){
            this.recruiterList = this.recruiterList.filter(recruiterItem => recruiterItem != recruiter)
        },
        filterFn(val, update) {
            update(() => {
                if (val === '') {
                    this.optionEmployerListShow = this.optionEmployerList
                }
                else {
                    this.optionEmployerListShow = this.optionEmployerList.filter(v => (v.email.includes(val) || v.info.name.includes(val)))
                }
            })
        },
        resetRecruiterListShow() {
            this.jobSelected = {

            };
            this.recruiterList = [];

        },
        updateRecruiterList() {
            // console.log(this.recruiterList);
            // console.log(this.jobSelected.info.name)
            let recruiter = this.recruiterList.map(recruiter => recruiter.email);
            updateAttachEmployer({ jobName: this.jobSelected.info.name, recruiter: recruiter }).then(data => {
                if (data) {
                    console.log(data);
                    this.$q.notify({
                        message: `Đã cập nhật danh sách nhân viên xử lý của ${this.jobSelected.info.name} thành công`,
                        color: 'green-6',
                        position: "bottom-right",
                        icon: 'check_circle',
                    })
                } else {
                    this.$q.notify({
                        message: `Đã cập nhật danh sách nhân viên xử lý của ${this.jobSelected.info.name} thất bại`,
                        color: 'deep-orange',
                        position: "bottom-right",
                        icon: 'check_circle',
                    })
                }
            })
        },
        getEmployer() {
            getAllEmployeeOfCompany().then(data => {
                if (data) {
                    console.log(data);
                    this.optionEmployerList = data.map(employer => {
                        return {
                            email: employer.email,
                            info: employer.info,
                        }
                    });
                    this.optionEmployerListShow = this.optionEmployerList;
                }
            })
        },
        addHandler(job) {
            this.isAddHandler = true;
            this.jobSelected = job;
            getHandlerByJob({ jobName: job.info.name }).then(data => {
                if (data) {
                    this.recruiterList = data.recruiterAttached.map(employer => {
                        return {
                            email: employer.email,
                            info: employer.info,
                        }
                    });
                }
            })
        },
        saveToKeyBoard(job) {
            let today = new Date();


            let outdate = new Date(job.info.outdate)
            // console.log(job)
            if (!job.recruiterAttached.includes(this.userStore._id)) {
                this.$q.notify({
                    message: `Chưa được thêm vào danh sách tuyển dụng của ${job.info.name}`,
                    color: 'deep-orange',
                    position: "bottom-right",
                    icon: 'check_circle',
                })
            } else {
                if (today <= outdate) {
                    const el = document.createElement('textarea');
                    el.value = LinkJobForRecruiter({ jobName: job.info.name, companyId: this.companyStore._id, recruiter: this.userStore.email })
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    this.$q.notify({
                        message: `Đã lưu công việc ${job.info.name} vào keyboard thành công`,
                        color: 'green-6',
                        position: "bottom-right",
                        icon: 'check_circle',
                    })
                } else {
                    this.$q.notify({
                        message: `Đã hết hạn cho công việc ${job.info.name}`,
                        color: 'deep-orange',
                        position: "bottom-right",
                        icon: 'check_circle',
                    })
                }
            }

            // if(job.outdate)
            // console.log(job.info.name)

        },
        resetJobStore() {
            this.jobStore.$reset()
        },
        updateJobInfo() {
            let hasCheck = this.checkFormJobFilled()
            if (hasCheck) {
                let saveObject = {
                    ...this.jobStore.form
                }
                saveObject.recruitmentProcess = this.jobStore.form.recruitmentProcess.map((element, index) => {
                    return ({
                        name: element, value: index
                    })
                })
                console.log(saveObject)
                this.$q.loading.show({
                    spinner: QSpinnerFacebook,
                    spinnerColor: 'deep-orange',
                    spinnerSize: 140,
                    message: 'Đang cập nhật. Vui lòng chờ...',
                })
                updateJob({ jobName: this.data[this.choosenEditIndex].info.name, info: saveObject }).then(data => {
                    if (data) {
                        this.$q.notify({
                            message: `Chỉnh sửa công việc ${data.info.name} thành công`,
                            color: 'green-6',
                            position: "bottom-right",
                            icon: 'check_circle',
                        })
                        this.data[this.choosenEditIndex].info = data.info
                        this.jobStore.$reset()
                        this.isEdit = false;
                        this.choosenEditIndex = -1
                    } else {
                        this.$q.notify({
                            message: 'Cập nhật thất bại',
                            color: 'deep-orange-6',
                            position: "bottom-right",
                            icon: 'report',
                        })
                    }
                    this.$q.loading.hide()

                })
            }

        },
        // hiddenJob(_id){
        //     let indexFound = this.data.findIndex(element => element._id == _id)
        //     if (indexFound >= 0) {

        //     }
        // },
        draftJob(_id) {
            let indexFound = this.data.findIndex(element => element._id == _id)
            if (indexFound >= 0) {
                let tempJob = this.data[indexFound]
                this.data.splice(indexFound, 1)
                // todo: đổi status thành nowhere
                updateStatus({ jobName: tempJob.info.name, status: jobDictionary.status.draft }).then(data => {
                    // console.log(data)
                    if (data) {
                        this.$q.notify({
                            message: `Đổi ${tempJob.info.name} - ${jobDictionary.status.draft.name} thành công`,
                            color: 'green-6',
                            position: "bottom-right",
                            icon: 'check_circle',
                        })
                    } else {
                        this.data.splice(indexFound, 0, tempJob)
                        this.$q.notify({
                            message: 'Thất bại',
                            color: 'deep-orange-6',
                            position: "bottom-right",
                            icon: 'check_circle',
                        })
                    }
                })

            }
        },
        removeJob(_id) {
            let indexFound = this.data.findIndex(element => element._id == _id)
            if (indexFound >= 0) {
                let tempJob = this.data[indexFound]
                this.data.splice(indexFound, 1)
                // todo: đổi status thành nowhere
                updateStatus({ jobName: tempJob.info.name, status: jobDictionary.status.hidden }).then(data => {
                    // console.log(data)
                    if (data) {
                        this.$q.notify({
                            message: `Đổi ${tempJob.info.name} - ${jobDictionary.status.hidden.name} thành công`,
                            color: 'green-6',
                            position: "bottom-right",
                            icon: 'check_circle',
                        })
                    } else {
                        this.data.splice(indexFound, 0, tempJob)
                        this.$q.notify({
                            message: 'Thất bại',
                            color: 'deep-orange-6',
                            position: "bottom-right",
                            icon: 'check_circle',
                        })
                    }
                })

            }
        },
        editJob(_id) {
            let indexFound = this.data.findIndex(element => element._id == _id)
            if (indexFound >= 0) {
                let transformData = { ... this.data[indexFound].info }
                this.choosenEditIndex = indexFound

                transformData.level = {
                    label: transformData.level.name,
                    value: 0
                };
                transformData.recruitmentProcess = transformData.recruitmentProcess.map(element => element.name)
                this.jobStore.form = { ...transformData }
                this.isEdit = true;
            }

        },
        getJobs() {
            this.loadData = true
            getJobByStatus({ status: "show" }).then(data => {
                if (data) {

                    this.data = data
                }
                console.log(this.data)

                this.loadData = false

            })

        },
        checkFormJobFilled() {
            let { name, level, type, workingAddress, desc, requirement, keyword, outdate } = this.jobStore.form
            let isAllFilled = true;

            if (!name) {
                this.notifyWithMessage("Thiếu chức danh công việc")
                isAllFilled = false;
            }
            if (!level.name) {
                this.notifyWithMessage("Thiếu cấp bậc công việc")
                isAllFilled = false;
            }
            if (type.length == 0) {
                this.notifyWithMessage("Thiếu lĩnh vực hoạt động")
                isAllFilled = false;
            }
            if (workingAddress.length == 0) {
                this.notifyWithMessage("Thiếu địa điểm làm việc")
                isAllFilled = false;
            }
            if (!desc) {
                this.notifyWithMessage("Thiếu mô tả công việc")
                isAllFilled = false;
            }
            if (!requirement) {
                this.notifyWithMessage("Thiếu yêu cầu công việc")
                isAllFilled = false;
            }
            if (keyword.length == 0) {
                this.notifyWithMessage("Thiếu kỹ năng cần thiết")
                isAllFilled = false;
            }
            if (!outdate) {
                this.notifyWithMessage("Thiếu ngày hết hạn tin tuyển dụng")
                isAllFilled = false;
            }



            return isAllFilled;
        },
        notifyWithMessage(message) {
            this.$q.notify({
                message,
                color: 'deep-orange-6',
                position: "bottom-right",
                icon: 'report',
            })
        }
    },
}
</script>
<style lang="scss">
.hover-text:hover {
    color: $deep-orange;
    transition: ease-in-out 200ms;
}

.marginY-XL {
    // margin-top: -;
}
</style>