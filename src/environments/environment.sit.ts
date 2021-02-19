// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  navbarColor: 'transparent',
  //losUrl : 'http://localhost:5001',
  // FoundationR3Url: 'http://localhost:5000',
  losUrl: 'http://r3app-server.ad-ins.com/LOS_SIT_CY4',
  FoundationR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_SIT_CY4',
  DMSUrl : "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx",
  ApprovalR3Url: 'http://r3app-server.ad-ins.com/APPROVAL_SIT',
  FoundationR3Web: 'http://r3web-server.ad-ins.com/FOUNDATION_SIT_CY4',
  losR3Web: 'http://r3web-server.ad-ins.com/LOS_SIT_CY4',
  WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_SIT_CY4',
  WebSocketURL: 'http://r3app-server.ad-ins.com/FOUNDATION_SIT_CY4',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  Module: "LOS"
};


