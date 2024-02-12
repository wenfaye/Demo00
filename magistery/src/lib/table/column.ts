import { ref } from 'vue';
import axios from 'axios';

class Column {
  align: string;
  children: any;
  enumerationSource: any;
  enumerations: any;
  field: string;
  formatter: any;
  minWidth: string;
  width: string;
  sortable: boolean;
  style: any;
  title: string;
  type: string;
  constructor(cln: any) {
    this.title = cln.title;
    this.type = cln.type;
    this.field = cln.field;
    this.sortable = !!cln.sortable;
    this.minWidth = cln.min_width || '';
    this.width = cln.width || '';
    this.align = cln.align;
    this.style = cln.style || {};
    this.formatter = cln.formatter || '';
    this.enumerationSource = cln.enumeration_source;
    this.enumerations = cln.enumerations ? ref(cln.enumerations) : ref([]);
    this.children = cln.children;

    if (cln.format_code) {
      const Fn = Function;
      this.formatter = new Fn('record', 'column', cln.format_code);
    }

    this.loadEnumerations();
  }

  resoleEnumLabel(v: any) {
    if (this.enumerations) {
      for (const item of this.enumerations) {
        if (item.value == v) {
          return item.label;
        }
      }
    }

    return v;
  }

  private loadEnumerations() {
    if (this.enumerationSource) {
      const type = this.enumerationSource.type;
      if (type === 'dictionary') {
        let url = this.enumerationSource.dictionary_get_url;
        url = url.replace('{{urlPrefix}}', (window as any).urlPrefix);

        const $this = this;
        axios.get(url).then((response) => {
          $this.enumerations.value = response.data;
        });
      }
    }
  }
}

export default Column;
