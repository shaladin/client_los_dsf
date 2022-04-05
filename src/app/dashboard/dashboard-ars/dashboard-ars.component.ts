import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-ars',
  templateUrl: './dashboard-ars.component.html'
})
export class DashboardArsComponent implements OnInit {

  title_ = ""
  viewName: string = ""
  viewName2: string = ""
  viewName3: string = ""
  viewName4: string = ""
  viewName5: string = ""

  user: string = "";
  officeCode: string = "";
  areaCode: string = "";
  inRoleCode: string = "";
  gsCode: string = "";
  url: string = "";
  param: string = "";
  isReady: boolean = false;
  standalone: string = "?standalone=true"
  supersetPath: string = "superset/dashboard/"
  path: string = "";
  
  isCMO : boolean = false;
  isBM : boolean = false;
  isAM : boolean = false;
  isSU : boolean = false;

  constructor(private cookieService: CookieService, private router: Router) { }

  async ngOnInit() {
    this.path = this.router.url;
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.user = context[CommonConstant.USER_NAME];
    this.inRoleCode = context[CommonConstant.ROLE_CODE];
    this.officeCode = context[CommonConstant.OFFICE_CODE];
    this.areaCode = context[CommonConstant.AREA_CODE];

    this.checkRole();
    this.checkURL();

    console.log(this.user);
    console.log(this.path);
    console.log(this.areaCode);
  }

  checkRole(){
    if(this.inRoleCode == 'CMO'){
      this.param = "&user=" + this.user + "&offcode=" + this.officeCode;
      this.isCMO = true;
    }
    else if (this.inRoleCode == 'BM'){
      this.param = "&user=" + this.user + "&offcode=" + this.officeCode;
      this.isBM = true;
    }
    else if (this.inRoleCode == 'SUPUSR'){
      this.param = "&user=" + this.user;
      this.isSU = true;
    }
    else if (this.inRoleCode == 'AM'){
      this.param = "&user=" + this.user;
      this.isAM = true;
    }
  }
 
  checkURL(){
    if(this.isCMO == true){

      if(this.path == '/Dashboard/DashBoardARS/DashboardSAC01'){
        console.log("masuk ke cmo")
        this.title_ = "SAC01 - Sales Marketing - Year to Date"
        this.viewName = "V_FACT_AGREEMENT_COM"
        this.viewName2 = "V_FACT_TARGET_CMO"
        this.viewName3 = "V_FACT_APP"
        this.viewName4 = "V_FACT_APP_COMBINE_FACT_TARGET_CMO"
        // this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/Username eq '" + this.user + "' and " + this.viewName2 + "/Username eq '" + this.user + "' and " + this.viewName3 + "/Username eq '" + this.user + "' and " + this.viewName4 + "/Username eq '" + this.user + "'";
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/Username%20eq%20%27" + this.user + "%27%20and%20" + this.viewName2 + "/Username%20eq%20%27" + this.user + "%27%20and%20" + this.viewName3 + "/Username%20eq%20%27" + this.user + "%27%20and%20" + this.viewName4 + "/Username%20eq%20%27" + this.user + "%27";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=fd423877-c16a-45c2-8589-daa33814a119&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      this.isReady = true;
      console.log(this.url)
    }

    else if(this.isBM == true){
      if(this.path == '/Dashboard/DashBoardARS/DashboardSAO03'){
        this.title_ = "SAO01 - Sales Overall - Year to Date"
        this.viewName = "V_FILTER_BRANCH"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=cdf1d1c0-e404-45fa-971c-9dd03758da3c&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardDEB01'){
        this.title_ = "DEB01 - Top 5 Dealer Branch Performance - YTD"
        this.viewName = "V_FILTER_BRANCH"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=3a1a2e8d-ae23-4624-90e2-107a4a1fe20a&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN11'){
        this.title_ = "Dashboard VIN11 - Vintage 30 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=6517ef7e-0fe9-4f6d-a527-521276276f50&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN12'){
        this.title_ = "Dashboard VIN12 - Vintage 60 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=a4ac10cc-dc24-4b1b-aab8-87692d70f9de&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN13'){
        this.title_ = "Dashboard VIN13 - Vintage 90 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=81c92ff6-4813-4879-bf62-91b3450b1298&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN14'){
        this.title_ = "Dashboard VIN14 - Vintage 120 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=5b86d799-bac4-4091-b176-e6f04a29ea16&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN15'){
        this.title_ = "Dashboard VIN15 - Vintage 210 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=5faca765-9bca-4fe5-bd9e-b8c1da773093&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardDAR01'){
        this.title_ = "DAR01 - Daily Report"
        this.viewName = "V_DAR01_BOOKING"
        this.viewName2 = "V_DAR01_OS_PRINCIPAL"
        this.viewName3 = "V_DAR01_DELIQUNCY"
        this.viewName4 = "V_DAR01_INVENTORY"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/BranchCode eq '" + this.officeCode + "' and " + this.viewName2 + "/BranchCode eq '" + this.officeCode + "' and " + this.viewName3 + "/BranchCode eq '" + this.officeCode + "' and " + this.viewName4 + "/BranchCode eq '" + this.officeCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=dcc282e4-277d-479b-826e-fc7b3bbbef48&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      this.isReady = true;
    }
    else if(this.isAM == true){
      if(this.path == '/Dashboard/DashBoardARS/DashboardSAO02'){
        this.title_ = "SAO02 - Sales Overall - Year to Date"
        this.viewName = "V_FILTER_BRANCH"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=6d25a298-f7dd-4196-a8c2-853f2ce310f3&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardDEA01'){
        this.title_ = "DEA01 - Top 5 Dealer Area Performance"
        this.viewName = "V_FILTER_BRANCH"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=3a2f787a-0a67-4898-9e99-e817909bdfd9&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if (this.path == '/Dashboard/DashBoardARS/DashboardVIN06') {
        this.title_ = "Dashboard VIN06 - Vintage 30 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=fe299dcb-d56d-42ad-ad84-a62e56e880e3&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if (this.path == '/Dashboard/DashBoardARS/DashboardVIN07') {
        this.title_ = "Dashboard VIN07 - Vintage 60 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=539cccaa-5a6e-40e3-958c-55986139fd6f&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if (this.path == '/Dashboard/DashBoardARS/DashboardVIN08') {
        this.title_ = "Dashboard VIN08 - Vintage 90 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=60a1dddd-f945-4269-8bf1-74f24b5586ad&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if (this.path == '/Dashboard/DashBoardARS/DashboardVIN09') {
        this.title_ = "Dashboard VIN09 - Vintage 120 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=a14c439e-9c3e-4fbb-9d96-6091b366d807&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if (this.path == '/Dashboard/DashBoardARS/DashboardVIN10') {
        this.title_ = "Dashboard VIN10 - Vintage 210 - GoLive Last 5 Years"
        this.viewName = "V_FACT_VINTAGE"
        this.param = "&pageName=ReportSection&$filter=" + this.viewName + "/AreaCode eq '" + this.areaCode + "'";
        this.url = "https://app.powerbi.com/reportEmbed?reportId=d2009506-2472-4fdc-b529-18cd2155435a&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      this.isReady = true;
    }
    else if(this.isSU == true){
      if(this.path == '/Dashboard/DashBoardARS/DashboardSAO01'){
        this.title_ = "SAO01 - Sales Overall - Year to Date"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=7c395b62-5ece-4b4f-85af-472991fde9d1&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardDEA01'){
        this.title_ = "DEA01 - Top 5 Dealer Area Performance - YTD"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=3a2f787a-0a67-4898-9e99-e817909bdfd9&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardDEB01'){
        this.title_ = "DEB01 - Top 5 Dealer Branch Performance - YTD"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=3a1a2e8d-ae23-4624-90e2-107a4a1fe20a&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN01'){
        this.title_ = "VIN01 - Vintage 30 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=ceb115b3-656e-4030-9051-d9e71d633abf&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN02'){
        this.title_ = "VIN02 - Vintage 60 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=299dbee8-fca8-4820-b139-aafa1e9b93a6&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN03'){
        this.title_ = "VIN03 - Vintage 90 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=b0a3c9c6-9562-4dfe-b20e-5e17ed8df74f&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN04'){
        this.title_ = "VIN04 - Vintage 120 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=6423f767-9bfc-444a-b860-f09e7d452786&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN05'){
        this.title_ = "VIN05 - Vintage 210 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=ed609149-2740-4000-a5ff-9ff3d79e0a11&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN06'){
        this.title_ = "VIN06 - Vintage 30 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=fe299dcb-d56d-42ad-ad84-a62e56e880e3&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN07'){
        this.title_ = "VIN07 - Vintage 60 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=539cccaa-5a6e-40e3-958c-55986139fd6f&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN08'){
        this.title_ = "VIN08 - Vintage 90 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=60a1dddd-f945-4269-8bf1-74f24b5586ad&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN09'){
        this.title_ = "VIN09 - Vintage 120 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=a14c439e-9c3e-4fbb-9d96-6091b366d807&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN10'){
        this.title_ = "VIN10 - Vintage 210 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=d2009506-2472-4fdc-b529-18cd2155435a&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN11'){
        this.title_ = "Dashboard VIN11 - Vintage 30 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=6517ef7e-0fe9-4f6d-a527-521276276f50&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN12'){
        this.title_ = "Dashboard VIN12 - Vintage 60 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=a4ac10cc-dc24-4b1b-aab8-87692d70f9de&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN13'){
        this.title_ = "Dashboard VIN13 - Vintage 90 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=81c92ff6-4813-4879-bf62-91b3450b1298&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN14'){
        this.title_ = "Dashboard VIN14 - Vintage 120 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=5b86d799-bac4-4091-b176-e6f04a29ea16&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardVIN15'){
        this.title_ = "Dashboard VIN15 - Vintage 210 - GoLive Last 5 Years"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=5faca765-9bca-4fe5-bd9e-b8c1da773093&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" + this.param;
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardAGM01'){
        this.title_ = "AGM01 - Agreement Move Roll Rate Analysis - Last 6 Months"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=35836cf6-2e6f-4ce9-89e8-2bfdd32bf583&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardAGM02'){
        this.title_ = "AGM02 - Agreement Move Analysis - Last 6 Months"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=ff759b36-ae0f-4271-a1ab-5f05fcc6ec49&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      else if(this.path == '/Dashboard/DashBoardARS/DashboardAGM03'){
        this.title_ = "AGM03 - Agreement Move Bucket Analysis - Last 6 Months"
        this.url = "https://app.powerbi.com/reportEmbed?reportId=a19fd52b-35e7-446a-b840-a9a1feec2fab&autoAuth=true&ctid=c0cee9c2-19a6-4aba-82e5-34bfc0b2dbce&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
      }
      this.isReady = true;
    }
  }
}
