// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  navbarColor: 'transparent',
  losUrl: 'http://localhost:5001',
  // FoundationR3Url: 'http://localhost:5000',
  // losUrl: 'http://r3app-server.ad-ins.com/LOS',
  FoundationR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_R3',
  DMSUrl : "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx",
  AMSUrl : "http://r3app-server.ad-ins.com/AMS_DEMO", //OPL dah ada
  LMSUrl : "http://r3app-server.ad-ins.com/LMS_DEMO", //OPL dah ada
  ApprovalR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_R3/Approval',
  FoundationR3Web: 'http://r3web-server.ad-ins.com/Foundation',
  losR3Web: 'http://r3web-server/LOSR3',
  WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_R3',
  WebSocketURL: 'http://r3app-server.ad-ins.com/FOUNDATION_R3',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  Module:"LOS"
};