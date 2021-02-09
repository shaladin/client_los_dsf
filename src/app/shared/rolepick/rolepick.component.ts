import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';
import { NavigationConstant } from '../constant/NavigationConstant';

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
    private http: HttpClient, private router: Router, public dialog: MatDialog) {
    this.listRole = data["response"];
  }

  chooseRole(item) {
    var roleUrl = environment.FoundationR3Url + URLConstant.LoginByRole;
    var roleObject = {
      UserName: this.data.user,
      Password: this.data.pwd,
      OfficeCode: item.OfficeCode,
      RoleCode: item.RoleCode,
      JobTitleCode: item.JobTitleCode,
      RequestDateTime: item.BusinessDt,
      ModuleCode: environment.Module,
      Ip: "",
      RowVersion: ""

    };
    if (this.data.pwd == null) {
      var updateRoleUrl = environment.FoundationR3Url + URLConstant.UpdateToken;
      this.http.post(updateRoleUrl, roleObject).subscribe(
        (response) => {
          localStorage.setItem("Token", response["Token"]);
          localStorage.setItem("Menu", JSON.stringify(response["Menu"]));
          localStorage.setItem("EnvironmentModule", environment.Module); 
          AdInsHelper.CreateUserAccess(response);
          let currPath = this.router.routerState.snapshot.url;
          this.router.navigateByUrl(NavigationConstant.PAGES_CONTENT, { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currPath);
            this.dialog.closeAll();
          });
        });

    }
    else {
      this.http.post(roleUrl, roleObject).subscribe(
        (response) => {
          localStorage.setItem("Token", response["Token"]);
          localStorage.setItem("Menu", JSON.stringify(response["Menu"]));
          localStorage.setItem("EnvironmentModule", environment.Module);
          AdInsHelper.CreateUserAccess(response);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
          this.dialog.closeAll();
        });
    }

    // this.http.post(url, roleObject).subscribe(
    //   (response) => {
    //     localStorage.setItem("Menu", JSON.stringify(response["ReturnObject"]));

    //     this.http.post(roleUrl, item).subscribe(
    //       (response) => {
    //         var currentUserContext = new CurrentUserContext;
    //         currentUserContext.UserName = response["returnObject"].userId;
    //         currentUserContext.Office = item.officeCode;
    //         currentUserContext.Role = item.roleCode;
    //         currentUserContext.FullName = item.fullName;
    //         currentUserContext.BusinessDate = item.businessDt;
    //         var dateParse = formatDate(item.businessDt, 'yyyy/MM/dd', 'en-US');
    //         localStorage.setItem("BusinessDate", dateParse);
    //         localStorage.setItem("FullName", item.fullName);
    //         this.currentUserContextService.addCurrentUserContext(currentUserContext);
    //         localStorage.setItem("RoleId", item.refRoleId);
    //         sessionStorage.setItem("UserAccess", JSON.stringify(response["returnObject"]));
    //         if (window.location.pathname == "/pages/login") {
    //           this.router.navigate(['dashboard/dash-board']);
    //         } else {
    //           window.location.reload();
    //         }
    //       }
    //     )

    //   }
    // )

  }

  ngOnInit() {
  }

}
