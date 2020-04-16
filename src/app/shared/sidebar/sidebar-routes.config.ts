import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

  { path: '/dashboard/dash-board', title: 'Menu', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/Nap/AppPaging', title: 'NAP', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  {
    path: '', title: 'Consumer Finance', icon: 'ft-file-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/ConsumerFinance/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CommissionData/Paging', title: 'Commission Data', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/ReservedFund/Paging', title: 'Reserved Fund', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/PhoneVerification', title: 'Phone Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/CustomerConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Finance Leasing', icon: 'ft-file-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/FinanceLeasing/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CommissionData/Paging', title: 'Commission Data', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/ReservedFund/Paging', title: 'Reserved Fund', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/AgreementActivation/Paging', title: 'Agreement Activation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Refinancing', icon: 'ft-bookmark', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/CFRefinancing/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CommissionData/Paging', title: 'Commission Data', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/ReservedFund/Paging', title: 'Reserved Fund', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/PhoneVerification', title: 'Phone Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Factoring', icon: 'ft-package', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/Factoring/Paging?LobCode=FCTR', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'MOU', icon: 'fas fa-user-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Mou/Request/Paging', title: 'MOU Request', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/Cust/ReviewPaging', title: 'MOU Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/Cust/Approval', title: 'MOU Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/CustomerDoc/Paging', title: 'MOU Document Printing', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/CustomerLegalReview/Paging', title: 'MOU Legal Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/DocSigner/Paging', title: 'MOU Document Signer', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Mou/Cust/Inquiry', title: 'MOU Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Administrator Process', icon: 'ft-bar-chart-2', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/CustConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Nap/AdminProcess/CustConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '', title: 'Lead', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Lead/SelfVerification', title: 'Customer Self Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/Lead/Paging', title: 'Lead Input', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/LeadUpdate/Paging', title: 'Lead Update', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/TeleVerif/Paging', title: 'Tele Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/Cancel', title: 'Lead Cancel', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/FraudVerif/Paging', title: 'Fraud Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/Lead/LeadInquiry', title: 'Lead Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    ]
  },
  {
    path: '', title: 'Inquiry', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Inquiry/AppInquiry', title: 'App Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
];
