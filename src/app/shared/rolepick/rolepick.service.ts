import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RolepickComponent } from 'app/shared/rolepick/rolepick.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsHelper } from '../AdInsHelper';
import { CommonConstant } from '../constant/CommonConstant';
import { NavigationConstant } from '../constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { AdInsConstant } from '../AdInstConstant';

@Injectable()
export class RolePickService {
    constructor(public dialog: MatDialog, private http: HttpClient,
        private router: Router, private cookieService: CookieService) { }
    openDialog(data, type = ""): void {
        if (type == "modal") {
            let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
            this.http.post(AdInsConstant.GetListJobTitleByUsernameAndModuleV2, {UserName : UserAccess['UserName'], Module : environment.Module}, AdInsConstant.SpinnerOptions).subscribe(
                (response) => {
                    const object = {
                        response: response
                    };

                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.id = 'role-modal';
                    dialogConfig.width = '45%';
                    dialogConfig.data = object;
                    dialogConfig.backdropClass = "blur-bg";
                    const dialogRef = this.dialog.open(RolepickComponent, dialogConfig);

                    dialogRef.afterClosed().subscribe(() => {
                    });
                }
            );


        } else {
            if (data.response.RefUserRoles.length == 1 && type == "") {
                var item = data.response;
                var UserIdentityObj = {
                    RefUserId: item.RefUserId,
                    UserName: item.Username,
                    EmpNo: item.EmpNo,
                    EmpName: item.EmpName,
                    OfficeId: item.RefUserRoles[0].RefOfficeId,
                    OfficeCode: item.RefUserRoles[0].OfficeCode,
                    OfficeName: item.RefUserRoles[0].OfficeName,
                    MrOfficeTypeCode: item.RefUserRoles[0].MrOfficeTypeCode,
                    RoleId: item.RefUserRoles[0].Roles[0].RefRoleId,
                    RoleCode: item.RefUserRoles[0].Roles[0].RoleCode,
                    RoleName: item.RefUserRoles[0].Roles[0].RoleName,
                    JobTitleId: item.RefUserRoles[0].Roles[0].RefJobTitleId,
                    JobTitleCode: item.RefUserRoles[0].Roles[0].JobTitleCode,
                    JobTitleName: item.RefUserRoles[0].Roles[0].JobTitleName,
                    BusinessDt: item.BusinessDt,
                    BusinessDtStr: item.BusinessDtStr,
                    Email: item.Email1,
                    CoyName: item.CoyName
                }
                let roleObject = {
                    UserName: data.user,
                    Password: data.pwd,
                    OfficeCode: item.OfficeCode,
                    RoleCode: item.RoleCode,
                    JobTitleCode: item.JobTitleCode,
                    RequestDateTime: item.BusinessDt,
                    RowVersion: "",
                    Ip: "",
                    ModuleCode: environment.Module,
                    UserIdentityObj: UserIdentityObj
                };
                let SpinnerHeaders = new HttpHeaders({
                    'IsLoading': "true"
                });
                let SpinnerOptions = { headers: SpinnerHeaders, withCredentials: true };
                this.http.post(AdInsConstant.LoginByRoleV2, roleObject, SpinnerOptions).subscribe(
                    (response) => {
                        //Cookie sudah diambil dari BE (Di set manual dulu)

                        var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
                        AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
                        AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
                        AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
                        AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
                        AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));
                        AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);

                        this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, {RoleCode: item.RefUserRoles[0].Roles[0].RoleCode, ModuleCode: environment.Module}, { withCredentials: true }).subscribe(
                            (response) => {
                                AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
                                this.router.navigate([NavigationConstant.DASHBOARD]);
                            });
                    }
                )
            }
            //Ini kalau dia ada lebih dari 1 Role, maka buka modal
            else {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = true;
                dialogConfig.id = 'role-modal';
                dialogConfig.width = '45%';
                dialogConfig.data = data;
                dialogConfig.backdropClass = "blur-bg";
                const dialogRef = this.dialog.open(RolepickComponent, dialogConfig);


                dialogRef.afterClosed().subscribe(() => {
                });
            }
        }
    }

    closeDialog() {
        this.dialog.closeAll;
    }
}