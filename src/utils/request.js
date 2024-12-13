/* ./src/utils/request.js */

// 1、引入axios
import axios from 'axios';
// 2、创建axios实例，在其中设置公共参数
export const instance = axios.create({
    baseURL: '', // 设置实际的API地址
    timeout: 1000, // 增加超时时间
    headers: {
        'Content-Type': 'application/json' // 默认设置为JSON
    },
    withCredentials: true // 允许携带凭证
});

// 3、设置请求拦截器；可在发送请求前对请求进行处理，如添加 token 等
instance.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response.data; // 返回data
}, async error => {
    if (error.response) {
        console.log(error);
        switch (error.response.status) {
            case 401:
                break;
            case 403:
                console.log('您没有权限访问此资源');
                break;
            case 404:
                console.log('请求的资源不存在');
                break;
            case 500:
                console.log('服务器内部错误，请稍后再试');
                break;
            case 502:
                console.log("网络错误，请联系管理");
                break;
        }
    } else if (error.request) {
        console.log('请求超时或网络错误');
    } else {
        console.log('请求设置错误');
    }
    return Promise.reject(error);
});

// 5、封装其他请求方法
export const get = (url, config = {}) => instance.get(url, config);
export const post = (url, data) => instance.post(url, data || {}); // 确保 data 是一个对象
export const put = (url, data) => instance.put(url, data || {}); // 确保 data 是一个对象
export const del = (url, data) => instance.delete(url, { data: data || {} }); // 确保 data 是一个对象

export default instance;
