import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  { Path: '/dashboard/dash-board', Title: 'Home', Icon: 'ft-home', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  {
    Path: '', Title: 'Consumer Finance 4W', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: '/Nap/ConsumerFinance/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/Sharing/NapFromLead/Paging', Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: '/Nap/CreditProcess/CommissionReservedFund/Paging', Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: '/Nap/CreditProcess/PhoneVerification/Paging', Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: '/Nap/CreditProcess/FraudDetection/Paging', Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: '/Nap/CreditProcess/CreditInvestigation/Paging', Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/CreditProcess/CreditReview/Paging', Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/CreditProcess/CreditReviewPrototype/Paging', Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/CreditProcess/CreditApproval/Paging', Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/CustConfirmation/Paging', Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/DocumentSigner/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/DocPrint/Paging', Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/PurchaseOrder/Paging', Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/DeliveryOrder/Paging', Title: 'Delivery Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/PreGoLive/Paging', Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: '/Nap/AdminProcess/PreGoLive/Approval/Paging', Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      
      {
        Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: '/Nap/AddProcess/OutstandingTC/Paging', Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
        { Path: '/Nap/AddProcess/CreditApprovalResultExt/Paging', Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
        { Path: '/Nap/AdminProcess/AgreementCancellation/Paging', Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
        { Path: '/Nap/AdminProcess/OfferingValidityApproval/Paging', Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
        { Path: '/Nap/AddProcess/CopyCancelledApplication', Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] }
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: '/Nap/AddProcess/ReturnHandling/Paging', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/EditAppPaging', Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging', Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging', Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/Survey', Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingCollateral/Paging', Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] }
        ], Params: []
      }
    ], Params: []
  },
  {
    Path: '', Title: 'CFNA', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: '/Nap/Sharing/NapFromLead/Paging', Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: '/Nap/CFNA/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/CreditProcess/CommissionReservedFund/Paging', Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/CreditProcess/PhoneVerification/Paging', Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/CreditProcess/FraudDetection/Paging', Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/CreditProcess/NewCreditInvestigation/Paging', Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: '/Nap/CreditProcess/CreditReviewCfna/Paging', Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/CreditProcess/CreditApprovalCfna/Paging', Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/AdminProcess/CustConfirmation/Paging', Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: '/Nap/AdminProcess/NewDocumentSigner/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: '/Nap/AdminProcess/DocPrint/Paging', Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: '/Nap/AdminProcess/NewPurchaseOrder/Paging', Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Paging', Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Approval/Paging', Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      
      {Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: '/Nap/AddProcess/OutstandingTC/Paging', Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
        // { Path: '/Nap/AddProcess/CreditApprovalResultExt/Paging', Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ attr: "BizTemplateCode", value: "CFNA" }] },
        { Path: '/Nap/AdminProcess/AgreementCancellation/Paging', Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
        { Path: '/Nap/AdminProcess/OfferingValidityApproval/Paging', Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
        { Path: '/Nap/AddProcess/CopyCancelledApplication', Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] }
      
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: '/Nap/AddProcess/ReturnHandling/Paging', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/EditAppPaging', Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging', Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging', Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/Survey', Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingCollateral/Paging', Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingAddTc/Paging', Title: 'Return Handling - Additional TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] }
        ], Params: []
      },
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
    ], Params: []
  },
  {
    Path: '', Title: 'Finance Leasing 4W', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: '/Nap/FinanceLeasing/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/CreditProcess/CommissionReservedFund/Paging', Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/CreditProcess/PhoneVerification/Paging', Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/CreditProcess/FraudDetection/Paging', Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/CreditProcess/CreditInvestigation/Paging', Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: '/Nap/CreditProcess/CreditReview/Paging', Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/CreditProcess/CreditApproval/Paging', Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/AdminProcess/CustConfirmation/Paging', Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: '/Nap/AdminProcess/AgrmntActivation/Paging', Title: 'Agreement Activation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/AdminProcess/DocumentSigner/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: '/Nap/AdminProcess/DocPrint/Paging', Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: '/Nap/AdminProcess/PurchaseOrder/Paging', Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/AdminProcess/DeliveryOrderMultiAsset/Paging', Title: 'Delivery Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Paging', Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Approval/Paging', Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      
      {Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: '/Nap/AddProcess/OutstandingTC/Paging', Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
        { Path: '/Nap/AddProcess/CreditApprovalResultExt/Paging', Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
        { Path: '/Nap/AdminProcess/AgreementCancellation/Paging', Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
        { Path: '/Nap/AdminProcess/OfferingValidityApproval/Paging', Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
        { Path: '/Nap/AddProcess/CopyCancelledApplication', Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] }
      
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: '/Nap/AddProcess/ReturnHandling/Paging', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/EditAppPaging', Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging', Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging', Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/Survey', Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingCollateral/Paging', Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] }
        ], Params: []
      }
    ], Params: []
  },
  {
    Path: '', Title: 'Refinancing 4W', Icon: 'ft-bookmark', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/CFRefinancing/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Nap/Sharing/NapFromLead/Paging', Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: '/Nap/CreditProcess/CommissionReservedFund/Paging', Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/CreditProcess/PhoneVerification/Paging', Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/CreditProcess/FraudDetection/Paging', Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/CreditProcess/CreditInvestigation/Paging', Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: '/Nap/CreditProcess/CreditReview/Paging', Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/CreditProcess/CreditApproval/Paging', Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/AdminProcess/DocumentSigner/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: '/Nap/AdminProcess/DocPrint/Paging', Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: '/Nap/AdminProcess/CustConfirmation/Paging', Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: '/Nap/AdminProcess/PreGoLive/Paging', Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Approval/Paging', Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      
      {Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: '/Nap/AddProcess/OutstandingTC/Paging', Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
        { Path: '/Nap/AddProcess/CreditApprovalResultExt/Paging', Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
        { Path: '/Nap/AdminProcess/AgreementCancellation/Paging', Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
        { Path: '/Nap/AdminProcess/OfferingValidityApproval/Paging', Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
        { Path: '/Nap/AddProcess/CopyCancelledApplication', Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] }
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: '/Nap/AddProcess/ReturnHandling/Paging', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/EditAppPaging', Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging', Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging', Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/Survey', Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandlingCollateral/Paging', Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] }
        ], Params: []
      },
    ], Params: []
  },
  {
    Path: '', Title: 'Factoring', Icon: 'ft-package', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: '/Nap/Factoring/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: []},
      { Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: '/Nap/AdminProcess/DocumentSigner/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: '/Nap/AdminProcess/DocPrint/Paging', Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: '/Nap/AdminProcess/InvoiceVerif/Paging', Title: 'Invoice Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      // { Path: '/Nap/CreditProcess/CreditReview/Paging', Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      // { Path: '/Nap/CreditProcess/CreditApproval/Paging', Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Paging', Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: '/Nap/AdminProcess/PreGoLive/Approval/Paging', Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: '/Nap/AdminProcess/AgreementCancellation/Paging', Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: '/Nap/Sharing/NapFromMou/Paging', Title: 'New Application From Mou', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
    ], Params: []
  },
  {
    Path: '', Title: 'ROS', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      //{ Path: '/Nap/Sharing/NapFromLead/Paging', Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: '/Nap/ROS/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/CreditProcess/CommissionReservedFund/Paging', Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/CreditProcess/PhoneVerification/Paging', Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/CreditProcess/FraudDetection/Paging', Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/CreditProcess/NewCreditInvestigation/Paging', Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: '/Nap/CreditProcess/CreditReview/Paging', Title: 'Application Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/CreditProcess/CreditApproval/Paging', Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/AdminProcess/CustConfirmation/Paging', Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      // { Path: '/Nap/AdminProcess/DocumentSignerRos/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/AdminProcess/NewPurchaseOrder/Paging', Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/AdminProcess/PreGoLive/Paging', Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/AdminProcess/PreGoLive/Approval/Paging', Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },

      //{
      //  Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      //  Submenu: [
      //    { Path: '/Nap/AddProcess/OutstandingTC/Paging', Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AdminProcess/AgreementCancellation/Paging', Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AdminProcess/OfferingValidityApproval/Paging', Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AddProcess/CopyCancelledApplication', Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] }

      //  ], Params: []
      //},
      //{
      //  Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      //  Submenu: [
      //    { Path: '/Nap/AddProcess/ReturnHandling/Paging', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AddProcess/ReturnHandling/EditAppPaging', Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging', Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AddProcess/ReturnHandling/Survey', Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AddProcess/ReturnHandlingCollateral/Paging', Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: '/Nap/AddProcess/ReturnHandlingAddTc/Paging', Title: 'Return Handling - Additional TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] }
      //  ], Params: []
      //},
      { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
    ], Params: []
  },
  {
    Path: '', Title: 'MOU', Icon: 'far fa-file-alt', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      // { Path: '/Mou/TestUpload', Title: 'Test Upload', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Request/Paging', Title: 'MOU Request', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Cust/ReviewPaging', Title: 'MOU Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Cust/Approval', Title: 'MOU Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/CustomerDoc/Paging', Title: 'MOU Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/CustomerLegalReview/Paging', Title: 'MOU Legal Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/DocSigner/Paging', Title: 'MOU Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/EditMouCustomer/Paging', Title: 'MOU Return', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Cust/OutstandingTC/Paging', Title: 'MOU Oustanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Cust/Inquiry', Title: 'MOU Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Cust/Cancel', Title: 'MOU Cancel', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/Execution/Paging', Title: 'MOU Execution', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Mou/DuplicateCheck/Paging', Title: 'MOU Duplicate Check', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
    ], Params: []
  },
  // {
  //   Path: '', Title: 'Additional Process', Icon: 'ft-bar-chart-2', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
  //   Submenu: [
  //     { Path: '/Nap/AdditionalProcess/AppDupCheck/Paging', Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  //     {
  //       Path: '', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [
  //         { Path: '/Nap/AdditionalProcess/ReturnHandling/CommissionReservedFund/Paging', Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  //       ], Params: []
  //     },
  //   ]
  // },
  {
    Path: '', Title: 'Lead', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      // { Path: '/Lead/SelfVerification', Title: 'Customer Self Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/Lead/Paging', Title: 'Lead Input', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/LeadUpdate/Paging', Title: 'Lead Update', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/TeleVerif/Paging', Title: 'Tele Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/Cancel', Title: 'Lead Cancel', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/FraudVerif/Paging', Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/LeadInquiry', Title: 'Lead Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: '/Lead/Verif', Title: 'Lead Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
    ], Params: []
  },
  //{
  //  Path: '', Title: 'Inquiry', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
  //  Submenu: [
  //    { Path: '/Inquiry/AppInquiry', Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
  //    // { Path: '/Nap/CreditProcess/CreditInquiry/Paging', Title: 'Credit Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
  //  ], Params: []
  //},
  //{
  //  Path: '', Title: 'Fraud Verif', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
  //  Submenu: [
      
      
  //  ], Params: []
  //},
  { Path: '/forms/Report', Title: 'Report', Icon: 'fa fa-print', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
];
