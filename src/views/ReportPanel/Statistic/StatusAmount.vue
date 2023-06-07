<template >
    <q-card flat class="q-pa-md q-mb-md">
        <!-- <div class="text-bold q-pa-md text-subtitle2"> </div> -->

        <q-card-section class="row  q-gutter-y-xs">
            <div class="col q-pr-md rounded-borders">
                <div class="bg-grey-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Tổng
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!sloading">
                            {{ statusAmountData.countTurnIn
                                + statusAmountData.countApproved +
                                statusAmountData.countInterview +
                                statusAmountData.countOffered +
                                statusAmountData.countGetHired +
                                statusAmountData.countNotQualify +
                                statusAmountData.countRejectByUser }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-indigo-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Chờ xử lí
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{ statusAmountData.countTurnIn
                            }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-teal-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Duyệt hồ sơ
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{
                                statusAmountData.countApproved
                            }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-amber-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Phỏng vấn
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{
                                statusAmountData.countInterview }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-yellow-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Offer
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{
                                statusAmountData.countOffered }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-green-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Nhận việc
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{
                                statusAmountData.countGetHired }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-red-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Không đạt
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{
                                statusAmountData.countNotQualify }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col q-pr-md rounded-borders">
                <div class=" bg-pink-2">
                    <div class="column q-pa-md q-gutter-xs">
                        <div class="text-subtitle2">
                            Từ chối
                        </div>
                        <q-separator />
                        <div class="text-bold text-subtitle1" v-if="!loading">
                            {{
                                statusAmountData.countRejectByUser }}
                        </div>
                        <div v-else>
                            <q-spinner color="" size="1em" />
                        </div>
                    </div>
                </div>
            </div>


        </q-card-section>




    </q-card>
</template>
<script>
export default {
    props: {
        statusAmountData: Object,
        loading: Boolean,
    },
    data() {
        return {
         
           
        }
    }
}
</script>
<style lang="scss"></style>