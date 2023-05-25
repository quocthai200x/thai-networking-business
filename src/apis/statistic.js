import axios from "@/axios"


export const getCountAllStatusDevideToEmployee = async ({from, to}) =>{
    try {
        let res = await axios.get(`/statistic?from=${from}&to=${to}`)
        if(res.status == 200){
            return res.data 
        }else{
            throw new Error(res.data)
        }
    } catch (error) {
        console.log(error)
    }
}



export const getCountEachEmployer = async ({from, to, email}) =>{
    try {
        let res = await axios.get(`/statistic/based-employer?from=${from}&to=${to}&email=${email}`)
        if(res.status == 200){
            return res.data 
        }else{
            throw new Error(res.data)
        }
    } catch (error) {
        console.log(error)
    }
}


export const getCandidateFunnel = async ({from, to, jobName, employerEmail}) =>{
    try {
        let res = await axios.get(`/statistic/candidate-funnel?from=${from}&to=${to}&jobName=${jobName}&employerEmail=${employerEmail}`)
        if(res.status == 200){
            return res.data 
        }else{
            throw new Error(res.data)
        }
    } catch (error) {
        console.log(error)
    }
}


export const getListStatistic = async ({from, to, jobName, employerEmail}) =>{
    try {
        let res = await axios.get(`/statistic/candidate-funnel?from=${from}&to=${to}&jobName=${jobName}&employerEmail=${employerEmail}`)
        if(res.status == 200){
            return res.data 
        }else{
            throw new Error(res.data)
        }
    } catch (error) {
        console.log(error)
    }
}

