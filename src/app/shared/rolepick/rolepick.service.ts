import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RolepickComponent } from 'app/shared/rolepick/rolepick.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentUserContextService } from 'app/shared/CurrentUserContext/current-user-context.service';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';
import { CommonConstant } from '../constant/CommonConstant';

@Injectable()
export class RolePickService {
    constructor(public dialog: MatDialog, private http: HttpClient,
        private currentUserContextService: CurrentUserContextService,
        private router: Router) { }
    openDialog(data, type = ""): void {
        if (type == "modal") {
            var loginByRole = environment.FoundationR3Url + URLConstant.LoginByToken;
            var roleObject2 = {
                RequestDateTime: localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW),
                Ip: "",
                RowVersion: ""

            };
            this.http.post(loginByRole, roleObject2).subscribe(
                (response) => {
                    const object = {
                        response: response["ReturnObject"]
                    };

                    const dialogRef = this.dialog.open(RolepickComponent, {
                        id: 'role-modal',
                        width: '85%',
                        position: {
                            top: '12px'
                        },
                        data: object
                    });

                    dialogRef.afterClosed().subscribe(result => {
                    });
                }
            );


        } else {
            if (data.response.length == 1 && type == "") {
                var item = data.response[0];
                var url = environment.FoundationR3Url + URLConstant.LoginByRole;
                var roleObject = {
                    UserName: data.user,
                    Password: data.pwd,
                    OfficeCode: item.OfficeCode,
                    RoleCode: item.RoleCode,
                    JobTitleCode: item.JobTitleCode,
                    RequestDateTime: item.BusinessDt,
                    ModuleCode : "LOS",
                    Ip: "",
                    RowVersion: ""

                };
                this.http.post(url, roleObject).subscribe(
                    (response) => {
                        localStorage.setItem("Menu", JSON.stringify(response["Menu"]));
                        localStorage.setItem("Token", response["Token"]);
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
                        this.router.navigate(['dashboard/dash-board']);
                    }
                )
            }
            //Ini kalau dia ada lebih dari 1 Role, maka buka modal
            else {
                const dialogRef = this.dialog.open(RolepickComponent, {
                    id: 'role-modal',
                    width: '85%',
                    position: {
                        top: '12px'
                    },
                    data: data
                });

                dialogRef.afterClosed().subscribe(result => {
                });
            }
        }
    }

    closeDialog() {
        this.dialog.closeAll;
    }
}