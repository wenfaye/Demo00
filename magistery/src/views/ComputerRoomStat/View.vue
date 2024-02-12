<template>
  <layout ref="layout" list-title="机房资源统计" >
    <template #header>
      <el-select @change="handleRoomSelectionChange" v-model="statRoomIds" clearable filterable multiple class="search-input" style="display:inline-block;width:300px;margin-left: -1px;" placeholder="不选择则统计所有机房">
        <el-option v-bind:key="room.id" v-for="room in allRooms" :value="room.id" :label="room.name"></el-option>
      </el-select>
    </template>
    <template #list>
      <div style="width: 100%;height: 100%; display: flex; flex-direction: column;">
        <div style="width: 100%; height: 50%;">
          <div style="width: 50%;height: 100%; display: inline-block;">
            <div ref="cableCountStat" style="width: 100%;height: 100%;"></div>
          </div>
          <div style="width: 50%;height: 100%; display: inline-block;">
            <div ref="cableCoreCountStat" style="width: 100%;height: 100%;"></div>
          </div>
        </div>
        <div style="width: 100%; height: 50%;">
          <div style="width: 50%;height: 100%; display: inline-block;">
            <div ref="rackUnitStat" style="width: 100%;height: 100%;"></div>
          </div>
          <div style="width: 50%;height: 100%; display: inline-block;vertical-align: top;">
            <el-tabs
              v-model="activeRoom"
              type="card"
              class="demo-tabs"
              style="height: 100%;"
            >
              <el-tab-pane v-for="item in statSocketsResult" :label="item.roomName" :name="item.roomId" v-bind:key="item.roomId">
                <div style="width: 100%; height: 100%; overflow-y: auto;">
                  <table class="table" style="width: 100%;">
                    <thead>
                    <tr>
                      <th>机柜</th>
                      <th>PDU插口数</th>
                      <th>剩余插口数</th>
                      <th>STS插口数</th>
                      <th>剩余插口数</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="cabinet in item.stat" v-bind:key="cabinet.cabinetId">
                      <td>{{cabinet.cabinetName}}</td>
                      <td>{{cabinet.pduSocketTotal}}</td>
                      <td>{{cabinet.pduSocketTotal - cabinet.pduSocketUsed}}</td>
                      <td>{{cabinet.stsSocketTotal}}</td>
                      <td>{{cabinet.stsSocketTotal - cabinet.stsSocketUsed}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance, watch, computed } from 'vue';
import * as echarts from 'echarts';
import { readOpticalCables, readPowerSocketStat, readRooms, readRackUnitStat } from '@/api/computerRooms';

const statRoomIds = ref([]);
const allRooms = ref([]);
const allCables = ref([]);
const cableCountStat = ref(null);
const cableCoreCountStat = ref(null);
const rackUnitStat = ref(null);
const rackUnitStats = ref([]);
const statSocketsResult = ref([]);
const activeRoom = ref('');

onMounted(() => {
  loadRooms();
});

const loadRooms = () => {
  readRooms('').then((response) => {
    allRooms.value = response;
    loadCables();
    loadRackUnitStat();

    _statPowerSockets();
  }, (response) => {
  });
};

const loadCables = () => {
  readOpticalCables().then((response) => {
    allCables.value = response || [];
    _statCables();
  }, (response) => {
  });
};

const loadRackUnitStat = () => {
  readRackUnitStat().then((response) => {
    rackUnitStats.value = response || [];
    _statRackUnits();
  }, (response) => {
  });
};

const handleRoomSelectionChange = () => {
  _statCables();
  _statRackUnits();
  _statPowerSockets();
};

const _statCables = () => {
  const roomCount = {};
  const roomCoreTotal = {};
  const roomCoreUsed = {};
  for (const cable of allCables.value) {
    const roomId = cable.fromRoomId;
    roomCount[roomId] = roomCount[roomId] ? roomCount[roomId] + 1 : 1;
    if (cable.coreUsed) {
      if (!roomCoreTotal[roomId]) {
        roomCoreTotal[roomId] = 0;
        roomCoreUsed[roomId] = 0;
      }
      roomCoreUsed[roomId] = roomCoreUsed[roomId] + cable.coreUsed;
      roomCoreTotal[roomId] = roomCoreTotal[roomId] + cable.fromCoreCount;
    }
  }

  const names = [];
  const coreUsed = [];
  const coreTotal = [];
  const items = [];
  for (const room of allRooms.value) {
    if (statRoomIds.value.length === 0 || statRoomIds.value.indexOf(room.id) >= 0) {
      const cableCount = roomCount[room.id];
      if (cableCount) {
        items.push({ value: cableCount, name: room.name });

        names.push(room.name);
        coreTotal.push(roomCoreTotal[room.id]);
        coreUsed.push(roomCoreUsed[room.id]);
      }
    }
  }

  const myChart = echarts.init(cableCountStat.value);
  const option = {
    title: {
      text: '机房光缆数统计（按起点机房）',
      left: 'center',
    },
    tooltip: {},
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: items,
      },
    ],
  };
  myChart.setOption(option);

  const myChart1 = echarts.init(cableCoreCountStat.value);
  const option1 = {
    title: {
      text: '机房光缆芯数统计（按起点机房）（总数/已使用）',
      left: 'center',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: names,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '芯总数',
        type: 'bar',
        barMaxWidth: 50,
        data: coreTotal,
      },
      {
        name: '芯已使用',
        type: 'bar',
        barMaxWidth: 50,
        data: coreUsed,
      },
    ],
  };
  myChart1.setOption(option1);
};

const _statRackUnits = () => {
  const names = [];
  const total = [];
  const used = [];
  for (const room of rackUnitStats.value) {
    if (statRoomIds.value.length === 0 || statRoomIds.value.indexOf(room.roomId) >= 0) {
      if (room.totalUnit > 0) {
        names.push(room.roomName);
        total.push(room.totalUnit);
        used.push(room.usedUnit);
      }
    }
  }

  const myChart1 = echarts.init(rackUnitStat.value);
  const option1 = {
    title: {
      text: '机房机柜U数统计(总数/已使用)',
      left: 'center',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: names,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '总U数',
        type: 'bar',
        barMaxWidth: 50,
        data: total,
      },
      {
        name: '已使用U数',
        type: 'bar',
        barMaxWidth: 50,
        data: used,
      },
    ],
  };
  myChart1.setOption(option1);
};

const _statPowerSockets = () => {
  readPowerSocketStat({ roomIds: statRoomIds.value }).then((response) => {
    const list = [];
    for (const item of response) {
      if (item.stat.length > 0) {
        list.push(item);
      }
    }

    activeRoom.value = list.length > 0 ? list[0].roomId : '';
    statSocketsResult.value = list;
  }, (response) => {
  });
};
</script>

<style>
  .el-tabs__content {
    height: calc(100% - 55px);
    padding: 10px;
  }

  .el-tabs__content > .el-tab-pane {
    height: 100%;
  }
</style>
