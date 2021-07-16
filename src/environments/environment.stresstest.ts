// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    navbarColor: 'lime',
    losUrl: 'https://R3STWEBBE.ad-ins.com/LOS_BE',
    FoundationR3Url: 'https://R3STWEBBE.ad-ins.com/FOUNDATION_BE',
    DMSUrl : "http://sky.ad-ins.com/LiteDMS_POC/Integration/ViewDoc.aspx",
    AMSUrl : "https://R3STWEBBE.ad-ins.com/AMS", //OPL dah ada
    LMSUrl : "https://R3STWEBBE.ad-ins.com/LMS", //OPL dah ada
    DashboardURL: 'https://R3STWEBBE.ad-ins.com/Dashboard',
    WebSocketURL: 'https://R3STWEBBE.ad-ins.com/FOUNDATION_BE',    
    FoundationR3Web: 'https://R3STWEBFE.ad-ins.com/FOUNDATION_FE',
    losR3Web: 'https://R3STWEBFE.ad-ins.com/LOS_FE',
    lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
    WorkflowR3Url: 'http://r3stengine.ad-ins.com/WORKFLOW',
    ApprovalR3Url: 'http://r3stengine.ad-ins.com/approval',
    ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
    dmsURL: 'http://kfx-svr/LITEDMS_OPL/LiteDMS/pageconfins.aspx',
    WfR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL/',
    ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
    ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
    Module: "LOS"
};  