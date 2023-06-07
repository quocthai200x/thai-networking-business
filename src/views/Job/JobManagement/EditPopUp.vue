<template >
    <q-card flat>
        <q-card-section class="row">
            <div class="text-bold q-pa-md text-h6">Thông tin công việc </div>

        </q-card-section>
        <q-card-section class="">
            <div class="row q-px-md">
                <div class="col-8">
                    <div class="q-mr-md q-gutter-xs">
                        <div class="text-bold text-capitalize">Chức danh <strong class="text-negative">*</strong>
                        </div>
                        <q-input color="deep-orange" dense type="text" outlined v-model="jobStore.form.name" />
                    </div>
                </div>
                <div class="col-4">
                    <div class="q-gutter-xs">
                        <div class="text-bold text-capitalize">Cấp bậc <strong class="text-negative">*</strong>
                        </div>
                        <q-select class="q-pr-sm" name="size" model-value="size" dense outlined color="deep-orange"
                            v-model="levelInit" :options="levelOptions" />
                    </div>
                </div>
            </div>

        </q-card-section>
        <q-card-section>
            <div class="row fit q-px-md">
                <div class="col-8">
                    <div class="q-mr-md q-gutter-md">

                        <div class="text-bold text-capitalize">
                            <div class="q-mb-sm">
                                Địa điểm làm việc <strong class="text-negative">*</strong>
                            </div>
                            <div class="text-caption">
                                <q-btn @click="addLocation" class="bg-red-4" align="around" size="12px" outline
                                    color="white" label="Thêm địa điểm" icon="add" />
                            </div>
                        </div>

                        <div class="q-gutter-xs ">

                            <div class="row  text-capitalize q-my-sm"
                                v-for="(location, index ) in jobStore.form.workingAddress" :key="'location-' + index">
                                <div class="col-2">
                                    <div>
                                        {{ "Địa điểm " + (index + 1) + ": " }}
                                    </div>

                                </div>


                                <div class="col-8">
                                    <div class="q-pr-xs">
                                        <div>{{
                                            location.address + ", " + location.ward + ", " +
                                            location.district
                                            + ", " + location.province
                                        }}</div>
                                    </div>
                                </div>
                                <div class="col-2">
                                    <div class=" q-gutter-xs rounded-borders justify-end row">
                                        <div>
                                            <q-btn @click="showMap(index)" size="sm" color="light-green-3" icon="map" dense
                                                unelevated></q-btn>
                                            <q-tooltip anchor="center middle" self="center middle">Xem bản
                                                đồ</q-tooltip>
                                        </div>
                                        <div>
                                            <q-btn @click="editLocation(index)" size="sm" color="light-blue-3" icon="edit"
                                                dense unelevated></q-btn>
                                            <q-tooltip anchor="center middle" self="center middle">Chỉnh
                                                sửa</q-tooltip>
                                        </div>
                                        <div>
                                            <q-btn @click="removeLocation(index)" size="sm" color="deep-orange-2"
                                                icon="backspace" dense unelevated></q-btn>
                                            <q-tooltip anchor="center middle" self="center middle">Xóa địa
                                                chỉ</q-tooltip>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-bold text-capitalize">
                        <div class="q-mb-sm">
                            Thời gian hết hạn <strong class="text-negative">*</strong>
                        </div>
                        <q-input dense outlined color="deep-orange" v-model="date" mask="date" :rules="['date']">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date color="deep-orange" flat today-btn v-model="date" :options="optionsFn">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Đóng" color="deep-orange" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
            </div>

        </q-card-section>
        <q-card-section>
            <WorkingAreaSelectVue></WorkingAreaSelectVue>
        </q-card-section>
        <q-card-section>
            <BenefitsSelect></BenefitsSelect>
        </q-card-section>
        <q-card-section>
            <JobDescriptionCardVue></JobDescriptionCardVue>
        </q-card-section>
        <q-card-section>
            <RequirementDescriptionCardVue></RequirementDescriptionCardVue>
        </q-card-section>
        <q-card-section>
            <SalaryCardVue></SalaryCardVue>
        </q-card-section>
        <q-card-section>
            <SkillCardVue></SkillCardVue>
        </q-card-section>
        <q-card-section>
            <LanguageCardVue></LanguageCardVue>
        </q-card-section>
        <q-card-section>
            <div class="q-px-md row">
                <div class="col-6">
                    <div class="q-mr-md">
                        <div class="text-bold text-capitalize q-mb-xs">Thiết lập trọng số</div>
                        <i class="text-caption">*Trọng số giúp tính điểm mỗi khi tuyển được ứng viên thành công</i>
                        <q-input color="deep-orange" dense type="number" outlined v-model="jobStore.form.score" />
                    </div>
                </div>
                <div class="col-6">
                    <div>
                        <div class="text-bold text-capitalize q-mb-xs">Thiết lập kỳ vọng đạt được</div>
                        <i class="text-caption">*Tổng số điểm kỳ vọng đạt được</i>
                        <q-input color="deep-orange" dense type="number" outlined v-model="jobStore.form.targetScore" />
                    </div>
                </div>

            </div>
        </q-card-section>

    </q-card>
    <q-dialog v-model="isShowMap">
        <q-card>
            <q-card-section>
                <div class="text-h6">Bản đồ</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <GMapMap :center="{ lat: latitude, lng: longitude }" :zoom="18" map-type-id="terrain"
                    style="width: 400px; height: 400px">
                    <GMapMarker :position="{ lat: latitude, lng: longitude }" />
                </GMapMap>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Đóng" color="negative" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <DialogAddressVue v-model:isShowAddAddress="isShowAddAddress" v-model:isShowEditAddress="isShowEditAddress"
        v-model:indexToDialog="indexToDialog"></DialogAddressVue>
</template>
<script>


import { useRoleStore } from '../../../stores/roleStore'
import { useJobStore } from '../../../stores/jobStore'
import { jobDictionary } from "../../../assets/dictionary/job"
import WorkingAreaSelectVue from '../../../components/Job/WorkingAreaSelect.vue'
import DialogAddressVue from '../../../components/Job/DialogAddress.vue'
import JobDescriptionCardVue from '../../../components/Job/JobDescriptionCard.vue'
import RequirementDescriptionCardVue from '../../../components/Job/RequirementDescriptionCard.vue'
import SalaryCardVue from '../../../components/Job/SalaryCard.vue'
import SkillCardVue from '../../../components/Job/SkillCard.vue'
import LanguageCardVue from '../../../components/Job/LanguageCard.vue'
import { useQuasar, QSpinnerFacebook } from 'quasar'

import RecruitmentProcessCardVue from '../../../components/Job/RecruitmentProcessCard.vue'
import BenefitsSelect from '../../../components/Job/BenefitsSelect.vue'
import ReviewJobVue from '../../../components/Job/ReviewJob.vue'

export default {
    components: {
        ReviewJobVue,
        LanguageCardVue,
        JobDescriptionCardVue,
        WorkingAreaSelectVue,
        DialogAddressVue,
        RequirementDescriptionCardVue,
        SalaryCardVue,
        SkillCardVue,
        RecruitmentProcessCardVue,
        BenefitsSelect
    },
    data() {
        return {
            infoProcess: '',
            isShowDialog: false,
            jobStore: useJobStore(),
            indexChoose: -1,
            $q: useQuasar(),
            date: "",
            longitude: 0,
            latitude: 0,
            isShowMap: false,
            isShowAddAddress: false,
            isShowEditAddress: false,
            indexToDialog: -1,
            levelInit: {
                label: "",
                value: 0,
            },
            jobStore: useJobStore(),
            roleStore: useRoleStore(),
            levelOptions: [],
        }
    },
    watch: {
        "levelInit"(newValue) {
            this.jobStore.form.level = {
                name: newValue.label,
                level: newValue.value
            }
        },
        "date"(newValue) {
            this.jobStore.form.outdate = newValue

        }
    },
    created() {

        this.init();
    },
    methods: {
        addRound() {
            this.jobStore.form.recruitmentProcess.push("Hãy điền thông tin của tiến trình này")
        },
        editProcess(index) {
            this.isShowDialog = true;
            this.indexChoose = index;
        },
        removeProcess(index) {
            this.jobStore.form.recruitmentProcess.splice(index, 1)
        },

        optionsFn(date) {
            return date >= this.$moment(new Date()).format("YYYY/MM/DD")
        },
        init() {
            for (const level in jobDictionary.level) {
                if (Object.hasOwnProperty.call(jobDictionary.level, level)) {
                    const element = jobDictionary.level[level];
                    this.levelOptions.push({
                        label: element.name,
                        value: element.level,
                    })

                }
            };

            this.levelInit = this.jobStore.form.level
            // console.log(this.levelInit)
            this.date = this.$moment(this.jobStore.form.outdate).format("YYYY/MM/DD")
            // console.log(this.date)

        },
        showMap(index) {

            this.longitude = this.jobStore.form.workingAddress[index].longitude;
            this.latitude = this.jobStore.form.workingAddress[index].latitude;
            this.isShowMap = true;
        },
        removeLocation(index) {
            this.jobStore.form.workingAddress.splice(index, 1)
            // console.log(this.jobStore.form.workingAddress)
            //    this.jobStore.form.workingAddress = 
        },
        editLocation(index) {
            this.isShowEditAddress = true
            this.indexToDialog = index;

        },
        addLocation() {
            this.isShowAddAddress = true
            console.log(this.isShowAddAddress)
        },

    }
}
</script>
<style lang="">
    
</style>