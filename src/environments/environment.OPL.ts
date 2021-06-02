// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  navbarColor: 'transparent',
  // losUrl: 'http://localhost:5001',
  // FoundationR3Url: 'http://localhost:5000',
  losUrl: 'http://r3impl-appsvr.ad-ins.com/ROS_BE',
  FoundationR3Url: 'http://r3impl-appsvr.ad-ins.com/FOUNDATION_OPL',
  DMSUrl : "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx",
  AMSUrl : "http://r3impl-appsvr.ad-ins.com/AMS",
  LMSUrl : "http://r3impl-appsvr.ad-ins.com/LMS",
  ApprovalR3Url: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL',
  ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
  FoundationR3Web: 'http://r3impl-websvr.ad-ins.com/Foundation',
  losR3Web: 'http://r3impl-websvr.ad-ins.com/ROS_FE',
  WorkflowR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL',
  WebSocketURL: 'http://r3impl-appsvr.ad-ins.com/FOUNDATION_R3',
  DashboardURL: 'http://r3impl-appsvr.ad-ins.com/Dashboard',
  dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
  WfR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
  ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  Module:"LOS"
};