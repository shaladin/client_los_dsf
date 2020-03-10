import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorDialogComponent } from 'app/error-dialog/error-dialog.component';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Injectable()
export class ErrorDialogService {
    constructor(public dialog: MatDialog,private http:HttpClient) { }
    openDialog(data): void {
        console.log(data)
        //Ini Logout jadi panggil Service untuk Call Logoutnya
        if(data.status=="001" && localStorage.getItem("Username") != undefined)
        {   

            var url = environment.foundationUrl+AdInsConstant.Logout;
            this.http.post(url,"");
        }
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '300px',
            position: {
            top: '12px',
            right: '12px'},
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            let animal;
            animal = result;
        });
    }
}