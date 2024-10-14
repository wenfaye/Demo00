import { defineConfig } from "umi";
import routes from './config/router'

export default defineConfig({
  // routes: [
  //   { path: "/", component: "index" },
  //   { path: "/docs", component: "docs" },
  // ],
  routes,
  npmClient: 'yarn',
});
