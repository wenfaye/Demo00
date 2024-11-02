import GlobalHeader from '@/components/global-header'
import GlobalFooter from '@/components/global-footer'
import React, { Fragment } from 'react';
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

const headerRender = () => {
  return <>{}</>;
  }




export const layout = () => {
  return {
    // logo: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-holiday-giftcards-asit-agc-nav-202111?wid=400&hei=260&fmt=png-alpha&.v=1653339351054',
    logo: null,
    layout: 'top',
    menu: {
      locale: false,
    },
    locale: 'zh-CN',
    contentWidth: 'Fixed',
    pwa: true,
    fixedHeader: false,
    disableMobile: true,
    headerRender,
    token: {
      header: {
        heightLayoutHeader: 10
      }
    },
    footerRender: () => null,
  };
};
