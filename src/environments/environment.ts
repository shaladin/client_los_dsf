// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  navbarColor: 'transparent',
  losUrl : 'http://localhost:5001',
  // FoundationR3Url: 'http://localhost:5000',
  //losUrl : 'http://r3app-server.ad-ins.com/LOS',
  FoundationR3Url: 'http://r3app-server.ad-ins.com/FOUNDATION_R3',
  ApprovalR3Url: 'http://r3app-server/approval',
  FoundationR3Web: 'http://r3web-server/Foundation',
  losR3Web : 'http://r3web-server/LOSR3',
  WorkflowR3Url: 'http://R3App-Server.ad-ins.com/WORKFLOW_R3'

};


