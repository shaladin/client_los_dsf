import { Component, OnInit, AfterViewInit, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CurrentUserContextService } from 'app/shared/CurrentUserContext/current-user-context.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-rolepick',
  templateUrl: './rolepick.component.html',
  styleUrls: ['./rolepick.component.scss']
})
export class RolepickComponent implements OnInit, AfterViewInit {


  ngAfterViewInit(): void {
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
    private currentUserContextService: CurrentUserContextService,
    private http: HttpClient,
    private router: Router) {
  }

  chooseRole(item) {
    console.log(item);
    var url = environment.foundationUrl + AdInsConstant.GetAllActiveRefFormByRefRoleId;
    var roleUrl = environment.foundationUrl + AdInsConstant.SelectRole;
    var roleObject = { RefRoleId: item.refRoleId, ModuleCode: "FOUNDATION"};
    this.http.post(url, roleObject).subscribe(
      (response) => {
        localStorage.setItem("Menu", JSON.stringify(response["returnObject"]));

        this.http.post(roleUrl, item).subscribe(
          (response) => {
            var currentUserContext = new CurrentUserContext;
            currentUserContext.UserName = response["returnObject"].userId;
            currentUserContext.Office = item.officeCode;
            currentUserContext.Role = item.roleCode;
            currentUserContext.FullName = item.fullName;
            currentUserContext.BusinessDate = item.businessDt;
            var dateParse = formatDate(item.businessDt, 'yyyy-MMM-dd', 'en-US');
            localStorage.setItem("BusinessDate", dateParse);
            localStorage.setItem("FullName", item.fullName);
            this.currentUserContextService.addCurrentUserContext(currentUserContext);
            localStorage.setItem("RoleId", item.refRoleId);
            console.log(response);
            localStorage.setItem("UserAccess", JSON.stringify(response["returnObject"]));
            if (window.location.pathname == "/pages/login") {
              this.router.navigate(['dashboard/dash-board']);
            } else {
              window.location.reload();
            }
          },
          (error) => {
            console.log(error);
          }
        )

      },
      (error) => {
        console.log(error);
      }
    )

  }

  ngOnInit() {
  }

}
