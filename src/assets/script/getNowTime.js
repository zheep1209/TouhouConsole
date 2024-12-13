import { ref } from 'vue';

export const currentTime = ref('');

export const getNowTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];

    return {
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        weekDay
    };
};

export const updateCurrentTime = () => {
    currentTime.value = getNowTime();
    setInterval(() => {
        currentTime.value = getNowTime();
    }, 1000); // 每秒更新一次时间
};
