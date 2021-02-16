import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RolepickComponent } from 'app/shared/rolepick/rolepick.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';
import { CommonConstant } from '../constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';

@Injectable()
export class RolePickService {
    constructor(public dialog: MatDialog, private http: HttpClient,
        private router: Router, private cookieService: CookieService) { }
    openDialog(data, type = ""): void {
        if (type == "modal") {
            var loginByRole = environment.FoundationR3Url + URLConstant.LoginByToken;
            var roleObject2 = {
                RequestDateTime: AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW),
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

                    dialogRef.afterClosed().subscribe(() => {
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
                    ModuleCode: "LOS",
                    RowVersion: ""

                };
                this.http.post(url, roleObject, { withCredentials: true }).subscribe(
                    (response) => {
                        //Cookie sudah diambil dari BE (Di set manual dulu)

                        var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
                        AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
                        AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
                        AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
                        AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
                        AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));

                        AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response["returnObject"]));
                        AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);
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

                dialogRef.afterClosed().subscribe(() => {
                });
            }
        }
    }

    closeDialog() {
        this.dialog.closeAll;
    }
}