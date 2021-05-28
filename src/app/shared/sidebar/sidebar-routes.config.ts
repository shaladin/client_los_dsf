import { NavigationConstant } from '../constant/NavigationConstant';
import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  { Path: NavigationConstant.DASHBOARD, Title: 'Home', Icon: 'ft-home', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  {
    Path: '', Title: 'Product', Icon: 'ft-package', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: NavigationConstant.PRODUCT_HO_PAGING, Title: 'Product HO', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_HO_REVIEW, Title: 'Product HO Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_HO_APPRV, Title: 'Product HO Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_HO_RTN_PAGING, Title: 'Product HO Return', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_HO_DEACTIVATE, Title: 'Product HO Deactivation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV, Title: 'Product HO Deactivate Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PROD_OFFERING_PAGING, Title: 'Product Offering', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_OFFERING_REVIEW, Title: 'Product Offering Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_OFFERING_APPRV, Title: 'Product Offering Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PROD_OFFERING_RTN_PAGING, Title: 'Product Offering Return', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_OFFERING_DEACTIVATE, Title: 'Product Offering Deactivation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  },
      { Path: NavigationConstant.PRODUCT_OFFERING_DEACTIVATE_APPRV, Title: 'Product Offering Deactivate Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params : []  }
      
    ], Params : [] 
  },
  {
    Path: '', Title: 'OPL', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: '/Nap/MainData/NAP2/Paging', Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: '/Nap/ApplicationProcess/ApplicationReview/Paging', Title: 'Application Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
        { Path: '/Nap/ApplicationProcess/ApplicationApproval/Paging', Title: 'Application Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
        { Path: '/Nap/AdminProcess/DocChecklist/Paging', Title: 'Document Checklist', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
        { Path: '/Nap/AdminProcess/DocChecklist/Approval/Paging', Title: 'Document Checklist Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
        { Path: '/Nap/AdminProcess/AssetAllocation/Paging', Title: 'Asset Allocation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: NavigationConstant.REQUISITION_DECISION_PAGING, Title: 'Requisition Decision', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_OPL_PAGING, Title: 'Pre Golive', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }]},
      { Path: NavigationConstant.APP_INQUIRY, Title: 'Application Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: NavigationConstant.PURCHASE_TRACKING_INQUIRY, Title: 'Purchase Tracking Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      {
        Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_ADD_TC_PAGING, Title: 'Additional TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_CAN_PAGING, Title: 'App Cancel', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy Cancelled App', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_ASSET_CAN_PAGING, Title: 'App Asset Cancel', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_DOC_PICKUP_REQUEST_PAGING, Title: 'Document Pickup Request', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: []  },
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING, Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_CUST_PAGING, Title: 'Return Handling - Edit Customer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SRVY, Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
        ], Params: []
      },
    ], Params: []
  },
  {
    Path: '', Title: 'Consumer Finance 4W', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      {
        Path: '', Title: 'New Consumer Finance 4W', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING, Title: 'NAP 1', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING, Title: 'NAP 2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},      
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: NavigationConstant.NAP_CUST_COMPL_PAGING, Title: 'NAP 4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
          { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }, { Attr: "IsNapVersionMainData", Value: "true" }] }
        ], Params: []
      },
      { Path: NavigationConstant.NAP_CF4W_PAGING, Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      // { Path: NavigationConstant.NAP_SHARING_FROM_LEAD_PAGING, Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.NAP1_SHARING_FROM_LEAD_PAGING, Title: 'NAP 1 From Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING, Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING, Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_PAGING, Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING, Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING, Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING, Title: 'Credit Review Baru', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PROTOTYPE_PAGING, Title: 'Credit Review Prototype', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING, Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING, Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING, Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING, Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_PO_PAGING, Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_DO_PAGING, Title: 'Delivery Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_PAGING, Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING, Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
      {
        Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING, Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
        { Path: NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING, Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
        { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING, Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
        { Path: NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING, Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }]},
        { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] }
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING, Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP4', Title: 'Return Handling - Edit NAP4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP2', Title: 'Return Handling - Edit NAP2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING, Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING, Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SRVY, Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING, Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }] }
        ], Params: []
      }
    ], Params: []
  },
  {
    Path: '', Title: 'CFNA', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      {
        Path: '', Title: 'New CFNA', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING, Title: 'NAP 1', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING, Title: 'NAP 2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},      
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },          
          { Path: NavigationConstant.NAP_CUST_COMPL_PAGING, Title: 'NAP 4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
          { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }, { Attr: "IsNapVersionMainData", Value: "true" }] }
        ], Params: []
      },
      // { Path: NavigationConstant.NAP_SHARING_FROM_LEAD_PAGING, Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: NavigationConstant.NAP_CFNA_PAGING, Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP1_SHARING_FROM_LEAD_PAGING, Title: 'NAP 1 From Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING, Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING, Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_PAGING, Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_NEW_CRD_INVESTIGATION_PAGING, Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CFNA_PAGING, Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_CFNA_PAGING, Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING, Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_CFNA_DOC_SIGNER_PAGING, Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING, Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NEW_PO_PAGING, Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_PAGING, Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING, Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
      
      {Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING, Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
        { Path: NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING, Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
        { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING, Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
        { Path: NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING, Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }]},
        { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] }
      
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING, Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP4', Title: 'Return Handling - Edit NAP 4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP2', Title: 'Return Handling - Edit NAP2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING, Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING, Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SRVY, Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING, Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING, Title: 'Return Handling - Additional TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] }
        ], Params: []
      },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFNA" }] },
    ], Params: []
  },
  {
    Path: '', Title: 'Finance Leasing 4W', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      {
        Path: '', Title: 'New Finance Leasing 4W', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING, Title: 'NAP 1', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING, Title: 'NAP 2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},      
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: NavigationConstant.NAP_CUST_COMPL_PAGING, Title: 'NAP 4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
          { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CF4W" }, { Attr: "IsNapVersionMainData", Value: "true" }] }
        ], Params: []
      },
      { Path: NavigationConstant.NAP_FL4W_PAGING, Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING, Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING, Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_PAGING, Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING, Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING, Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING, Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING, Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_ACT_PAGING, Title: 'Agreement Activation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING, Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING, Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_PO_PAGING, Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_DO_MULTI_ASSET_PAGING, Title: 'Delivery Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_PAGING, Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING, Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
      
      {Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING, Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
        { Path: NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING, Title: 'Credit Approval Result Extension', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
        { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING, Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
        { Path: NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING, Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }]},
        { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] }
      
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING, Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP4', Title: 'Return Handling - Edit NAP4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP2', Title: 'Return Handling - Edit NAP2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING, Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING, Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SRVY, Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING, Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FL4W" }] }
        ], Params: []
      }
    ], Params: []
  },
  {
    Path: '', Title: 'Refinancing 4W', Icon: 'ft-bookmark', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      {
        Path: '', Title: 'New Refinancing 4W', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING, Title: 'NAP 1', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING, Title: 'NAP 2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},      
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: NavigationConstant.NAP_CUST_COMPL_PAGING, Title: 'NAP 4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
          { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }, { Attr: "IsNapVersionMainData", Value: "true" }] }
        ], Params: []
      },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_CFRFN4W_PAGING, Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      // { Path: NavigationConstant.NAP_SHARING_FROM_LEAD_PAGING, Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: NavigationConstant.NAP1_SHARING_FROM_LEAD_PAGING, Title: 'NAP 1 From Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING, Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING, Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_PAGING, Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING, Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING, Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING, Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING, Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING, Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING, Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_PAGING, Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING, Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
      
      {Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      Submenu: [
        { Path: NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING, Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
        { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING, Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
        { Path: NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING, Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }]},
        { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] }
        ], Params: []
      },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING, Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP4', Title: 'Return Handling - Edit NAP4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: '/Nap/AddProcess/ReturnHandling/NAP2', Title: 'Return Handling - Edit NAP2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING, Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING, Title: 'Return Handling - Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SRVY, Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING, Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "CFRFN4W" }] }
        ], Params: []
      },
    ], Params: []
  },
  {
    Path: '', Title: 'Factoring', Icon: 'ft-package', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      {
        Path: '', Title: 'New Factoring', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING, Title: 'NAP 1', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
          { Path: NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING, Title: 'NAP 2', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},      
          { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
          { Path: NavigationConstant.NAP_CUST_COMPL_PAGING, Title: 'NAP 4', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
          { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }, { Attr: "IsNapVersionMainData", Value: "true" }] }
        ], Params: [] 
      },
      { Path: NavigationConstant.NAP_FCTR_PAGING, Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: []},
      { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING, Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING, Title: 'Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING, Title: 'Invoice Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      // { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING, Title: 'Credit Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      // { Path: NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING, Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_PAGING, Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
      { Path: NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING, Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING, Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }]},
      { Path: NavigationConstant.NAP_SHARING_FROM_MOU_PAGING, Title: 'New Application From Mou', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      {
        Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
        Submenu: [
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] },
          { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_INVOICE_PAGING, Title: 'Return Handling - Invoice Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "FCTR" }] }
        ], Params: []
      },
    ], Params: []
  },
  {
    Path: '', Title: 'ROS', Icon: 'ft-file-plus', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      //{ Path: NavigationConstant.NAP_SHARING_FROM_LEAD_PAGING, Title: 'New Application from Lead', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: NavigationConstant.NAP_ROS_PAGING, Title: 'New Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING, Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING, Title: 'Phone Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_PAGING, Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: '/Nap/CreditProcess/NewCreditInvestigation/Paging', Title: 'Credit Investigation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      { Path: NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING, Title: 'Application Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING, Title: 'Credit Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING, Title: 'Customer Confirmation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      // { Path: '/Nap/AdminProcess/DocumentSignerRos/Paging', Title: 'Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },

      //{ Path: '/Nap/AdminProcess/NewPurchaseOrder/Paging', Title: 'Purchase Order', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_ADM_PRCS_PGL_PAGING, Title: 'Pre Go Live', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },
      //{ Path: NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING, Title: 'Pre Go Live Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "OPL" }] },

      //{
      //  Path: '', Title: 'Additional Process', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      //  Submenu: [
      //    { Path: NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING, Title: 'Outstanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING, Title: 'Application / Agreement Cancelation', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING, Title: 'Offering Validity Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP, Title: 'Copy From Cancelled Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] }

      //  ], Params: []
      //},
      //{
      //  Path: '', Title: 'Return Handling', Icon: '', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
      //  Submenu: [
      //    { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING, Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING, Title: 'Return Handling - Edit Application', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING, Title: 'Return Handling - Phone Verif', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SRVY, Title: 'Return Handling - Survey', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING, Title: 'Return Handling - Collateral', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
      //    { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING, Title: 'Return Handling - Additional TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] }
      //  ], Params: []
      //},
      { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [{ Attr: "BizTemplateCode", Value: "ROS" }] },
    ], Params: []
  },
  {
    Path: '', Title: 'MOU', Icon: 'far fa-file-alt', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      // { Path: '/Mou/TestUpload', Title: 'Test Upload', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_REQ_PAGING, Title: 'MOU Request', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_RVW_PAGING, Title: 'MOU Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_APPRV, Title: 'MOU Approval', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_DOC_PAGING, Title: 'MOU Document Printing', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_LEGAL_RVW_PAGING, Title: 'MOU Legal Review', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_DOC_SIGNER_PAGING, Title: 'MOU Document Signer', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_EDIT_CUST_PAGING, Title: 'MOU Return', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_OUTSTANDING_TC_PAGING, Title: 'MOU Oustanding TC', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_INQUIRY, Title: 'MOU Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_CUST_CANCEL, Title: 'MOU Cancel', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_EXECUTION_PAGING, Title: 'MOU Execution', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.MOU_DUP_CHECK_PAGING, Title: 'MOU Duplicate Check', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
    ], Params: []
  },
  // {
  //   Path: '', Title: 'Additional Process', Icon: 'ft-bar-chart-2', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
  //   Submenu: [
  //     { Path: NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING, Title: 'App Duplicate Checking', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  //     {
  //       Path: '', Title: 'Return Handling', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [
  //         { Path: NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING, Title: 'Commission Reserved Fund', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  //       ], Params: []
  //     },
  //   ]
  // },
  {
    Path: '', Title: 'Lead', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      // { Path: '/Lead/SelfVerification', Title: 'Customer Self Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_PAGING, Title: 'Lead Input', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_UPDATE_PAGING, Title: 'Lead Update', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_TELE_VERIF_PAGING, Title: 'Tele Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_CANCEL, Title: 'Lead Cancel', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_FRAUD_VERIF_PAGING, Title: 'Fraud Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_INQUIRY, Title: 'Lead Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
      { Path: NavigationConstant.LEAD_VERIF, Title: 'Lead Verification', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
    ], Params: []
  },
  //{
  //  Path: '', Title: 'Inquiry', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
  //  Submenu: [
  //    { Path: NavigationConstant.APP_INQUIRY, Title: 'App Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
  //    // { Path: '/Nap/CreditProcess/CreditInquiry/Paging', Title: 'Credit Inquiry', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] }
  //  ], Params: []
  //},
  //{
  //  Path: '', Title: 'Fraud Verif', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
  //  Submenu: [
      
      
  //  ], Params: []
  //},
  { Path: NavigationConstant.FORMS_REPORT, Title: 'Report', Icon: 'fa fa-print', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
  {
    Path: '', Title: 'Integration', Icon: 'ft-home', Class: 'has-sub', Badge: '', BadgeClass: '', IsExternalLink: false,
    Submenu: [
      { Path: NavigationConstant.INTEGRATION_LOS_ERR_DATA_MONITORING, Title: 'Los Error Data Monitoring', Icon: '', Class: '', Badge: '', BadgeClass: '', IsExternalLink: false, Submenu: [], Params: [] },
    ], Params: []
  },
];
