/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout/Layout.vue';

const managedMoldsRouter = {
  path: '/managed_molds',
  name: 'managed_molds',
  component: Layout,
  meta: { title: '业务模型管理', hidden: false },
  children: [
    {
      path: '/managed_molds/index',
      component: () => import('@/views/ManagedMolds/index.vue'),
      meta: { title: '业务模型管理', hidden: false },
    },
    {
      path: '/managed_molds/new',
      component: () => import('@/views/ManagedMolds/New.vue'),
      meta: { title: '添加', hidden: true },
    },
    {
      path: 'managed_molds/:id/edit',
      component: () => import('@/views/ManagedMolds/Edit.vue'),
      meta: { title: '编辑', hidden: true },
    },
  ],
};
export default managedMoldsRouter;
