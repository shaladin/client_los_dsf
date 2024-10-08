// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  navbarColor: 'transparent',
  // losUrl: 'http://localhost:5001',
  //FoundationR3Url: 'http://localhost:5000',
  losUrl: 'http://los-be.confins.one:8888',
  FoundationR3Url: 'http://foundation-be.confins.one:8888',
  DMSUrl : "http://qanonlp-ldms-web.corp.dipostar.com/LiteDMS/Integration/ViewDoc.aspx",
  AMSUrl : "http://r3app-server.ad-ins.com/AMS_DEMO",
  LMSUrl : "http://r3app-server.ad-ins.com/LMS_DEMO",
  ApprovalR3Url: 'http://approval-be.confins.one:8888',
  //ApprovalR3Url: 'http://localhost:5000/Approval',
  ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
  FoundationR3Web:'http://foundation-be.confins.one:8888',
  //FoundationR3Web:'http://localhost:5000',
  losR3Web: 'http://localhost:4200',
  WorkflowR3Url: 'http://engine.confins.one/Workflow_Dev_R3/',
  cmsR3Web: 'http://r3web-server.ad-ins.com/CMS',
  WebSocketURL: 'http://foundation-be.confins.one:8888',
  //WebSocketURL: 'http://localhost:5000',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
  WfR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
  ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  Module:"LOS",
  lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
  r2Url: 'http://r3impl-appsvr.ad-ins.com/DIPODEVR2/CONFINS_DSF_IMPL',
  Superset: 'http://linuxdev4:8091/',
  isCore: true,
  SpinnerOnHttpPost: true
};
