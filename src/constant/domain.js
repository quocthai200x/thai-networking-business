
const FRONT_END_BASE = process.env.NODE_ENV === 'development'?'http://localhost:5173':'https://project-iii-front.vercel.app/'



export const LinkJobForRecruiter = ({jobName, companyId, recruiter}) => {
    return  FRONT_END_BASE + "/viec-lam/" + jobName + "---" + companyId + `?recruiter=${recruiter}`
}