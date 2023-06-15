<template >
    <div class="row">
        <div class="col-6">

            <q-card flat>
                <q-card-section>
                    <div class="text-bold  text-h6">Thiết lập trọng số</div>
                    <i class="text-caption">*Trọng số giúp tính điểm mỗi khi tuyển được ứng viên thành công</i>
                    <q-input color="deep-orange" dense type="number" outlined v-model="jobStore.form.score" />
                </q-card-section>
                <q-card-section>
                    <div class="text-bold  text-h6">Thiết lập kỳ vọng đạt được</div>
                    <i class="text-caption">*Tổng số điểm kỳ vọng đạt được</i>
                    <q-input color="deep-orange" dense type="number" outlined v-model="jobStore.form.targetScore" />

                </q-card-section>
                <q-card-section>
                    <div class="text-bold  text-h6">Thiết lập nhân viên xử lý</div>
                    <!-- <i class="text-caption">*Tổng số điểm kỳ vọng đạt được</i> -->
                    <!-- <q-input color="deep-orange" dense type="number" outlined v-model="jobStore.form.targetScore" /> -->
                    <q-select :options="listEmployerShow" bg-color="white" outlined color="deep-orange" dense
                        :option-value="opt => Object(opt) === opt && opt != '' ? opt.email : ''"
                        :option-label="opt => Object(opt) === opt && opt != '' ? (opt.name +  ' ('+opt.email + ')') : 'Tất cả'" 
                        multiple
                        type="text" v-model="jobStore.recruiter" label="Nhân viên" input-debounce="0" @filter="filterFn"
                        use-input />
                </q-card-section>
    

            </q-card>
        </div>
        <div class="col-6 q-pr-md">
            <q-card flat>
                <q-card-section>
                    <div class="text-bold  text-h6">Thiết lập quy trình tuyển dụng </div>
                </q-card-section>


                <q-card-section>
                    Bước 1: Nhận hồ sơ
                </q-card-section>
                <q-card-section>
                    Bước 2: Duyệt hồ sơ
                </q-card-section>
                <q-card-section>
                    Bước 3: Phỏng vấn
                </q-card-section>
                <q-card-section v-if="jobStore.form.recruitmentProcess.length != 0" class="q-gutter-sm">
                    <div class="q-ml-md row items-center q-gutter-sm"
                        v-for="(process, index) in jobStore.form.recruitmentProcess" :key="index + '-process'">
                        <div class="row fit">
                            <div class="col-2">Vòng 3.{{ index + 1 }}</div>
                            <div class="col-8">
                                {{ process }}
                            </div>
                            <div class="row q-gutter-xs col-2 justify-end">
                                <div>
                                    <q-btn @click="editProcess(index)" size="sm" color="light-blue-3" icon="edit" dense
                                        unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Chỉnh
                                        sửa</q-tooltip>
                                </div>
                                <div>
                                    <q-btn @click="removeProcess(index)" size="sm" color="deep-orange-2" icon="backspace"
                                        dense unelevated></q-btn>
                                    <q-tooltip anchor="center middle" self="center middle">Xóa </q-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                </q-card-section>
                <q-card-section>

                    <q-btn class="q-mb-md" @click="addRound" color="deep-orange" size="12px" unelevated label="Thêm vòng">
                    </q-btn>
                </q-card-section>
                <q-card-section>
                    Bước 4: Đề nghị nhận việc
                </q-card-section>
                <q-card-section>
                    Bước 5: Đã duyệt
                </q-card-section>
                <q-dialog v-model="isShowDialog">
                    <q-card>
                        <q-card-section>
                            <div class=" text-capitalize text-h6 text-bold">Sửa quy trình 3.{{ indexChoose + 1 }}</div>
                        </q-card-section>
                        <q-card-section>

                            <div>
                                <div class=" text-capitalize">
                                    <i>
                                        Mô tả tiến trình<span class="text-negative">*</span>

                                    </i>
                                </div>
                                <q-input outlined color="deep-orange" style="width: 400px;"
                                    v-model="jobStore.form.recruitmentProcess[indexChoose]" />
                            </div>
                        </q-card-section>

                        <q-card-actions align="right">
                            <q-btn flat label="Đóng" color="negative" v-close-popup />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </q-card>
        </div>



    </div>
</template>
<script>
import { useJobStore } from '../../stores/jobStore'
import { getAllEmployeeOfCompany } from "../../apis/user"


export default {
    data() {
        return {
            infoProcess: '',
            isShowDialog: false,
            jobStore: useJobStore(),
            indexChoose: -1,
            listEmployer: [],
            listEmployerShow: [],
        }
    },
    created() {
        this.init();
    },
    watch:{
        "jobStore.recruiter"(newVal, oldVal){
            console.log(newVal)
        }
    },
    methods: {
        filterFn(val, update) {
            update(() => {
                if (val === '') {
                    this.listEmployerShow = this.listEmployer
                }
                else {
                    this.listEmployerShow = this.listEmployer.filter(v => (v.name.includes(val) || v.email.includes(val)))
                }
            })
        },
        init() {
            getAllEmployeeOfCompany().then(data => {
                if (data) {
                    this.listEmployer = data.map(employer => { return { email: employer.email, name: employer.info.name } });
                    this.listEmployerShow = this.listEmployer;
                }
            })

        },
        addRound() {
            this.jobStore.form.recruitmentProcess.push("Hãy điền thông tin của tiến trình này")
        },
        editProcess(index) {
            this.isShowDialog = true;
            this.indexChoose = index;
        },
        removeProcess(index) {
            this.jobStore.form.recruitmentProcess.splice(index, 1)
        }
    }
}
</script>
<style lang="scss"></style>