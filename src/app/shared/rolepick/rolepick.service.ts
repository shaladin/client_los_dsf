import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolepickComponent } from 'app/shared/rolepick/rolepick.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { CurrentUserContextService } from 'app/shared/CurrentUserContext/current-user-context.service';

@Injectable()
export class RolePickService {
    constructor(public dialog: MatDialog, private http: HttpClient,
        private currentUserContextService: CurrentUserContextService,
        private router: Router) { }
    openDialog(data, type = ""): void {
        console.log("Get User Title Role");
        console.log(data);
        if (data.length == undefined) {
            var url = environment.foundationUrl + AdInsConstant.GetListDataCurrentUser;
            var user = { Username: localStorage.getItem("Username") };
            this.http.post(url, user).subscribe(
                (response) => {
                    console.log(response["returnObject"]);
                    //Kalau cuman 1 Role maka lgsg masuk ke Dashboard
                    var obj = response["returnObject"];
                    if (obj.length == 1 && type == "") {
                        var item = obj[0];
                        var url = environment.foundationUrl + AdInsConstant.GetAllActiveRefFormByRefRoleId;
                        var roleObject = { RefRoleId: item.refRoleId };
                        this.http.post(url, roleObject).subscribe(
                            (response) => {
                                localStorage.setItem("Menu", JSON.stringify(response["returnObject"]));
                                var currentUserContext = new CurrentUserContext;
                                currentUserContext.UserName = localStorage.getItem("Username");
                                currentUserContext.Office = item.officeCode;
                                currentUserContext.Role = item.roleCode;
                                currentUserContext.FullName = item.fullName;
                                currentUserContext.BusinessDate = item.businessDt;
                                var dateParse = formatDate(item.businessDt, 'yyyy-MM-dd', 'en-US');
                                localStorage.setItem("BusinessDate", dateParse);
                                localStorage.setItem("FullName", item.fullName);
                                localStorage.setItem("UserAccess", JSON.stringify(item));
                                this.currentUserContextService.addCurrentUserContext(currentUserContext);
                                localStorage.setItem("RoleId", item.refRoleId);
                                this.router.navigate(['dashboard/dash-board']);
                            },
                            (error) => {
                                console.log(error);
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
                            data: response["returnObject"]
                        });

                        dialogRef.afterClosed().subscribe(result => {
                            console.log('The dialog was closed');
                        });
                    }

                },
                (error) => {
                    console.log(error);
                }
            );

        } else {
            var obj = data;
            if (obj.length == 1 && type == "") {
                var item = obj[0];
                var url = environment.foundationUrl + AdInsConstant.GetAllActiveRefFormByRefRoleId;
                var roleObject = { RefRoleId: item.refRoleId };

                //jgn lupa delete
                localStorage.setItem("Menu", "[]");//JSON.stringify(response["returnObject"]));
                var currentUserContext = new CurrentUserContext;
                currentUserContext.UserName = localStorage.getItem("Username");
                currentUserContext.Office = item.officeCode;
                currentUserContext.Role = item.roleCode;
                currentUserContext.FullName = item.fullName;
                currentUserContext.BusinessDate = item.businessDt;
                var dateParse = formatDate(item.businessDt, 'yyyy-MM-dd', 'en-US');
                localStorage.setItem("BusinessDate", dateParse);
                localStorage.setItem("FullName", item.fullName);
                localStorage.setItem("UserAccess", JSON.stringify(item));
                this.currentUserContextService.addCurrentUserContext(currentUserContext);
                localStorage.setItem("RoleId", item.refRoleId);
                this.router.navigate(['dashboard/dash-board']);
                //jgn lupa delete

                // this.http.post(url, roleObject).subscribe(
                //     (response) => {
                //         localStorage.setItem("Menu", JSON.stringify(response["returnObject"]));
                //         var currentUserContext = new CurrentUserContext;
                //         currentUserContext.UserName = localStorage.getItem("Username");
                //         currentUserContext.Office = item.officeCode;
                //         currentUserContext.Role = item.roleCode;
                //         currentUserContext.FullName = item.fullName;
                //         currentUserContext.BusinessDate = item.businessDt;
                //         var dateParse = formatDate(item.businessDt, 'yyyy-MM-dd', 'en-US');
                //         localStorage.setItem("BusinessDate", dateParse);
                //         localStorage.setItem("FullName", item.fullName);
                //         localStorage.setItem("UserAccess", JSON.stringify(item));
                //         this.currentUserContextService.addCurrentUserContext(currentUserContext);
                //         localStorage.setItem("RoleId", item.refRoleId);
                //         this.router.navigate(['dashboard/dash-board']);
                //     },
                //     (error) => {
                //         console.log(error);
                //     }
                // )
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
                    console.log('The dialog was closed');
                });
            }
            //console.log(data)
        }
    }

    closeDialog() {
        this.dialog.closeAll;
    }
}