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

