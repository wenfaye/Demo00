<template>
  <div id="viewWrap" class="view-wrap">
    <el-row class="row-fluid heading" >
      <el-col :span="8" style="width: 35%;height:45px;">
        <img :src="require('/src/assets/images/title-left.png')" style="float:right; height:45px;">
      </el-col>
      <el-col  :span="8" style="width: 30%;height:45px;">
        <h1 class="monitor-title">安徽省调管辖厂站监控一览</h1>
      </el-col>
      <el-col  :span="8" style="width: 35%;height:45px;">
        <img :src="require('/src/assets/images/title-right.png')" style="left:0;height:45px;">
      </el-col>
    </el-row>
    <el-row class="row-fluid" style="margin-left: 20px;margin-top: 35px;margin-bottom: 25px;">
      <el-col :span="8">
        <div class="panel-shadow3 sum-block">
          <i class="fa fa-ils" style="font-size: 40px;"></i>
          <span class="pull-right">
        <h3>站点总数</h3>
        <div style="text-align: right;font-weight: bold;font-size: 20px;">{{powerSites.length}}</div>
      </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="panel-shadow3 sum-block" style="background-color: #202b36;">
          <i class="fa fa-exclamation-triangle" style="font-size: 40px;"></i>
          <span class="pull-right">
        <h3>存在严重故障的站点数</h3>
        <div style="text-align: right;font-weight: bold;font-size: 20px; color: red; text-decoration: underline; padding-top: 5px;">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link" style="font-size: 20px;">
              {{errorSiteCount}}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="s in errorSites" v-bind:key="s.id" @click="openSite(s)">{{s.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="panel-shadow3 sum-block" style="background-color: #3e5368;">
          <i class="fa fa-exclamation-circle" style="font-size: 40px;"></i>
          <span class="pull-right">
        <h3>存在异常的站点数</h3>
        <div style="text-align: right;font-weight: bold;font-size: 20px; color: orange; text-decoration: underline;">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link" style="font-size: 20px;">
              {{warnSiteCount}}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="s in warnSites" v-bind:key="s.id" @click="openSite(s)">{{s.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </span>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="filter-bar panel-shadow3">
          <span class="item-block" v-if="activeAreas.length > 0">
            <span class="condition item-active" :key="activeArea" v-for="activeArea in activeAreas">{{activeArea}}<el-icon @click="filterByArea(activeArea)" :size="15"><Close /></el-icon></span>
          </span>
          <span class="item-block" v-if="activeVoltages.length > 0">
            <span class="condition item-active" :key="activeVoltage" v-for="activeVoltage in activeVoltages">{{activeVoltage}}kv <el-icon @click="filterByVoltage(activeVoltage)" :size="15"><Close /></el-icon></span>
          </span>
          <span class="item-block" v-if="activeSiteTypes.length > 0">
            <span class="condition item-active" :key="activeSiteType" v-for="activeSiteType in activeSiteTypes">{{activeSiteType}}<el-icon @click="filterBySiteType(activeSiteType)" :size="15"><Close /></el-icon></span>
          </span>

          <span style="display: inline-block;">
            <el-menu
              class="el-menu-demo"
              mode="horizontal"
              style="width: 260px;border-bottom-width:0;"
            >
              <el-sub-menu index="1">
                <template #title>电压等级</template>
                <el-menu-item :key="vl.value" :index="vl.value" @click="filterByVoltage(vl.value)" v-for="vl in voltageLevels"><el-icon v-if="isVoltageActive(vl.value)" ><Check/></el-icon>{{vl.label}}</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>类型</template>
                <el-menu-item :key="st.value" :index="st.value" @click="filterBySiteType(st.value)" v-for="st in siteTypes"><el-icon v-if="isSiteTypeActive(st.value)"><Check/></el-icon>{{st.label}}</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </span>
        </div>
      </el-col>
    </el-row>

    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">皖北站点</h4>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('淮北')}" @click="filterByArea('淮北')">淮北</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('宿州')}" @click="filterByArea('宿州')">宿州</el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('阜阳')}" @click="filterByArea('阜阳')">阜阳</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('亳州')}" @click="filterByArea('亳州')">亳州</el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('蚌埠')}" @click="filterByArea('蚌埠')">蚌埠</el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </div>
      <table class="sum-table" style="margin: 5px 5px 5px 8px;">
        <tbody>
          <tr :key="n" v-for="n in resolveRowCount(northSites)">
            <td @click="openView(northSites, (n - 1) * resolveColumnCount() + i - 1)" :key="i" v-for="i in resolveColumnCount()" :class="resolveSiteClass(northSites, (n - 1) * resolveColumnCount() + i - 1)">
              {{resolveSiteLabel(northSites, (n - 1) * resolveColumnCount() + i - 1)}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">皖中站点</h4>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('淮南')}" @click="filterByArea('淮南')">淮南</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('滁州')}" @click="filterByArea('滁州')">滁州</el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('合肥')}" @click="filterByArea('合肥')">合肥</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('六安')}" @click="filterByArea('六安')">六安</el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('安庆')}" @click="filterByArea('安庆')">安庆</el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </div>
      <table class="sum-table" style="margin: 5px 5px 5px 8px;">
        <tbody>
        <tr :key="n" v-for="n in resolveRowCount(centerSites)">
          <td @click="openView(centerSites, (n - 1) * resolveColumnCount() + i - 1)" :key="i" v-for="i in resolveColumnCount()" :class="resolveSiteClass(centerSites, (n - 1) * resolveColumnCount() + i - 1)">
            {{resolveSiteLabel(centerSites, (n - 1) * resolveColumnCount() + i - 1)}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">皖南站点</h4>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('芜湖')}" @click="filterByArea('芜湖')">芜湖</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('铜陵')}" @click="filterByArea('铜陵')">铜陵</el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('马鞍山')}" @click="filterByArea('马鞍山')">马鞍山</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('池州')}" @click="filterByArea('池州')">池州</el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('宣城')}" @click="filterByArea('宣城')">宣城</el-col>
          <el-col :span="12" :class="{'btn-trigger': true, 'item-active': isAreaActive('黄山')}" @click="filterByArea('黄山')">黄山</el-col>
        </el-row>
      </div>
      <table class="sum-table" style="margin: 5px 5px 5px 8px;">
        <tbody>
        <tr :key="n" v-for="n in resolveRowCount(southSites)">
          <td @click="openView(southSites, (n - 1) * resolveColumnCount() + i - 1)" :key="i" v-for="i in resolveColumnCount()" :class="resolveSiteClass(southSites, (n - 1) * resolveColumnCount() + i - 1)">
            {{resolveSiteLabel(southSites, (n - 1) * resolveColumnCount() + i - 1)}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">骨干网一平面</h4>
      </div>
      <table class="sum-table" style="margin: 5px 5px 5px 8px;">
        <tbody>
        <tr :key="n" v-for="n in 2">
          <td @click="openView(firstPlanSites, (n - 1) * resolveColumnCount() + i - 1)" :key="i" v-for="i in resolveColumnCount()" :class="resolveSiteClass(firstPlanSites, (n - 1) * resolveColumnCount() + i - 1)">
            {{resolveSiteLabel(firstPlanSites, (n - 1) * resolveColumnCount() + i - 1)}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">骨干网二平面</h4>
      </div>
      <table class="sum-table" style="margin: 5px 5px 5px 8px;">
        <tbody>
        <tr :key="n" v-for="n in 2">
          <td @click="openView(secondPlanSites, (n - 1) * resolveColumnCount() + i - 1)" :key="i" v-for="i in resolveColumnCount()" :class="resolveSiteClass(secondPlanSites, (n - 1) * resolveColumnCount() + i - 1)">
            {{resolveSiteLabel(secondPlanSites, (n - 1) * resolveColumnCount() + i - 1)}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">火电厂</h4>
      </div>
    </div>
    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">水电站</h4>
      </div>
    </div>
    <div class="panel-shadow3" style="display: flex;width: 100%; background-color: rgba(32, 59, 85, 0.2); margin-bottom: 10px; padding: 5px;">
      <div style="padding: 5px 15px;min-width: 200px;border-right: solid 2px rgba(192, 192, 192, 0.13)">
        <h4 style="margin-top: 5px;margin-bottom: 10px;">新能源</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
import { anhuiStore } from '@/store/anhui';
import { fetchSites, readAlertStat } from '@/api/powerSites';

const pyfl = require('pyfl').default;

const powerSites = ref([]);
const northSites = ref([]);
const centerSites = ref([]);
const southSites = ref([]);
const firstPlanSites = ref([]);
const secondPlanSites = ref([]);
const siteTypes = ref([]);
const voltageLevels = ref([]);
const activeAreas = ref([]);
const activeVoltages = ref([]);
const activeSiteTypes = ref([]);
let areas = [];
const errorSiteCount = ref(0);
const warnSiteCount = ref(0);
const errorSites = ref([]);
const warnSites = ref([]);

onMounted(() => {
  anhuiStore.init().then(() => {
    areas = anhuiStore.Areas;
    siteTypes.value = anhuiStore.SiteTypes;
    voltageLevels.value = anhuiStore.VoltageLevels;
    loadSites();
  });
});

const loadSites = () => {
  fetchSites().then((response) => {
    response = response || [];
    const cp = response.concat([]);

    response.sort(function(r1, r2) {
      return r1.name.localeCompare(r2.name);
    });

    powerSites.value = response;
    northSites.value = [];
    centerSites.value = [];
    southSites.value = [];

    for (const site of response) {
      const area = findArea(site.area);

      if (area === '淮北' || area === '宿州' || area === '阜阳' || area === '亳州' || area === '蚌埠') {
        northSites.value.push(site);
      } else if (area === '淮南' || area === '滁州' || area === '合肥' || area === '六安' || area === '安庆') {
        centerSites.value.push(site);
      } else if (area === '芜湖' || area === '铜陵' || area === '马鞍山' || area === '池州' || area === '宣城' || area === '黄山') {
        southSites.value.push(site);
      }
    }

    for (const site of cp) {
      const area = findArea(site.area);

      if (area === '骨干网一平面') {
        firstPlanSites.value.push(site);
      } else if (area === '骨干网二平面') {
        secondPlanSites.value.push(site);
      }
    }

    readAlertStat().then((response) => {
      // errorSiteCount.value = (response.site_count_of_level5 || 0) + (response.site_count_of_level4 || 0);
      let sites = [];
      sites = sites.concat(response.sites_of_level5 ? response.sites_of_level5 : []);
      sites = sites.concat(response.sites_of_level4 ? response.sites_of_level4 : []);
      let eSites = [];
      for (const site of sites) {
        for (const s of powerSites.value) {
          if (s.id === site && eSites.indexOf(s) < 0) {
            eSites.push(s);
          }
        }
      }
      errorSites.value = eSites;
      errorSiteCount.value = eSites.length;

      // warnSiteCount.value = (response.site_count_of_level1 || 0) + (response.site_count_of_level2 || 0) + (response.site_count_of_level3 || 0);
      sites = [];
      sites = sites.concat(response.sites_of_level3 ? response.sites_of_level3 : []);
      sites = sites.concat(response.sites_of_level2 ? response.sites_of_level2 : []);
      sites = sites.concat(response.sites_of_level1 ? response.sites_of_level1 : []);
      eSites = [];
      for (const site of sites) {
        for (const s of powerSites.value) {
          if (s.id === site && eSites.indexOf(s) < 0) {
            eSites.push(s);
          }
        }
      }
      warnSites.value = eSites;
      warnSiteCount.value = eSites.length;
    });
  }, (response) => {
  });
};

const filterByArea = (area) => {
  if (activeAreas.value.indexOf(area) < 0) {
    activeAreas.value.push(area);
  } else {
    activeAreas.value.splice(activeAreas.value.indexOf(area), 1);
  }
};

const filterByVoltage = (voltage) => {
  if (activeVoltages.value.indexOf(voltage) < 0) {
    activeVoltages.value.push(voltage);
  } else {
    activeVoltages.value.splice(activeVoltages.value.indexOf(voltage), 1);
  }
};

const filterBySiteType = (siteType) => {
  if (activeSiteTypes.value.indexOf(siteType) < 0) {
    activeSiteTypes.value.push(siteType);
  } else {
    activeSiteTypes.value.splice(activeSiteTypes.value.indexOf(siteType), 1);
  }
};

const isAreaActive = (area) => {
  return activeAreas.value.indexOf(area) >= 0;
};

const isVoltageActive = (voltage) => {
  return activeVoltages.value.indexOf(voltage) >= 0;
};

const isSiteTypeActive = (siteType) => {
  return siteTypes.value.indexOf(siteType) >= 0;
};

const openSite = (site) => {
  const prefix = window.urlPrefix.endsWith('/') ? window.urlPrefix : (window.urlPrefix + '/');
  if (site.topology_view_id) {
    window.open(prefix + 'web/biz_topologies/' + site.topology_view_id + '?simplified=true');
  }
};

const openView = (sites, i) => {
  if (i < sites.length) {
    const site = sites[i];
    const prefix = window.urlPrefix.endsWith('/') ? window.urlPrefix : (window.urlPrefix + '/');
    if (site.topology_view_id) {
      window.open(prefix + 'web/biz_topologies/' + site.topology_view_id + '?simplified=true');
    }
  }
};

const resolveSiteLabel = (sites, i, hasPrefix = false) => {
  const l = i < sites.length ? sites[i].name : '';

  return l ? (hasPrefix ? pyfl(l)[0] + '   ' + l : l) : '';
};

const resolveSiteClass = (sites, i) => {
  if (i < sites.length) {
    const site = sites[i];
    const a = findArea(site.area);
    if (activeAreas.value.length > 0 && activeAreas.value.indexOf(a) < 0) {
      return 'filtered';
    }
    if (activeSiteTypes.value.length > 0 && activeSiteTypes.value.indexOf(site.type) < 0) {
      return 'filtered';
    }
    if (activeVoltages.value.length > 0 && activeVoltages.value.indexOf(site.kilovolt + '') < 0) {
      return 'filtered';
    }
    return site.topology_view_id ? 'actual' : 'todo';
  }

  return 'todo';
};

const resolveColumnCount = () => {
  if (window.screen.width >= 1900) {
    return 14;
  } else if (window.screen.width >= 1600) {
    return 12;
  } else {
    return 10;
  }
};

const resolveRowCount = (sites) => {
  const rowCount = Math.ceil(sites.length / resolveColumnCount());
  return rowCount < 4 ? 4 : rowCount;
};

const findArea = (area) => {
  for (const a of areas) {
    if (a.value === area) {
      return a.label;
    } else if (a.children && a.children.length) {
      for (const sub of a.children) {
        if (sub.value === area) {
          return a.label;
        }
      }
    }
  }

  return area;
};
</script>

<style lang="scss" scoped>
  .item-active {
    color: #67c23a;
  }

  .item-block {
    display: inline-block;
    border: solid 1px rgba(192, 192, 192, 0.4);
    border-radius: 5px;
    padding: 3px 5px;
    margin-left: 10px;
  }

  .monitor-title {
    color: white;
    -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0.6)));
    text-align: center;
    margin-top: 1px;
    font-weight: normal;
    font-size: 30px;
  }

  .view-wrap {
    color: white;
    background-image: url('~@/assets/images/bg.png');
    background-color: rgba(22, 40, 58, 0.8);
  }

  .panel-shadow3{
    border-radius: 8px !important;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.18), 0px 4px 5px 0px rgba(0, 0, 0, 0.32), 0px 1px 3px 0px rgba(0, 0, 0, 0.3);
  }

  .filter-bar {
    background-color: rgba(62, 73, 78, 0.8);
    min-height: 50px;
    margin-bottom: 15px;
    text-align: right;
    padding: 10px 10px 10px 10px;
    font-size: 18px;
  }

  .filter-bar .condition {
    /*border-bottom: solid 1px white;*/
    margin-left: 15px;
    margin-right: 15px;
  }

  .filter-bar .el-icon {
    cursor: pointer;
  }

  .sum-block {
    background-color: #2a3948;
    height: 80px;
    color: white;
    padding: 15px 20px;
    margin-right: 30px;
  }

  .sum-block h3 {
    font-weight: normal;
    margin-top: 0;
    margin-bottom: 0;
  }

  .sum-table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    height: fit-content;
    table-layout: fixed;
  }

  .sum-table > tbody > tr {
    height: 24px;
  }

  .sum-table > tbody > tr > td {
    line-height: 18px;
    height: 30px;
    vertical-align: top;
    border: solid 1px rgba(192, 192, 192, 0.3);
    padding: 5px 8px;
    color: #00bf00;
  }

  .sum-table > tbody > tr > td.actual {
    color: #00bb00;
    cursor: pointer;
    text-decoration: underline;
  }

  .sum-table > tbody > tr > td.todo {
    color: white;
  }

  .sum-table > tbody > tr > td.error {
    color: #ff0000;
  }

  .sum-table > tbody > tr > td.warn {
    color: #DDDD70;
  }

  .sum-table > tbody > tr > td.filtered {
    color: rgba(93, 93, 93, 0.49);
  }

  .btn-trigger {
    cursor: pointer;
    text-decoration: underline;
  }

</style>

<style>
  .el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title {
    border-bottom-width: 0;
  }
</style>
