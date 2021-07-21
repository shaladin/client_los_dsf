// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  navbarColor: 'transparent',
  //losUrl : 'http://localhost:5001',
  // FoundationR3Url: 'http://localhost:5000',
  losUrl: 'http://r3app-server.ad-ins.com/LOS_SIT_CY6',
  FoundationR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_SIT_CY6',
  DMSUrl : "http://sky.ad-ins.com/LiteDMS_POC/Integration/ViewDoc.aspx",
  AMSUrl : "http://r3app-server.ad-ins.com/AMS", //OPL dah ada
  LMSUrl : "http://r3app-server.ad-ins.com/LMS", //OPL dah ada
  ApprovalR3Url: 'http://r3app-server.ad-ins.com/APPROVAL_SIT',
  ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
  FoundationR3Web: 'http://r3web-server.ad-ins.com/FOUNDATION_SIT_CY6',
  losR3Web: 'http://r3web-server.ad-ins.com/LOS_SIT_CY6',
  lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
  WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_SIT_CY6',
  WebSocketURL: 'http://r3app-server.ad-ins.com/FOUNDATION_SIT_CY6',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
  WfR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
  ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  Module: "LOS"
};


