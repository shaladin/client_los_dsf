import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

  { path: '/dashboard/dash-board', title: 'Menu', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
  { path: '/Nap/AppPaging', title: 'NAP', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
  {
    path: '', title: 'Consumer Finance', icon: 'ft-file-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/ConsumerFinance/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CommissionData/Paging', title: 'Commission Data', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/ReservedFund/Paging', title: 'Reserved Fund', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/PhoneVerification', title: 'Phone Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/CustomerConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] }
    ], params: []
  },
  {
    path: '', title: 'Finance Leasing', icon: 'ft-file-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/FinanceLeasing/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CommissionData/Paging', title: 'Commission Data', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/ReservedFund/Paging', title: 'Reserved Fund', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/AgreementActivation/Paging', title: 'Agreement Activation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] }
    ], params: []
  },
  {
    path: '', title: 'Refinancing', icon: 'ft-bookmark', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/CFRefinancing/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CommissionData/Paging', title: 'Commission Data', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/ReservedFund/Paging', title: 'Reserved Fund', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/PhoneVerification', title: 'Phone Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] }
    ], params: []
  },
  {
    path: '', title: 'Factoring', icon: 'ft-package', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      {
        path: '/Nap/Factoring/Paging', title: 'New Application', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],
        params: [
          { attr: "LobCode", value: "FCTR" }
        ]
      },
      { path: '/Nap/CreditProcess/CreditReview', title: 'Credit Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/CreditProcess/CreditApproval/Paging', title: 'Credit Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/PreGoLive/Paging', title: 'Pre Go Live', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] }
    ], params: []
  },
  {
    path: '', title: 'MOU', icon: 'fas fa-user-plus', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Mou/Request/Paging', title: 'MOU Request', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Mou/Cust/ReviewPaging', title: 'MOU Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Mou/Cust/Approval', title: 'MOU Approval', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Mou/CustomerDoc/Paging', title: 'MOU Document Printing', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Mou/CustomerLegalReview/Paging', title: 'MOU Legal Review', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Mou/DocSigner/Paging', title: 'MOU Document Signer', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Mou/Cust/Inquiry', title: 'MOU Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] }
    ], params: []
  },
  {
    path: '', title: 'Administrator Process', icon: 'ft-bar-chart-2', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Nap/AdminProcess/PurchaseOrder/Paging', title: 'Purchase Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/DeliveryOrder/Paging', title: 'Delivery Order', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/CustConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Nap/AdminProcess/CustConfirmation/Paging', title: 'Customer Confirmation', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
    ], params: []
  },
  {
    path: '', title: 'Lead', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Lead/SelfVerification', title: 'Customer Self Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Lead/Lead/Paging', title: 'Lead Input', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Lead/LeadUpdate/Paging', title: 'Lead Update', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Lead/TeleVerif/Paging', title: 'Tele Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Lead/Cancel', title: 'Lead Cancel', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Lead/FraudVerif/Paging', title: 'Fraud Verification', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
      { path: '/Lead/LeadInquiry', title: 'Lead Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] },
    ], params: []
  },
  {
    path: '', title: 'Inquiry', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/Inquiry/AppInquiry', title: 'App Inquiry', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], params: [] }
    ], params: []
  },
];
