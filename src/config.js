export default {
    rootPath: process.env.NODE_ENV === 'development'
    ?'http://localhost:5555':'https://thai-networking-server.vercel.app/'
    // rootPath: 'http://localhost:6969'
};