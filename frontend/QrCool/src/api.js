import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.VITE_ENDPOINT}/api`
});