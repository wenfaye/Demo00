/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout/Layout.vue';

const classSpecRouter = {
  path: '/class_specs',
  name: 'class_specs',
  component: Layout,
  meta: { title: '配置项类型', hidden: false },
  children: [
    {
      path: '/class_specs/index',
      component: () => import('@/views/ClassSpec/index.vue'),
      meta: { title: '配置项类型', hidden: false },
    },
    {
      path: '/class_specs/new',
      component: () => import('@/views/ClassSpec/New.vue'),
      meta: { title: '添加', hidden: true },
    },
    {
      path: 'class_specs/:id/edit',
      component: () => import('@/views/ClassSpec/Edit.vue'),
      meta: { title: '编辑', hidden: true },
    },
  ],
};
export default classSpecRouter;
