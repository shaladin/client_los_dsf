// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  navbarColor: 'transparent',
  //losUrl: 'http://localhost:5001',
  // FoundationR3Url: 'http://localhost:5000',
  losUrl: 'http://r3app-server.ad-ins.com/LOS_SWEEP',
  FoundationR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_SWEEP',
  ApprovalR3Url: 'http://r3app-server.ad-ins.com/APPROVAL_SWEEP',
  FoundationR3Web: 'http://r3web-server.ad-ins.com/Foundation',
  losR3Web: 'http://r3web-server/LOSR3',
  WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_SWEEP',
  WebSocketURL: 'http://r3app-server.ad-ins.com/FOUNDATION_R3',
  DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  Module:"LOS"
};


