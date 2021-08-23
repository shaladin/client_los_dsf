// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  navbarColor: 'transparent',
  losUrl: 'https://localhost:5001',
  FoundationR3Url: 'http://localhost:5000',
  //losUrl: 'http://r3impl-appsvr.ad-ins.com/LOS_DSF_IMPL',
  //FoundationR3Url: 'http://r3impl-appsvr.ad-ins.com/FOUNDATION_DSF_IMPL',
  DMSUrl: "http://sky.ad-ins.com/LiteDMS_POC/Integration/ViewDoc.aspx",
  AMSUrl: "http://r3app-server.ad-ins.com/AMS_DEMO", //OPL dah ada
  LMSUrl: "http://r3app-server.ad-ins.com/LMS_DEMO", //OPL dah ada
  ApprovalR3Url: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_R3_BE_DSF_IMPL',
  ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
  FoundationR3Web: 'http://r3impl-websvr.ad-ins.com/FOU_DSF_IMPL',
  losR3Web: 'http://r3impl-websvr.ad-ins.com/LOS_DSF_IMPL',
  lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
  WorkflowR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_DSF_IMPL',
  WebSocketURL: 'http://r3impl-appsvr.ad-ins.com/FOU_DSF_IMPL',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
  WfR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
  ChipperKeyLocalStorage: 'AdInsFOU2020OKOK', // 256 bit atau 16 karakter
  ChipperKeyCookie: 'AdInsFOU12345678', // 256 bit atau 16 karakter & harus sama dengan BE
  Module: 'LOS',
  isCore: false
};
