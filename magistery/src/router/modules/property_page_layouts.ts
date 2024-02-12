/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout/Layout.vue';

const listLayoutRouter = {
  path: '/property_page_layouts',
  name: 'property_page_layouts',
  component: Layout,
  meta: { title: '列表布局', hidden: true },
  children: [
    // {
    //   path: '/list_layouts/index',
    //   component: () => import('@/views/ListLayout/index.vue'),
    //   meta: { title: '列表布局', hidden: true },
    // },
    {
      path: '/property_page_layouts/new',
      component: () => import('@/views/PropertyPageLayout/New.vue'),
      meta: { title: '添加', hidden: true },
    },
    {
      path: 'property_page_layouts/:id/edit',
      component: () => import('@/views/PropertyPageLayout/Edit.vue'),
      meta: { title: '编辑', hidden: true },
    },
  ],
};
export default listLayoutRouter;
