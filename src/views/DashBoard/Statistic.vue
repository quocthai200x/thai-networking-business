<template>
    <div>
        
    </div>
</template>
<script>
import {getCountAllStatusDevideToEmployee} from "../../apis/statistic"
export default {
    data(){
        return{
            from: '',
            to: '',
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            getCountAllStatusDevideToEmployee({from: this.from, to: this.to}).then(data=>{
                console.log(data)
            })
        }
    }
}
</script>
<style lang="">
    
</style>