import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { RouteLocationNormalized } from 'vue-router';
import { UserModule } from '@/store/modules/user';
import { PermissionModule } from '@/store/modules/permission';
import { useI18n } from 'vue-i18n';
import settings from './settings';
import { stringify } from 'querystring';

NProgress.configure({ showSpinner: false });

const jumpToExternalLogin = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (settings.urlPrefix.endsWith('/')) {
    window.location.replace(settings.urlPrefix + 'sso/?service=' + encodeURIComponent(settings.appPrefix + to.fullPath));
  } else {
    window.location.replace(settings.urlPrefix + '/sso/?service=' + encodeURIComponent(settings.appPrefix + to.fullPath));
  }
};

const whiteList = ['/login'];

const getPageTitle = (key: string) => {
  let title = settings.title;
  if ((window as any).appTitle && (window as any).appTitle != '') {
    title = (window as any).appTitle;
  }

  // const locale = useI18n();
  // const hasKey = locale.te(`route.${key}`);
  // if (hasKey) {
  //   const pageName = locale.t(`route.${key}`);
  //   return `${pageName} - ${title}`;
  // }
  return title;
};

router.beforeEach(async(to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  NProgress.start();

  if (to.path === '/login') {
    console.log('jump to login page');
    jumpToExternalLogin(to, from);
    next(false);
    NProgress.done();
    return;
  }

  const nextWithUserid = () => {
    try {
      PermissionModule.dynamicRoutes.forEach((r) => {
        router.addRoute(r);
      });

      // Hack: ensure addRoutes is complete
      // Set the replace: true, so the navigation will not leave a history record
      next({ ...to, replace: true });
    } catch (err) {
      console.log('read routes fail', err);

      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        jumpToExternalLogin(from, to);
        next(false);
        NProgress.done();
      }
    }
  };

  const userid = UserModule.id;
  if (userid) {
    next();
    return;
  }

  try {
    const user = await UserModule.GetUserInfo();
    await PermissionModule.GenerateRoutes();
    return nextWithUserid();
  } catch (err) {
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('target page is in whitelist');
      next();
    } else {
      console.log('jump to logn page');
      jumpToExternalLogin(to, from);
      next(false);
      NProgress.done();
    }
  }
});

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();

  if (to) {
    // set page title
    document.title = to.meta.title as string || getPageTitle(to.meta.title as string);
  }
});
