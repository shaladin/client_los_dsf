// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    navbarColor: 'transparent',
    losUrl: 'http://r3app-server.ad-ins.com/LOS',
    FoundationR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_R3',
    DMSUrl : "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx",
    AMSUrl : "http://r3app-server.ad-ins.com/AMS", //OPL dah ada
    LMSUrl : "http://r3app-server.ad-ins.com/LMS", //OPL dah ada
    ApprovalR3Url: 'http://r3app-server/approval',
    FoundationR3Web: 'http://r3web-server.ad-ins.com/Foundation',
    losR3Web: 'http://r3web-server/LOSR3',
    WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_R3',
    WebSocketURL: 'http://r3app-server.ad-ins.com/FOUNDATION_R3',
    DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
    dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
    WFThingsToDoUrl: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
    ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
    ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
    Module:"LOS"
  };
  
  
  