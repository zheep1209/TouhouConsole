<script setup>
import * as echarts from "echarts";
import {getOsInfo} from "@/assets/script/getSystemInformation.js";
import {getIpInfo, getWeatherInfo} from "@/API/InfoAPI.js";
import {GetIconByWeather} from "@/assets/script/getIconByWeather.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {getNowTime} from "@/assets/script/getNowTime.js";
import Border from "@/components/Border.vue";
import {formatSpeed, getUploadSpeed, measureBW} from "@/assets/script/getNetSpeed.js";

onMounted(async () => {
  ipInfo.value = await getIpInfo();
  weatherInfo.value = await getWeatherInfo(ipInfo.value.ad_info.adcode);
  await fetchSpeed();
  intervalId = setInterval(fetchSpeed, 10000);
  watch([dlList.value, ulList.value], () => {
    initEcharts();
  }, {immediate: true});
});

onUnmounted(() => {
  // 清除定时器，防止内存泄漏
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const initEcharts = () => {
  const chartDom = document.getElementById('main');
  const myChart = echarts.init(chartDom);
  reOption.value && myChart.setOption(reOption.value);
}

const reOption = computed(() => {
  return {
    color: ['#800080', '#00677c'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {}
      }
    },
    grid: {
      left: '3%',
      bottom : '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: timeList.value// 示例数据
      }
    ],
    yAxis: [
      {
        show: false,
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Download',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: dlList.value
      },
      {
        name: 'Upload',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: ulList.value
      }
    ]
  }
});

let intervalId = null;

// 鼠标拖动事件
const sysInfo = getOsInfo();
const ipInfo = ref({});
const weatherInfo = ref({});
const isDragging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const windowPosition = ref({
  left: 700,
  top: 200
});

// 计算属性
const windowStyle = computed(() => ({
  top: `${windowPosition.value.top}px`,
  left: `${windowPosition.value.left}px`
}));

// 方法
const startDrag = (e) => {
  isDragging.value = true;
  offsetX.value = e.clientX - windowPosition.value.left;
  offsetY.value = e.clientY - windowPosition.value.top;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
  if (isDragging.value) {
    windowPosition.value.left = e.clientX - offsetX.value;
    windowPosition.value.top = e.clientY - offsetY.value;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// 网速
const downloadSpeed = ref(0.00);
const uploadSpeed = ref(0.00);
const dlList = ref([]);
const ulList = ref([]);
const timeList = ref([]);
const fetchSpeed = async () => {
  try {
    const dl = await measureBW();
    const ul = await getUploadSpeed();
    dlList.value.push(dl);
    ulList.value.push(ul);
    timeList.value.push(getNowTime().minutes + ':' + getNowTime().seconds)
    if (dlList.value.length >= 6) {
      dlList.value.shift(); // 删除第一个元素
    }
    if (ulList.value.length >= 6) {
      ulList.value.shift(); // 删除第一个元素
    }
    if (timeList.value.length >= 6) {
      timeList.value.shift(); // 删除第一个元素
    }
    console.log(dlList.value);
    console.log(ulList.value);
    downloadSpeed.value = formatSpeed(dl);
    uploadSpeed.value = formatSpeed(ul);
  } catch (error) {
    // console.error('Failed to measure bandwidth:', error);
  }
};
</script>

<template>
  <div class="app">
    <div :style="windowStyle" class="window" @mousedown="startDrag">
      <border>
        <template #header>
          <b>Bad Apple!</b>
        </template>
        <template #content>
          <img alt="" src="@/assets/image/badapple.gif" @mousedown.stop="">
        </template>
      </border>
    </div>
    <div class="left">
      <div class="lt">
        <border>
          <template #header>
            <b>Night Life</b>
          </template>
          <template #content>
            <img alt="" class="ltc" src="@/assets/image/Nightlife%20Vid_1.gif">
          </template>
        </border>
      </div>
      <div class="lb">
        <border>
          <template #header>
            <b>IP Information</b>
          </template>
          <template #content>
            <div class="lbc">
              <div class="sysInfo">
                System：{{ sysInfo.version }}
              </div>
              <div v-if="ipInfo.ad_info" class="ipInfo">
                <div class="province">
                  <div>{{ ipInfo.ad_info.nation }}</div>
                  <div>{{ ipInfo.ad_info.province }}</div>
                  <div>{{ ipInfo.ad_info.city }}</div>
                </div>
                <div class="city">
                  <div>{{ ipInfo.ad_info.district }}</div>
                  <div>{{ ipInfo.ip }}</div>
                </div>
              </div>
            </div>
          </template>
        </border>
      </div>
    </div>
    <div class="center">
      <div class="ct">
        <border>
          <template #header>
            <b>Speed</b>
          </template>
          <template #content>
            <div class="ctc">
              <div>↑{{ uploadSpeed }} ↓{{ downloadSpeed }}</div>
              <div id="main"></div>
            </div>
          </template>
        </border>
      </div>
      <div class="cc">
        <border>
          <template #header>
            标题
          </template>
          <template #content>
            <div class="ccc"></div>
          </template>
        </border>
      </div>
      <div class="cb">
        <border>
          <template #header>
            标题
          </template>
          <template #content>
            <div class="cbc">

            </div>
          </template>
        </border>
      </div>
    </div>
    <div class="right">
      <div class="rt">
        <border>
          <template #header>
            <b>weather</b>
          </template>
          <template #content>
            <div class="rtc">
              <div class="time">
                <div class="date">{{ getNowTime().year }}年{{ getNowTime().month }}月{{ getNowTime().day }}日</div>
              </div>
              <div class="weather">
                <div class="weatherInfo">
                  <div class="weatherIcon">
                    <div class="icon" v-html="GetIconByWeather(weatherInfo.weather)">
                    </div>
                    <div class="temperature">{{ weatherInfo.temperature }}°C</div>
                  </div>
                  <div class="info">
                    <div>{{ weatherInfo.winddirection }}风 {{ weatherInfo.windpower }}级</div>
                    <div>湿度: {{ weatherInfo.humidity }}%</div>
                  </div>
                </div>
                <div class="time">{{ weatherInfo.weather }} · {{ getNowTime().weekDay }} {{
                    getNowTime().hours
                                  }}:{{ getNowTime().minutes }}:{{ getNowTime().seconds }}
                </div>
              </div>
            </div>
          </template>
        </border>
      </div>
      <div class="rb">
        <border>
          <template #header>
            <b>Night City</b>
          </template>
          <template #content>
            <img alt="" class="rbc" src="@/assets/image/City Video.gif">
          </template>
        </border>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  border: #fe19ff 3px solid;
  border-top: none;
  display: flex;
  width: 100%;
  height: 100vh;

  .window {
    top: 25px;
    left: 100px;
    width: 350px;
    height: 350px;
    position: absolute;
    z-index: 999;
    border: #fe19ff 3px solid;
    border-top: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .left {
    width: 34%;
    height: 100vh;

    .lt {
      height: 75%;
      position: relative;
      overflow: hidden;

      .ltc {
        position: absolute;
        top: 30px;
        right: 0;
        height: calc(100% - 30px);
      }
    }

    .lb {
      height: 25%;

      .lbc {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 30px;

        .sysInfo {
          font-size: 30px;
          color: #fff;
        }

        .ipInfo {
          color: #fff;
          display: flex;
          flex-direction: column;

          .province {
            font-size: 30px;
            display: flex;
            gap: 20px;
          }

          .city {
            font-size: 25px;
            display: flex;
            gap: 20px;
          }
        }
      }
    }
  }

  .center {
    border-left: #fe19ff 3px solid;
    border-right: #fe19ff 3px solid;
    width: 33%;
    height: 100vh;

    .ct {
      height: 30%;
      .ctc {
        display: flex;
        flex-direction: column;
        align-items: center;
        #main {
          height: 230px;
          width:650px;
        }
      }
    }

    .cc {
      height: 30%;
    }

    .cb {
      height: 40%;
    }
  }

  .right {
    width: 33%;
    height: 100vh;

    .rt {
      height: 30%;

      .rtc {
        padding: 30px;

        .time {
          .date {
            font-size: 40px;
          }

          .time {
            font-size: 30px;
          }
        }

        .weather {
          .weatherInfo {
            display: flex;
            gap: 100px;
            align-items: center;

            .weatherIcon {
              display: flex;
              align-items: center;
              gap: 20px;

              .temperature {
                font-size: 50px;
              }
            }

            .info {
              display: flex;
              flex-direction: column;
            }
          }

          .time {
            font-size: 30px;
          }
        }
      }
    }

    .rb {
      height: 70%;

      .rbc {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 50%;
      }
    }
  }
}
</style>
