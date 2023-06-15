<template >
    <q-card flat class=" q-pa-md q-mb-md">
        <q-card-section>
            <div class="text-bold  text-h6">Danh sách đã và đang xử lý </div>
        </q-card-section>
        <q-card-section>
            <q-table :loading="loading" bordered class="my-sticky-header-table" :pagination="myInitialPagination"
                :filter="filter" separator="vertical" flat :rows="list" :columns="columns" row-key="name"
                :visible-columns="visibleColumns" no-data-label="Không có dữ liệu">
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
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="">
                            <span class="text-bold ">
                                {{ col.label }}
                            </span>
                        </q-th>
                    </q-tr>
                </template>
            </q-table>
        </q-card-section>
    </q-card>
</template>
<script>
import { getNotClose } from '../../../apis/application';
import { useUserStore } from '../../../stores/userStore';
import {roleDictionary} from "../../../assets/dictionary/role"
import { useRoleStore } from '../../../stores/roleStore';

export default {
    data() {
        let userStore = useUserStore();
        let roleStore = useRoleStore();
        let columns = [
            {
                name: 'Ứng viên',
                label: 'Ứng viên',
                align: 'left',
                field: row => row.candidateId.info.name,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Vị trí',
                label: 'Vị trí',
                align: 'left',
                field: row => row.jobId.info.name,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Nhân viên xử lý',
                label: 'Nhân viên xử lý',
                align: 'left',
                field: row => row.handleBy.info.name,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Trạng thái đơn',
                label: 'Trạng thái đơn',
                align: 'left',
                field: row => {
                    if(row.status.value == 2 ){
                        if(row.status.note){
                            return  `Vòng phỏng vấn ${row.status.note.value + 1} - ${row.status.note.name}`
                        }
                        return row.status.name;
                    }
                    return row.status.name
                },
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Cập nhật lần cuối',
                label: 'Cập nhật lần cuối',
                align: 'left',
                field: row => this.$moment((row.updatedAt)).fromNow(),
                format: val => `${val}`,
                sortable: true
            },
        ];
        let visibleColumns = ["Ứng viên", "Vị trí", "Nhân viên xử lý", "Trạng thái đơn", "Cập nhật lần cuối"];
        if(roleDictionary.isEmployee(userStore.roleNumber) && !roleStore.settings.adminFunction.isAdmin){
           visibleColumns = ["Ứng viên", "Vị trí", "Trạng thái đơn", "Cập nhật lần cuối"];
        }

        return {
            visibleColumns: visibleColumns,
            loading: false,
            list: [],
            filter: "",
            myInitialPagination: {
                rowsPerPage: 10
            },
            columns
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true
            getNotClose().then(data => {
                if (data) {
                    this.list = data.data;
                }
                this.loading = false;
            })
        }
    },
}
</script>
<style lang="scss"></style>