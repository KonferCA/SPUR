/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './pages/__root'
import { Route as AuthImport } from './pages/auth'
import { Route as IndexImport } from './pages/index'
import { Route as UserIndexImport } from './pages/user/index'
import { Route as AdminIndexImport } from './pages/admin/index'
import { Route as UserAuthImport } from './pages/user/_auth'
import { Route as UserAppshellImport } from './pages/user/_appshell'
import { Route as AdminAuthImport } from './pages/admin/_auth'
import { Route as AdminAppshellImport } from './pages/admin/_appshell'
import { Route as UserAuthAppshellProjectsImport } from './pages/user/_auth._appshell.projects'
import { Route as UserAuthAppshellDashboardImport } from './pages/user/_auth._appshell.dashboard'
import { Route as AdminAuthAppshellDashboardImport } from './pages/admin/_auth._appshell.dashboard'
import { Route as AdminAuthAppshellProjectsIndexImport } from './pages/admin/_auth/_appshell/projects/index'
import { Route as UserAuthAppshellProjectSubmitImport } from './pages/user/_auth._appshell.project.submit'
import { Route as UserAuthAppshellCompanyNewImport } from './pages/user/_auth._appshell.company.new'
import { Route as AdminAuthAppshellProjectsProjectIdSubmissionImport } from './pages/admin/_auth/_appshell/projects/$projectId.submission'
import { Route as AdminAuthAppshellProjectsProjectIdDetailsImport } from './pages/admin/_auth/_appshell/projects/$projectId.details'

// Create Virtual Routes

const UserImport = createFileRoute('/user')()
const AdminImport = createFileRoute('/admin')()

// Create/Update Routes

const UserRoute = UserImport.update({
  id: '/user',
  path: '/user',
  getParentRoute: () => rootRoute,
} as any)

const AdminRoute = AdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UserIndexRoute = UserIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => UserRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AdminRoute,
} as any)

const UserAuthRoute = UserAuthImport.update({
  id: '/_auth',
  getParentRoute: () => UserRoute,
} as any)

const UserAppshellRoute = UserAppshellImport.update({
  id: '/_appshell',
  getParentRoute: () => UserRoute,
} as any)

const AdminAuthRoute = AdminAuthImport.update({
  id: '/_auth',
  getParentRoute: () => AdminRoute,
} as any)

const AdminAppshellRoute = AdminAppshellImport.update({
  id: '/_appshell',
  getParentRoute: () => AdminRoute,
} as any)

const UserAuthAppshellProjectsRoute = UserAuthAppshellProjectsImport.update({
  id: '/_appshell/projects',
  path: '/projects',
  getParentRoute: () => UserAuthRoute,
} as any)

const UserAuthAppshellDashboardRoute = UserAuthAppshellDashboardImport.update({
  id: '/_appshell/dashboard',
  path: '/dashboard',
  getParentRoute: () => UserAuthRoute,
} as any)

const AdminAuthAppshellDashboardRoute = AdminAuthAppshellDashboardImport.update(
  {
    id: '/_appshell/dashboard',
    path: '/dashboard',
    getParentRoute: () => AdminAuthRoute,
  } as any,
)

const AdminAuthAppshellProjectsIndexRoute =
  AdminAuthAppshellProjectsIndexImport.update({
    id: '/_appshell/projects/',
    path: '/projects/',
    getParentRoute: () => AdminAuthRoute,
  } as any)

const UserAuthAppshellProjectSubmitRoute =
  UserAuthAppshellProjectSubmitImport.update({
    id: '/_appshell/project/submit',
    path: '/project/submit',
    getParentRoute: () => UserAuthRoute,
  } as any)

const UserAuthAppshellCompanyNewRoute = UserAuthAppshellCompanyNewImport.update(
  {
    id: '/_appshell/company/new',
    path: '/company/new',
    getParentRoute: () => UserAuthRoute,
  } as any,
)

const AdminAuthAppshellProjectsProjectIdSubmissionRoute =
  AdminAuthAppshellProjectsProjectIdSubmissionImport.update({
    id: '/_appshell/projects/$projectId/submission',
    path: '/projects/$projectId/submission',
    getParentRoute: () => AdminAuthRoute,
  } as any)

const AdminAuthAppshellProjectsProjectIdDetailsRoute =
  AdminAuthAppshellProjectsProjectIdDetailsImport.update({
    id: '/_appshell/projects/$projectId/details',
    path: '/projects/$projectId/details',
    getParentRoute: () => AdminAuthRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/admin/_appshell': {
      id: '/admin/_appshell'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminAppshellImport
      parentRoute: typeof AdminRoute
    }
    '/admin/_auth': {
      id: '/admin/_auth'
      path: ''
      fullPath: '/admin'
      preLoaderRoute: typeof AdminAuthImport
      parentRoute: typeof AdminImport
    }
    '/user': {
      id: '/user'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserImport
      parentRoute: typeof rootRoute
    }
    '/user/_appshell': {
      id: '/user/_appshell'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserAppshellImport
      parentRoute: typeof UserRoute
    }
    '/user/_auth': {
      id: '/user/_auth'
      path: ''
      fullPath: '/user'
      preLoaderRoute: typeof UserAuthImport
      parentRoute: typeof UserImport
    }
    '/admin/': {
      id: '/admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminImport
    }
    '/user/': {
      id: '/user/'
      path: '/'
      fullPath: '/user/'
      preLoaderRoute: typeof UserIndexImport
      parentRoute: typeof UserImport
    }
    '/admin/_auth/_appshell/dashboard': {
      id: '/admin/_auth/_appshell/dashboard'
      path: '/dashboard'
      fullPath: '/admin/dashboard'
      preLoaderRoute: typeof AdminAuthAppshellDashboardImport
      parentRoute: typeof AdminAuthImport
    }
    '/user/_auth/_appshell/dashboard': {
      id: '/user/_auth/_appshell/dashboard'
      path: '/dashboard'
      fullPath: '/user/dashboard'
      preLoaderRoute: typeof UserAuthAppshellDashboardImport
      parentRoute: typeof UserAuthImport
    }
    '/user/_auth/_appshell/projects': {
      id: '/user/_auth/_appshell/projects'
      path: '/projects'
      fullPath: '/user/projects'
      preLoaderRoute: typeof UserAuthAppshellProjectsImport
      parentRoute: typeof UserAuthImport
    }
    '/user/_auth/_appshell/company/new': {
      id: '/user/_auth/_appshell/company/new'
      path: '/company/new'
      fullPath: '/user/company/new'
      preLoaderRoute: typeof UserAuthAppshellCompanyNewImport
      parentRoute: typeof UserAuthImport
    }
    '/user/_auth/_appshell/project/submit': {
      id: '/user/_auth/_appshell/project/submit'
      path: '/project/submit'
      fullPath: '/user/project/submit'
      preLoaderRoute: typeof UserAuthAppshellProjectSubmitImport
      parentRoute: typeof UserAuthImport
    }
    '/admin/_auth/_appshell/projects/': {
      id: '/admin/_auth/_appshell/projects/'
      path: '/projects'
      fullPath: '/admin/projects'
      preLoaderRoute: typeof AdminAuthAppshellProjectsIndexImport
      parentRoute: typeof AdminAuthImport
    }
    '/admin/_auth/_appshell/projects/$projectId/details': {
      id: '/admin/_auth/_appshell/projects/$projectId/details'
      path: '/projects/$projectId/details'
      fullPath: '/admin/projects/$projectId/details'
      preLoaderRoute: typeof AdminAuthAppshellProjectsProjectIdDetailsImport
      parentRoute: typeof AdminAuthImport
    }
    '/admin/_auth/_appshell/projects/$projectId/submission': {
      id: '/admin/_auth/_appshell/projects/$projectId/submission'
      path: '/projects/$projectId/submission'
      fullPath: '/admin/projects/$projectId/submission'
      preLoaderRoute: typeof AdminAuthAppshellProjectsProjectIdSubmissionImport
      parentRoute: typeof AdminAuthImport
    }
  }
}

// Create and export the route tree

interface AdminAuthRouteChildren {
  AdminAuthAppshellDashboardRoute: typeof AdminAuthAppshellDashboardRoute
  AdminAuthAppshellProjectsIndexRoute: typeof AdminAuthAppshellProjectsIndexRoute
  AdminAuthAppshellProjectsProjectIdDetailsRoute: typeof AdminAuthAppshellProjectsProjectIdDetailsRoute
  AdminAuthAppshellProjectsProjectIdSubmissionRoute: typeof AdminAuthAppshellProjectsProjectIdSubmissionRoute
}

const AdminAuthRouteChildren: AdminAuthRouteChildren = {
  AdminAuthAppshellDashboardRoute: AdminAuthAppshellDashboardRoute,
  AdminAuthAppshellProjectsIndexRoute: AdminAuthAppshellProjectsIndexRoute,
  AdminAuthAppshellProjectsProjectIdDetailsRoute:
    AdminAuthAppshellProjectsProjectIdDetailsRoute,
  AdminAuthAppshellProjectsProjectIdSubmissionRoute:
    AdminAuthAppshellProjectsProjectIdSubmissionRoute,
}

const AdminAuthRouteWithChildren = AdminAuthRoute._addFileChildren(
  AdminAuthRouteChildren,
)

interface AdminRouteChildren {
  AdminAppshellRoute: typeof AdminAppshellRoute
  AdminAuthRoute: typeof AdminAuthRouteWithChildren
  AdminIndexRoute: typeof AdminIndexRoute
}

const AdminRouteChildren: AdminRouteChildren = {
  AdminAppshellRoute: AdminAppshellRoute,
  AdminAuthRoute: AdminAuthRouteWithChildren,
  AdminIndexRoute: AdminIndexRoute,
}

const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren)

interface UserAuthRouteChildren {
  UserAuthAppshellDashboardRoute: typeof UserAuthAppshellDashboardRoute
  UserAuthAppshellProjectsRoute: typeof UserAuthAppshellProjectsRoute
  UserAuthAppshellCompanyNewRoute: typeof UserAuthAppshellCompanyNewRoute
  UserAuthAppshellProjectSubmitRoute: typeof UserAuthAppshellProjectSubmitRoute
}

const UserAuthRouteChildren: UserAuthRouteChildren = {
  UserAuthAppshellDashboardRoute: UserAuthAppshellDashboardRoute,
  UserAuthAppshellProjectsRoute: UserAuthAppshellProjectsRoute,
  UserAuthAppshellCompanyNewRoute: UserAuthAppshellCompanyNewRoute,
  UserAuthAppshellProjectSubmitRoute: UserAuthAppshellProjectSubmitRoute,
}

const UserAuthRouteWithChildren = UserAuthRoute._addFileChildren(
  UserAuthRouteChildren,
)

interface UserRouteChildren {
  UserAppshellRoute: typeof UserAppshellRoute
  UserAuthRoute: typeof UserAuthRouteWithChildren
  UserIndexRoute: typeof UserIndexRoute
}

const UserRouteChildren: UserRouteChildren = {
  UserAppshellRoute: UserAppshellRoute,
  UserAuthRoute: UserAuthRouteWithChildren,
  UserIndexRoute: UserIndexRoute,
}

const UserRouteWithChildren = UserRoute._addFileChildren(UserRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth': typeof AuthRoute
  '/admin': typeof AdminAuthRouteWithChildren
  '/user': typeof UserAuthRouteWithChildren
  '/admin/': typeof AdminIndexRoute
  '/user/': typeof UserIndexRoute
  '/admin/dashboard': typeof AdminAuthAppshellDashboardRoute
  '/user/dashboard': typeof UserAuthAppshellDashboardRoute
  '/user/projects': typeof UserAuthAppshellProjectsRoute
  '/user/company/new': typeof UserAuthAppshellCompanyNewRoute
  '/user/project/submit': typeof UserAuthAppshellProjectSubmitRoute
  '/admin/projects': typeof AdminAuthAppshellProjectsIndexRoute
  '/admin/projects/$projectId/details': typeof AdminAuthAppshellProjectsProjectIdDetailsRoute
  '/admin/projects/$projectId/submission': typeof AdminAuthAppshellProjectsProjectIdSubmissionRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth': typeof AuthRoute
  '/admin': typeof AdminIndexRoute
  '/user': typeof UserIndexRoute
  '/admin/dashboard': typeof AdminAuthAppshellDashboardRoute
  '/user/dashboard': typeof UserAuthAppshellDashboardRoute
  '/user/projects': typeof UserAuthAppshellProjectsRoute
  '/user/company/new': typeof UserAuthAppshellCompanyNewRoute
  '/user/project/submit': typeof UserAuthAppshellProjectSubmitRoute
  '/admin/projects': typeof AdminAuthAppshellProjectsIndexRoute
  '/admin/projects/$projectId/details': typeof AdminAuthAppshellProjectsProjectIdDetailsRoute
  '/admin/projects/$projectId/submission': typeof AdminAuthAppshellProjectsProjectIdSubmissionRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/auth': typeof AuthRoute
  '/admin': typeof AdminRouteWithChildren
  '/admin/_appshell': typeof AdminAppshellRoute
  '/admin/_auth': typeof AdminAuthRouteWithChildren
  '/user': typeof UserRouteWithChildren
  '/user/_appshell': typeof UserAppshellRoute
  '/user/_auth': typeof UserAuthRouteWithChildren
  '/admin/': typeof AdminIndexRoute
  '/user/': typeof UserIndexRoute
  '/admin/_auth/_appshell/dashboard': typeof AdminAuthAppshellDashboardRoute
  '/user/_auth/_appshell/dashboard': typeof UserAuthAppshellDashboardRoute
  '/user/_auth/_appshell/projects': typeof UserAuthAppshellProjectsRoute
  '/user/_auth/_appshell/company/new': typeof UserAuthAppshellCompanyNewRoute
  '/user/_auth/_appshell/project/submit': typeof UserAuthAppshellProjectSubmitRoute
  '/admin/_auth/_appshell/projects/': typeof AdminAuthAppshellProjectsIndexRoute
  '/admin/_auth/_appshell/projects/$projectId/details': typeof AdminAuthAppshellProjectsProjectIdDetailsRoute
  '/admin/_auth/_appshell/projects/$projectId/submission': typeof AdminAuthAppshellProjectsProjectIdSubmissionRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/auth'
    | '/admin'
    | '/user'
    | '/admin/'
    | '/user/'
    | '/admin/dashboard'
    | '/user/dashboard'
    | '/user/projects'
    | '/user/company/new'
    | '/user/project/submit'
    | '/admin/projects'
    | '/admin/projects/$projectId/details'
    | '/admin/projects/$projectId/submission'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/auth'
    | '/admin'
    | '/user'
    | '/admin/dashboard'
    | '/user/dashboard'
    | '/user/projects'
    | '/user/company/new'
    | '/user/project/submit'
    | '/admin/projects'
    | '/admin/projects/$projectId/details'
    | '/admin/projects/$projectId/submission'
  id:
    | '__root__'
    | '/'
    | '/auth'
    | '/admin'
    | '/admin/_appshell'
    | '/admin/_auth'
    | '/user'
    | '/user/_appshell'
    | '/user/_auth'
    | '/admin/'
    | '/user/'
    | '/admin/_auth/_appshell/dashboard'
    | '/user/_auth/_appshell/dashboard'
    | '/user/_auth/_appshell/projects'
    | '/user/_auth/_appshell/company/new'
    | '/user/_auth/_appshell/project/submit'
    | '/admin/_auth/_appshell/projects/'
    | '/admin/_auth/_appshell/projects/$projectId/details'
    | '/admin/_auth/_appshell/projects/$projectId/submission'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthRoute: typeof AuthRoute
  AdminRoute: typeof AdminRouteWithChildren
  UserRoute: typeof UserRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRoute: AuthRoute,
  AdminRoute: AdminRouteWithChildren,
  UserRoute: UserRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth",
        "/admin",
        "/user"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth": {
      "filePath": "auth.tsx"
    },
    "/admin": {
      "filePath": "admin",
      "children": [
        "/admin/_appshell",
        "/admin/_auth",
        "/admin/"
      ]
    },
    "/admin/_appshell": {
      "filePath": "admin/_appshell.tsx",
      "parent": "/admin"
    },
    "/admin/_auth": {
      "filePath": "admin/_auth.tsx",
      "parent": "/admin",
      "children": [
        "/admin/_auth/_appshell/dashboard",
        "/admin/_auth/_appshell/projects/",
        "/admin/_auth/_appshell/projects/$projectId/details",
        "/admin/_auth/_appshell/projects/$projectId/submission"
      ]
    },
    "/user": {
      "filePath": "user",
      "children": [
        "/user/_appshell",
        "/user/_auth",
        "/user/"
      ]
    },
    "/user/_appshell": {
      "filePath": "user/_appshell.tsx",
      "parent": "/user"
    },
    "/user/_auth": {
      "filePath": "user/_auth.tsx",
      "parent": "/user",
      "children": [
        "/user/_auth/_appshell/dashboard",
        "/user/_auth/_appshell/projects",
        "/user/_auth/_appshell/company/new",
        "/user/_auth/_appshell/project/submit"
      ]
    },
    "/admin/": {
      "filePath": "admin/index.tsx",
      "parent": "/admin"
    },
    "/user/": {
      "filePath": "user/index.tsx",
      "parent": "/user"
    },
    "/admin/_auth/_appshell/dashboard": {
      "filePath": "admin/_auth._appshell.dashboard.tsx",
      "parent": "/admin/_auth"
    },
    "/user/_auth/_appshell/dashboard": {
      "filePath": "user/_auth._appshell.dashboard.tsx",
      "parent": "/user/_auth"
    },
    "/user/_auth/_appshell/projects": {
      "filePath": "user/_auth._appshell.projects.tsx",
      "parent": "/user/_auth"
    },
    "/user/_auth/_appshell/company/new": {
      "filePath": "user/_auth._appshell.company.new.tsx",
      "parent": "/user/_auth"
    },
    "/user/_auth/_appshell/project/submit": {
      "filePath": "user/_auth._appshell.project.submit.tsx",
      "parent": "/user/_auth"
    },
    "/admin/_auth/_appshell/projects/": {
      "filePath": "admin/_auth/_appshell/projects/index.tsx",
      "parent": "/admin/_auth"
    },
    "/admin/_auth/_appshell/projects/$projectId/details": {
      "filePath": "admin/_auth/_appshell/projects/$projectId.details.tsx",
      "parent": "/admin/_auth"
    },
    "/admin/_auth/_appshell/projects/$projectId/submission": {
      "filePath": "admin/_auth/_appshell/projects/$projectId.submission.tsx",
      "parent": "/admin/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
