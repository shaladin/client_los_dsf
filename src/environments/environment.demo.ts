// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  navbarColor: 'transparent',
  //losUrl: 'http://localhost:5001',
  //FoundationR3Url: 'http://localhost:5000',
  losUrl: 'https://r3app-server.ad-ins.com:8443/LOS',
  FoundationR3Url: 'https://r3app-server.ad-ins.com:8443/FOUNDATION',
  DMSUrl: "https://sky.ad-ins.com/LiteDMS_POC/Integration/ViewDoc.aspx",
  AMSUrl: "http://r3app-server.ad-ins.com/AMS_DEMO", //OPL dah ada
  LMSUrl: "http://r3app-server.ad-ins.com/LMS_DEMO", //OPL dah ada
  ApprovalR3Url: 'https://r3app-server.ad-ins.com:8443/Approval_R3_BE',
  ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
  FoundationR3Web: 'https://r3web-server.ad-ins.com:8443/FOUNDATION_DEMO',
  losR3Web: 'https://r3web-server.ad-ins.com:8443/LOS_DEMO',
  lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
  cmsR3Web: 'http://r3web-server.ad-ins.com/CMS',
  WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_R3',
  WebSocketURL: 'https://r3app-server.ad-ins.com:8443/FOUNDATION',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
  WfR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
  ChipperKeyLocalStorage: 'AdInsFOU2020OKOK', // 256 bit atau 16 karakter
  ChipperKeyCookie: 'AdInsFOU12345678', // 256 bit atau 16 karakter & harus sama dengan BE
  Module: 'LOS'
};
