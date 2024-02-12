/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout/Layout.vue';

const listLayoutRouter = {
  path: '/list_page_layouts',
  name: 'list_page_layouts',
  component: Layout,
  meta: { title: '列表布局', hidden: true },
  children: [
    // {
    //   path: '/list_layouts/index',
    //   component: () => import('@/views/ListLayout/index.vue'),
    //   meta: { title: '列表布局', hidden: true },
    // },
    {
      path: '/list_page_layouts/new',
      component: () => import('@/views/ListPageLayout/New.vue'),
      meta: { title: '添加', hidden: true },
    },
    {
      path: 'list_page_layouts/:id/edit',
      component: () => import('@/views/ListPageLayout/Edit.vue'),
      meta: { title: '编辑', hidden: true },
    },
  ],
};
export default listLayoutRouter;
