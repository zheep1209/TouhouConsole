export function measureBW(url = "/baidu/it/u=746758998,696716845&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889", timeout = 5000, defaultSpeed = 50) {
    return new Promise((resolve) => {
        let startTime = 0;
        let fileSize = 0;
        let xhr = new XMLHttpRequest();
        let measureTimerStatus = false;

        // 防止缓存
        const noCacheUrl = `${url}?_=${Date.now()}`;

        // 超时定时器
        let measureTimer = setTimeout(() => {
            if (!measureTimerStatus) {
                // console.warn(`MeasureBW timed out, resolving with default value of ${defaultSpeed} KB/s`);
                measureTimerStatus = true;
                resolve(defaultSpeed);
            }
        }, timeout);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 3 && !startTime) {
                startTime = performance.now(); // 使用高精度时间
            }
            if (xhr.readyState === 4) {
                let endTime = performance.now(); // 记录结束时间
                if (xhr.status === 200) {
                    fileSize = xhr.response.byteLength;
                    let timeElapsed = (endTime - startTime) / 1000; // 秒
                    if (timeElapsed > 0.001 && fileSize > 0) { // 避免过小的时间间隔
                        let speed = fileSize / timeElapsed / 1024;
                        // console.log('measureBW res:', speed.toFixed(2), 'KB/s');
                        measureTimerStatus = true;
                        clearTimeout(measureTimer);
                        resolve(Math.floor(speed));
                    } else {
                        // console.warn('Invalid timing or file size (too small), resolving with default value');
                        measureTimerStatus = true;
                        clearTimeout(measureTimer);
                        resolve(defaultSpeed);
                    }
                } else {
                    // console.error('MeasureBW failed with status:', xhr.status);
                    measureTimerStatus = true;
                    clearTimeout(measureTimer);
                    resolve(defaultSpeed);
                }
            }
        };

        xhr.onerror = () => {
            // console.error('MeasureBW encountered an error');
            measureTimerStatus = true;
            clearTimeout(measureTimer);
            resolve(defaultSpeed);
        };

        xhr.open("GET", noCacheUrl, true);
        xhr.responseType = 'arraybuffer'; // 设置响应类型为 arraybuffer
        xhr.send();
    });
}

export const getUploadSpeed = async () => {
    const testFile = new Blob(['a'.repeat(1024 * 1024)], { type: 'text/plain' }); // 创建1MB大小的文件
    testFile.name = 'testFile.png'; // 模拟文件名

    const file = testFile;
    const startTime = Date.now(); // 记录开始时间
    try {
        const response = await fetch('/graph/upload', {
            method: 'POST',
            body: file,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }

        const endTime = Date.now(); // 记录结束时间
        const uploadTime = (endTime - startTime) / 1000; // 上传时间（秒）
         // 上传速度（字节/秒）
        return file.size / uploadTime / 1024;
    } catch (error) {
        console.error('Error during upload:', error.message);
    }
};



export function formatSpeed(speedInKbps) {
    const units = ['KB/s', 'MB/s', 'GB/s'];
    let unitIndex = 0;

    while (speedInKbps >= 1024 && unitIndex < units.length - 1) {
        speedInKbps /= 1024;
        unitIndex++;
    }

    return `${speedInKbps.toFixed(2)} ${units[unitIndex]}`;
}