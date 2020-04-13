import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

  { path: '/dashboard/dash-board', title: 'Menu', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/Nap/AppPaging', title: 'NAP', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  {
    path: '', title: 'MOU', icon: 'fas fa-user-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Mou/Request/Paging', title: 'MOU Request', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/Cust/ReviewPaging', title: 'MOU Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/Cust/Approval', title: 'MOU Customer Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/CustomerDoc/Paging', title: 'MOU Customer Document', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/CustomerLegalReview/Paging', title: 'MOU Customer Legal Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/DocSigner/Paging', title: 'MOU Document Signer', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/EditMouCustomer/Paging', title: 'MOU Return', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }              
    ]
  },
  {
    path: '', title: 'Administrator Process', icon: 'ft-bar-chart-2', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/AdminProcess/CustConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    ]
  },
  {
    path: '', title: 'Lead', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Lead/SelfVerification', title: 'Customer Self Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/Lead/Paging', title: 'Lead Input', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/LeadUpdate/Paging', title: 'Lead Update', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Inquiry', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Inquiry/AppInquiry', title: 'App Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
];
