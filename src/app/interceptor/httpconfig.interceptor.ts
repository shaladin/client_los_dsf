import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate } from '@angular/common';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ErrorDialogService } from 'app/error-dialog/error-dialog.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequestCriteriaObj } from 'app/shared/model/RequestCriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    count = 0;
    constructor(public errorDialogService: ErrorDialogService, private spinner: NgxSpinnerService, private router: Router, public toastr: ToastrService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(request);
        if (request.method == "POST" && (request.body == null || request.body.isLoading == undefined || request.body.isLoading == true)) {
            this.spinner.show();
        }
        
        if (request.url != "./assets/i18n/en.json") {
            this.count++;
        }

        var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
        var token: string = "";
        var myObj;
        let today = new Date();
        var businessDt = formatDate(today, 'yyyy-MM-dd', 'en-US');

        var checkSession = AdInsHelper.CheckSessionTimeout();
        if (checkSession == "1") {
            // this.errorDialogService.openDialog(AdInsErrorMessage.SessionTimeout);
            this.spinner.hide();
            this.router.navigate(["/pages/login"]);
        }

        if (request.url.includes("Add") || request.url.includes("Edit") || request.url.includes("Delete")) {
            var n = request.url.lastIndexOf("/");
            var oldPath = request.url.substring(n + 1);
        } else {
            var oldPath = "-";
        }

        //Ini kalau buat Login belom punya Current User Contexts
        
        if (currentUserContext != null) {
            token = localStorage.getItem(CommonConstant.TOKEN);
            myObj = new Object();
            if (request.body != null) {
                myObj = request.body;
            }
            myObj["RequestDateTime"] = businessDt;
        }
        else {
            myObj = new Object();
            if (request.body != null) {
                myObj = request.body;
            }
            myObj["RequestDateTime"] = businessDt;
            token = localStorage.getItem(CommonConstant.TOKEN);
        }
        
        if(token==null)
        {
            token="";
        }

        if (token != "") {
            request = request.clone({ headers: request.headers.set('Authorization', token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        request = request.clone({ headers: request.headers.set('Authentication', 'my-authentication') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Credentials', 'true') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Methods', 'POST') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization') });
        request = request.clone({ body: myObj });
        AdInsHelper.InsertLog(request.url, "API", request.body);
        console.log(JSON.stringify(request.body));
        // if (request.url.includes("Add") || request.url.includes("Edit") || request.url.includes("Delete")) {
        //     var q = "AddQueue";
        //     var url = request.url;
        //     var n = url.lastIndexOf("/");
        //     var envi = url.substring(0,n+1);
        //     var newUrl = envi.concat(q);

        //     var req = request.clone({url: newUrl});
        // } else {
        //     var req = request;
        // }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //Ini Error kalau sudah masuk sampai ke Back End
                    if (event.body.StatusCode != undefined) {
                      if (event.body.StatusCode != '200' && event.body.StatusCode != "001" && event.body.StatusCode != "002") {
                            
                            if (event.body.StatusCode == '400') {
                                for (var i = 0; i < event.body.ErrorMessages.length; i++) {
                                    this.toastr.error(event.body.ErrorMessages[i].Message, 'Status: ' + event.body.StatusCode, { "tapToDismiss": true });
                                }
                            }else {
                                let data = {};
                                data = {
                                    reason: event.body.Message ? event.body.Message : '',
                                    status: event.body.StatusCode
                                };
                                this.toastr.error(data['reason'], 'Status: ' + data['status'], { "tapToDismiss": true });
                                console.log(event.body);
                            }
                            
                            return;
                        }
                    }
                    else {
                        //Kalau pake Http Get yang bukan ke Backend sendiri g punya token, jadi g boleh asal di replace
                        // if (event.body.token == undefined) {
                        //     localStorage.setItem("Token", localStorage.getItem("Token"));
                        // }
                        // else {
                        //     localStorage.setItem("Token", event.body.token);
                        // }

                    }
                }

                return event;
            }),
            //Ini Error kalau tidak sampai ke Back End
            catchError((error: HttpErrorResponse) => {
                if (error.error != null) {
                    if (error.error.ErrorMessages != null) {
                        for (var i = 0; i < error.error.ErrorMessages.length; i++) {
                            this.toastr.error(error.error.ErrorMessages[i].Message, 'Status: ' + error.status, { "tapToDismiss": true });
                        }
                    } else {
                        this.toastr.error(error.error.Message, 'Status: ' + error.status, { "tapToDismiss": true });
                    }
                }
                else {
                    this.toastr.error(error.message, 'Status: ' + error.status, { "tapToDismiss": true });
                }

                console.log(JSON.stringify(request.body));
                return throwError(error);
            }), finalize(() => {
                if (request.url != "./assets/i18n/en.json") {
                    this.count--;
                }

                if (request.method == "POST") {
                    AdInsHelper.ClearPageAccessLog();
                }
                if (this.count == 0) {
                    this.spinner.hide();
                }
            })
        );
    }
}
