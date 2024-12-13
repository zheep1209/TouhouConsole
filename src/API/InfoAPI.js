import { get } from "@/utils/request.js";

export const getWeatherInfo = async (cityCode) => {
    try {
        const result = await get(`/amap/v3/weather/weatherInfo?output=json`, { params: { city: cityCode, key: 'a6b3124319c7588a5ae28902423f6960' } });
        if (result.status !== '1') {
            console.log('获取天气信息失败', result);
            throw new Error(`获取天气信息失败: ${result.info}`);
        }
        // console.log('获取天气信息成功', result);
        return result.lives[0];
    } catch (error) {
        console.error('获取天气信息失败:', error);
        throw error;
    }
};

export const getIpInfo = async () => {
    try {
        const result = await get(`/qqmap/ws/location/v1/ip?output=json`, { params: { key: 'RMMBZ-2GYE7-B23XI-P77P6-SKQ3E-2BBSQ', output: 'json' } });
        if (result.message !== 'Success') {
            console.log('获取ip信息失败', result);
            throw new Error('获取ip信息失败');
        }
        // console.log('获取ip信息成功', result);
        return result.result;
    } catch (error) {
        console.error('获取ip信息失败:', error);
        throw error;
    }
};
