import { RunTimeLayoutConfig } from '@umijs/max';
// 运行时配置
import CustomHeader from '@/components/CustomHeader'
import GlobalFooter from '@/components/global-footer'
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = (initialState) => {
  // console.dir(initialState)
  return {
    logo: 'https://www.apple.com.cn/macbook-air/images/overview/switchers/new_icloud__fj0y9epvmju6_large.jpg',
    title:'macbook',
    headerRender:()=>CustomHeader(),
    footerRender:()=>GlobalFooter(),
    menu: {
      locale: false,
    },
  };
};
