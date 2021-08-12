import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';
import { NavigationConstant } from '../constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { CommonConstant } from '../constant/CommonConstant';
import { AdInsConstant } from '../AdInstConstant';
@Component({
  selector: 'app-rolepick',
  templateUrl: './rolepick.component.html',
  styleUrls: ['./rolepick.component.scss']
})
export class RolepickComponent implements OnInit, AfterViewInit {

  listRole: any;



  ngAfterViewInit(): void {
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private router: Router, public dialog: MatDialog, private cookieService: CookieService) {
    this.listRole = data["response"];
  }

  chooseRole(item) {
    var roleObject = {
      UserName: this.data.user,
      Password: this.data.pwd,
      OfficeCode: item.OfficeCode,
      RoleCode: item.RoleCode,
      JobTitleCode: item.JobTitleCode,
      RequestDateTime: item.BusinessDt,
      ModuleCode: environment.Module,
      RowVersion: ""

    };
    if (this.data.pwd == null) {
      this.http.post(AdInsConstant.UpdateToken, roleObject).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)

          var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
          AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
          AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
          AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
          AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
          AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));

          AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.MENU]));
          AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
          this.dialog.closeAll();
        });
    }
    else {
      this.http.post(AdInsConstant.LoginByRole, roleObject).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)

          var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
          AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
          AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
          AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
          AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
          AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));

          AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.MENU]));
          AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
          this.dialog.closeAll();
        }
      );
    }
  }

  ngOnInit() {
  }
}
