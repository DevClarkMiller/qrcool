import axios from 'axios';

export const getEndpoint = () => { return import.meta.env.VITE_ENDPOINT };

export default axios.create({
    baseURL: `${getEndpoint()}/api`
});