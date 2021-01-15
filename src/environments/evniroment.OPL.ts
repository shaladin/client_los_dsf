// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    navbarColor: 'transparent',
    // losUrl: 'http://localhost:5001',
    // FoundationR3Url: 'http://localhost:5000',
    losUrl: 'http://r3impl-appsvr.ad-ins.com/ROS_BE',
    FoundationR3Url: 'http://r3impl-appsvr.ad-ins.com/FOUNDATION_OPL',
    ApprovalR3Url: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL',
    FoundationR3Web: 'http://r3impl-websvr.ad-ins.com/Foundation',
    losR3Web: 'http://r3impl-websvr.ad-ins.com/ROS_FE',
    WorkflowR3Url: 'http://r3impl-appsvr.ad-ins.com/WORKFLOW_OPL',
    WebSocketURL: 'http://r3impl-appsvr.ad-ins.com/FOUNDATION_R3',
    DashboardURL: 'http://r3impl-appsvr.ad-ins.com/Dashboard',
    Module:"LOS"
};  