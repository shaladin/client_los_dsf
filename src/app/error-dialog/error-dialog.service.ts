import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from 'app/error-dialog/error-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Injectable()
export class ErrorDialogService {
    constructor(public dialog: MatDialog, private http: HttpClient, private cookieService: CookieService) { }
    openDialog(data): void {
        //Ini Logout jadi panggil Service untuk Call Logoutnya
        if (data.status == "001" && AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_NAME) != undefined) {

            var url = environment.FoundationR3Url + URLConstant.Logout;
            this.http.post(url, "");
        }
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '300px',
            position: {
                top: '12px',
                right: '12px'
            },
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            let animal;
            animal = result;
        });
    }
}