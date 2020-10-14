import axios from 'axios';
import { SERVER_URL } from './config'


const Api = axios.create({
    baseURL: SERVER_URL
})

export default Api;
