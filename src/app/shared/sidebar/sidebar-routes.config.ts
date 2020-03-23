import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

  { path: '/dashboard/dash-board', title: 'Menu', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  {
    path: '', title: 'Inquiry', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Inquiry/AppInquiry', title: 'App Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }

    ]
  },
  {
    path: '', title: 'Administrator Process', icon: 'ft-bar-chart-2', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
];
