// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  navbarColor: 'transparent',
  losUrl: 'http://hodipo-appr3.ad-ins.com/DSF_QA/LOS_BE_R3_QA',
  FoundationR3Url: 'http://hodipo-appr3.ad-ins.com/DSF_QA/FOUNDATION_BE_R3_QA',
  DMSUrl : "http://sky.ad-ins.com/LiteDMS_POC/Integration/ViewDoc.aspx",
  AMSUrl : "http://r3app-server.ad-ins.com/AMS", //OPL dah ada
  LMSUrl : "http://r3app-server.ad-ins.com/LMS", //OPL dah ada
  ApprovalR3Url: 'http://hodipo-appr3.ad-ins.com/DSF_QA/APPROVAL_R3_BE_QA',
  ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3',
  FoundationR3Web: 'http://hodipo-webr3.ad-ins.com/DSF_QA/FOUNDATION_FE_R3_QA',
  losR3Web: 'http://hodipo-webr3.ad-ins.com/DSF_QA/LOS_FE_R3_QA',
  lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
  cmsR3Web: 'http://r3web-server.ad-ins.com/CMS',
  WorkflowR3Url: 'http://172.31.224.4/Workflow_R3',
  WebSocketURL: 'http://hodipo-appr3.ad-ins.com/DSF_QA/FOUNDATION_BE_R3_QA',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
  WfR3Url: 'http://172.31.224.4/Workflow_R3',
  ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  Superset: 'http://linuxdev4:8091/',
r2Url: 'http://172.30.2.43/CONFINS',
  Module:"LOS",
  isCore : true
};