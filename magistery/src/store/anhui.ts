import { readVoltageLevels, readAreas, readSiteTypes, readBizTypes1, readBizTypes2, readCityCompanies, DictData } from '@/api/dict';

class Anhui {
  private voltageLevels: DictData[] = [];
  private areas: DictData[] = [];
  private siteTypes: DictData[] = [];
  private bizTypes1: DictData[] = [];
  private bizTypes2: DictData[] = [];
  private cityCompanies: DictData[] = [];

  public async init() {
    const voltageLevels = await readVoltageLevels();
    this.voltageLevels = voltageLevels;

    const areas = await readAreas();
    this.areas = areas;

    const siteTypes = await readSiteTypes();
    this.siteTypes = siteTypes;

    const bizTypes1 = await readBizTypes1();
    this.bizTypes1 = bizTypes1;

    const bizTypes2 = await readBizTypes2();
    this.bizTypes2 = bizTypes2;

    const cityCompanies = await readCityCompanies();
    this.cityCompanies = cityCompanies;
  }

  get VoltageLevels(): DictData[] {
    return this.voltageLevels;
  }

  get Areas(): DictData[] {
    return this.areas;
  }

  get SiteTypes(): DictData[] {
    return this.siteTypes;
  }

  get BizTypes1(): DictData[] {
    return this.bizTypes1;
  }

  get BizTypes2(): DictData[] {
    return this.bizTypes2;
  }

  get CityCompanies(): DictData[] {
    return this.cityCompanies;
  }
}

export const anhuiStore = new Anhui();
