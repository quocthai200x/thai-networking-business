<template >
    <q-card-section class="q-pt-lg">
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
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="	  bg-grey-2">
                        <span class="text-bold ">
                                {{ col.label }}
                            </span>
                    </q-th>
                </q-tr>
            </template>
        </q-table>
    </q-card-section>
</template>
<script>
export default {
    props: {
        loading: Boolean,
        list: Array,
        isQueryJob: Boolean,
        isQueryEmployer: Boolean
    },
    data() {
        let columns = [
            {
                name: 'Nhân viên',

                label: 'Nhân viên',
                align: 'left',
                field: row => row.handleBy,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Email',

                label: 'Email',
                align: 'left',
                field: row => row.handlerEmail,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Vị trí tuyển dụng',

                label: 'Vị trí tuyển dụng',
                align: 'left',
                field: row => row.jobName,
                format: val => `${val}`,
                sortable: true
            },
            {
                name: 'Tổng',

                label: 'Tổng',
                align: 'left',
                field: row => row.statusArray[0].count 
                    + row.statusArray[1].count 
                    + row.statusArray[2].count 
                    + row.statusArray[3].count 
                    + row.statusArray[4].count 
                    + row.statusArray[5].count 
                    + row.statusArray[6].count,                
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Tỷ lệ nhận',

                label: 'Tỷ lệ nhận',
                align: 'left',
                field: row => (100*row.statusArray[4].count 
                    /(row.statusArray[0].count 
                    + row.statusArray[1].count 
                    + row.statusArray[2].count 
                    + row.statusArray[3].count 
                    + row.statusArray[4].count 
                    + row.statusArray[5].count 
                    + row.statusArray[6].count)
                    ).toFixed(2) + "%",                
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Chờ xử lí',

                label: 'Chờ xử lí',
                align: 'left',
                field: row => row.statusArray[0].count,
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Duyệt',

                label: 'Duyệt',
                align: 'left',
                field: row => row.statusArray[1].count,
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Phỏng vấn',

                label: 'Phỏng vấn',
                align: 'left',
                field: row => row.statusArray[2].count,
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Offer',

                label: 'Offer',
                align: 'left',
                field: row => row.statusArray[3].count,
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Đã tuyển',

                label: 'Đã tuyển',
                align: 'left',
                field: row => row.statusArray[4].count,
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Không đạt',

                label: 'Không đạt',
                align: 'left',
                field: row => row.statusArray[5].count,
                format: val => `${val}`,
                sortable: true,
            },
            {
                name: 'Từ chối',

                label: 'Từ chối',
                align: 'left',
                field: row => row.statusArray[6].count,
                format: val => `${val}`,
                sortable: true,
            },
        ];
        let visibleColumns = ["Nhân viên", "Email", "Vị trí tuyển dụng", "Tổng",  'Tỷ lệ nhận', "Chờ xử lí", "Duyệt", "Phỏng vấn", "Offer", "Đã tuyển", "Không đạt", "Từ chối"];

        if (this.isQueryEmployer) {
            if (this.isQueryJob) {
                visibleColumns = ["Tổng",'Tỷ lệ nhận', "Chờ xử lí", "Duyệt", "Phỏng vấn", "Offer", "Đã tuyển", "Không đạt", "Từ chối"];
            } else {
                visibleColumns = ["Vị trí tuyển dụng", "Tổng",'Tỷ lệ nhận', "Chờ xử lí", "Duyệt", "Phỏng vấn", "Offer", "Đã tuyển", "Không đạt", "Từ chối"];
            }
        } else if (this.isQueryJob) {
            visibleColumns = ["Nhân viên", "Email", "Tổng",'Tỷ lệ nhận', "Chờ xử lí", "Duyệt", "Phỏng vấn", "Offer", "Đã tuyển", "Không đạt", "Từ chối"];
        }


        return {
            visibleColumns: visibleColumns,
            myInitialPagination: {
                rowsPerPage: 10
            },
            loading: this.loading,
            filter: "",
            list: this.list,
            columns,
            isQueryEmployer: this.isQueryEmployer,
            isQueryJob: this.isQueryJob
        }
    },


}
</script>
<style lang="scss"></style>