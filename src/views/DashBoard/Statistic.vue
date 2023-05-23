<template>
    <div>
        <Employer></Employer>
    </div>
</template>
<script>
import {getCountAllStatusDevideToEmployee} from "../../apis/statistic"
import Employer from "./Statistic/Employer.vue"
export default {
    components:{
        Employer,
    },
    data() {
        return {
            from: "",
            to: "",
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            getCountAllStatusDevideToEmployee({ from: this.from, to: this.to }).then(data => {
            });
        }
    },
    components: { Employer }
}
</script>
<style lang="">
    
</style>