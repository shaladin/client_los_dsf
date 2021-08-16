import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
    selector: 'factoring-review-detail.component',
    templateUrl: './factoring-review-detail.component.html',
    styleUrls: [],
    providers: [NGXToastrService]
})
export class FactoringReviewDetailComponent implements OnInit {

    readonly CancelLink: string = NavigationConstant.CESSIE_FACTORING_REVIEW_PAGING;
    CessieHXId: number;
    inputGridObj: InputGridObj;
    disburseTos: any;
    BankAccs: any;
    CustNo: string;
    CustId: number;
    selectedBankCode: any;
    IsGridReady: boolean = false;
    WfTaskListId: number;
    InputLookupBankObj: InputLookupObj = new InputLookupObj();
    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
        private httpClient: HttpClient, private toastr: NGXToastrService, private spinner: NgxSpinnerService, private cookieService: CookieService) {
        this.route.queryParams.subscribe(params => {
            if (params["CessieHXId"] != null) this.CessieHXId = params["CessieHXId"];
            if (params["CustNo"] != null) this.CustNo = params["CustNo"];
            if (params["CustId"] != null) this.CustId = params["CustId"];
            if (params["WfTaskListId"] != null) this.WfTaskListId = params["WfTaskListId"];
        });
    }

    InvoiceForm = this.fb.group({
        AppFctrId: [''],
        CustomerFactoringNo: [''],
        CustomerFactoringName: [''],
        InvoiceNo: [''],
        InvoiceAmt: [''],
        InvoiceDueDt: [''],
        Notes: [''],
        RowVersion: [''],
        AccNo: ['', Validators.required],
        BankBranch: ['', Validators.required],
        AccName: ['', Validators.required],
        DisburseTo: [''],
        CustName: [''],
        BankAccountNo: ['']
    })

    ngOnInit() {
        this.inputGridObj = new InputGridObj();
        this.inputGridObj.pagingJson = "./assets/ucgridview/gridCessieListApp.json";

        this.InputLookupBankObj = new InputLookupObj();
        this.InputLookupBankObj.isReady = false;
        this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
        this.InputLookupBankObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
        this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url;
        this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
        this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";
        this.InputLookupBankObj.isRequired = true;

        var CessieObj = {
            Id: this.CessieHXId
        }

        this.httpClient.post(URLConstantX.GetListAppForView, CessieObj).subscribe(
            (response) => {
                this.inputGridObj.resultData = {
                    Data: ""
                }
                this.inputGridObj.resultData["Data"] = new Array();
                this.inputGridObj.resultData.Data = response["ReturnObject"]
                this.IsGridReady = true;
            });

        this.getListCustBankAcc();
    }

    getListCustBankAcc() {
        var CustObj = {
            CustNo: this.CustNo
        }
        this.httpClient.post(URLConstant.GetListCustBankAccByCustNo, CustObj).subscribe(
            (response) => {
                this.BankAccs = response["ReturnObject"];
                this.InvoiceForm.patchValue({
                    BankAccountNo: this.BankAccs[0].key
                });
            }
        )
    }

    ChangeBankAcc(event) {
        console.log("event" + event.target.value);
        if (event.target.value != '') {
            var objCust = {
                CustNo: this.CustNo
            }
            // this.httpClient.post(URLConstant.GetCustByCustNo, objCust).subscribe(
            //     (responseCustObj) => {
            //         var object = {
            //             BankAccNo: event.target.value,
            //             CustId: responseCustObj["CustId"]
            //         }

            //     }
            // )
            var object = {
                BankAccNo: event.target.value,
                CustId: this.CustId
            }
            this.httpClient.post(URLConstant.GetCustBankAccByCustIdAndBankAccNo, object).subscribe(
                (response) => {
                    var objBank = {
                        Code: response["ReturnObject"].BankCode
                    }
                    this.InvoiceForm.patchValue({
                        BankBranch: response["ReturnObject"].BankBranch,
                        AccNo: event.target.value,
                        AccName: response["ReturnObject"].BankAccName
                    });

                    this.httpClient.post(URLConstant.GetRefBankByBankCodeAsync, objBank).subscribe(
                        (responseBank) => {
                            this.selectedBankCode = responseBank["BankCode"];
                            this.InputLookupBankObj.nameSelect = responseBank["BankName"];
                            this.InputLookupBankObj.jsonSelect = {
                                BankCode: responseBank["BankCode"],
                                BankName: responseBank["BankName"]
                            }
                        }
                    )
                }
            )
        }
    }

    GetBank(event) {
        this.selectedBankCode = event.BankCode;
    }

    SaveForm(enjiForm: NgForm) {
        console.log("saveform");
        var ObjDisbInfo = {
            BankCode: this.selectedBankCode,
            AccName: this.InvoiceForm.controls.AccName.value,
            AccNo: this.InvoiceForm.controls.AccNo.value,
            BankBranch: this.InvoiceForm.controls.BankBranch.value,
            CessieHXId: this.CessieHXId,
            WfTaskListId: this.WfTaskListId
        }
        this.httpClient.post(URLConstantX.SubmitReview, ObjDisbInfo).subscribe(
            (response) => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_FACTORING_REVIEW_PAGING], {});
            });
    }
}
