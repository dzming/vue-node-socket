import Vue from "vue";
import Router, { Route } from "vue-router";
import Layout from "@/views/layout/Layout.vue";
import i18n from "@/plug/i18n.ts";
const config = require("../../config/index.json");
const { locale, messages } = i18n;
const { lang } = messages[locale];
Vue.use(Router);

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ x: 0, y: 0 }),
  base: config.baseUrl,
  routes: [
    {
      path: "/",
      name: "App",
      component: () => import(/* webpackChunkName: "App" */ "@/App.vue"),
      redirect: "/socket",
      children: [
        {
          name: "socket",
          path: "",
          component: () =>
            import(/* webpackChunkName: "socket" */ "@/views/socket/index.vue"),
        },
      ],
    },
    {
      path: "/404",
      component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
    },
    { path: "*", redirect: "/" },
  ],
});
