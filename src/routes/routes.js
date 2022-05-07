/*
 * Copyright (c) IInfo 2022 All rights reserved.
 */

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/Index.vue"),
    meta: {
      title: "IClipboard by IInforever",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
    meta: {
      title: "Sign up",
    },
  },
  {
    path: "/p/:id",
    name: "pastes",
    component: () => import("../views/Paste.vue"),
    meta: {
      title: "Clipboard",
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "Home page",
    },
    children: [
      {
        path: "info",
        name: "user-info",
        component: () => import("../views/user/Info.vue"),
      },
      {
        path: "pastes",
        name: "user-pastes",
        component: () => import("../views/user/Pastes.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/Admin.vue"),
    meta: {
      title: "Admin",
    },
    children: [
      {
        path: "users",
        name: "admin-users",
        component: () => import("../views/admin/Users.vue"),
      },
      {
        path: "",
        name: "admin-index",
        component: () => import("../views/admin/Index.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../views/NotFound.vue"),
  },
];

export default routes;
