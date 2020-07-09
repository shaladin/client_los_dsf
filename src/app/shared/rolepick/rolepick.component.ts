import { Component, OnInit, AfterViewInit, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CurrentUserContextService } from 'app/shared/CurrentUserContext/current-user-context.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';

@Component({
  selector: 'app-rolepick',
  templateUrl: './rolepick.component.html',
  styleUrls: ['./rolepick.component.scss']
})
export class RolepickComponent implements OnInit, AfterViewInit {

  listRole: any;



  ngAfterViewInit(): void {
    console.log("Role Pick");
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private currentUserContextService: CurrentUserContextService,
    private http: HttpClient,
    private router: Router) {
    this.listRole = data["response"];
  }

  chooseRole(item) {
    console.log(item);
    var url = environment.FoundationR3Url + AdInsConstant.GetAllActiveRefFormByRefRoleId;
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
          AdInsHelper.CreateUserAccess(response);
          // var currentUserContext = new CurrentUserContext;
          // currentUserContext.UserName = localStorage.getItem("Username");
          // currentUserContext.Office = item.OfficeCode;
          // currentUserContext.Role = item.RoleCode;
          // currentUserContext.BusinessDate = item.BusinessDt;
          // localStorage.setItem("BusinessDateRaw",item.BusinessDt);
          // var DateParse = formatDate(item.BusinessDt, 'yyyy/MM/dd', 'en-US');
          // localStorage.setItem("BusinessDate", DateParse);
          // localStorage.setItem("UserAccess", JSON.stringify(response["Identity"]));
          // this.currentUserContextService.addCurrentUserContext(currentUserContext);
          window.location.reload();
          //this.router.navigate(['dashboard/dash-board']);
        },
        (error) => {
          console.log(error);
        }
      );

    }
    else {
      this.http.post(roleUrl, roleObject).subscribe(
        (response) => {
          localStorage.setItem("Token", response["Token"]);
          localStorage.setItem("Menu", JSON.stringify(response["Menu"]));
          AdInsHelper.CreateUserAccess(response);
          // var currentUserContext = new CurrentUserContext;
          // currentUserContext.UserName = localStorage.getItem("Username");
          // currentUserContext.Office = item.OfficeCode;
          // currentUserContext.Role = item.RoleCode;
          // currentUserContext.BusinessDate = item.BusinessDt;
          // localStorage.setItem("BusinessDateRaw",item.BusinessDt);
          // var DateParse = formatDate(item.BusinessDt, 'yyyy/MM/dd', 'en-US');
          // localStorage.setItem("BusinessDate", DateParse);
          // localStorage.setItem("UserAccess", JSON.stringify(response["Identity"]));
          // this.currentUserContextService.addCurrentUserContext(currentUserContext);
          window.location.reload();
          //this.router.navigate(['dashboard/dash-board']);
        },
        (error) => {
          console.log(error);
        }
      );
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
    //         console.log(response);
    //         sessionStorage.setItem("UserAccess", JSON.stringify(response["returnObject"]));
    //         if (window.location.pathname == "/pages/login") {
    //           this.router.navigate(['dashboard/dash-board']);
    //         } else {
    //           window.location.reload();
    //         }
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     )

    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // )

  }

  ngOnInit() {
    console.log("Role Pick");
  }

}
