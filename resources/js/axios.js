import axios from 'axios';
import { hideLoading, showLoading } from './Services/LoadingService';

let requestCount = 0;

axios.interceptors.request.use(
    (config) => {
        requestCount++;

        if (requestCount === 1) {
            showLoading();
        }

        return config;
    },
    (error) => {
        requestCount = Math.max(0, requestCount - 1);

        if (requestCount === 0) {
            hideLoading();
        }

        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        requestCount = Math.max(0, requestCount - 1);

        if (requestCount === 0) {
            hideLoading();
        }

        return response;
    },
    (error) => {
        requestCount = Math.max(0, requestCount - 1);

        if (requestCount === 0) {
            hideLoading();
        }

        return Promise.reject(error);
    }
);