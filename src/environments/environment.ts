// The file contents for the current environment will overwrite these during build.

// The build system defaults to the dev environment which uses `environment.ts`, but if you do

// `ng build --env=prod` then `environment.prod.ts` will be used instead.

// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {

   production: true,
  
   navbarColor: 'transparent',
  
   losUrl: 'http://172.31.232.44:8888',
  
   FoundationR3Url: 'http://172.31.232.43:8888',
  
   DMSUrl : "http://172.31.232.6/LITEDMS/Integration/ViewDoc.aspx",
  
   AMSUrl : "http://r3app-server.ad-ins.com/AMS", //OPL dah ada
  
   LMSUrl : "http://r3app-server.ad-ins.com/LMS", //OPL dah ada
  
   ApprovalR3Url: 'http://172.31.232.40:8888',
  
   ApprovalR3OplUrl: 'http://r3impl-appsvr.ad-ins.com/APPROVAL_OPL_BE_R3/',
  
   FoundationR3Web: 'http://qa-fou.corp.dipostar.com',
  
   losR3Web: 'http://localhost:4200',
  
   lmsR3web : "http://r3impl-websvr.ad-ins.com/LMS",
  
   cmsR3Web: 'http://r3web-server.ad-ins.com/CMS',
  
   WorkflowR3Url: 'http://172.31.232.48:8080',
  
   WebSocketURL: 'http://172.31.232.43:8888',
  
   DashboardURL: 'http://r3app-server.ad-ins.com/Dashboard',
  
   dmsURL: 'http://172.31.232.6/LITEDMS/Integration/ViewDoc.aspx',
  
   WfR3Url: 'http://172.31.232.48:8080',
  
   ChipperKeyLocalStorage: "AdInsFOU2020OKOK", // 256 bit atau 16 karakter
  
   ChipperKeyCookie: "AdInsFOU12345678", // 256 bit atau 16 karakter & harus sama dengan BE
  
   Superset: 'http://linuxdev4:8091/',
  
  r2Url: 'http://172.30.2.43/CONFINS',
  
   Module:"LOS",
  
   isCore : true,
  
   SpinnerOnHttpPost: true
  
  };
  