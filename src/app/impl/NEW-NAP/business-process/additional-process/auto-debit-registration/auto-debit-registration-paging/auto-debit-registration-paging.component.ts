import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AutoDebitRegistrationObj } from 'app/impl/shared/model/auto-debit-registration/AutoDebitRegistrationObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import * as $ from 'jquery';


var trxNo: string;
@Component({
  selector: 'app-auto-debit-registration-paging',
  templateUrl: './auto-debit-registration-paging.component.html'
})
export class AutoDebitRegistrationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  isJqueryWork: string
  bankBCA: string;

  constructor(
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private http: HttpClient,
    private adInsHelperService: AdInsHelperService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }

  async ngOnInit() {
    this.inputPagingObj._url = './assets/impl/ucpaging/searchAutoDebitRegistration.json';
    this.inputPagingObj.pagingJson = './assets/impl/ucpaging/searchAutoDebitRegistration.json';

    let WVBizTemplateCodeObj = new WhereValueObj();
    WVBizTemplateCodeObj.value = this.bizTemplateCode;

    this.inputPagingObj.whereValue.push(WVBizTemplateCodeObj);

    await this.bindAllBankCode();
  }

  async bindAllBankCode() {
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstantX.GsCodeAutoDebitBca }).toPromise().then(
      (result: GeneralSettingObj) => {
        if (result.GsValue) {
          this.bankBCA = result.GsValue;
        }
      }
    );
  }

  GetCallBack(e: any) {
    if (e.Key == "Request") {
      if (confirm("Are You Sure You Want To Process This Data ?")) {
        let obj =
        {
          TransactionNo: e.RowObj.TransactionNo,
          RowVersion: e.RowObj.RowVersion
        }
        trxNo = e.RowObj.TransactionNo;
        //get auto debit regis berdasarkan trxno
        this.http.post(URLConstantX.GetAutoDebitRegistrationByNo, { TrxNo: e.RowObj.TransactionNo }).subscribe(
          (response: AutoDebitRegistrationObj) => {
            let adr: AutoDebitRegistrationObj = response;

            //if(bank bca)
            if (adr.BankCode == this.bankBCA) {
              //get log bca
              this.http.post(URLConstantX.GetListStgAutoDebitRegisLog, { TrxNo: e.RowObj.TransactionNo }).subscribe(
                (response1) => {
                  //if (currDt < expDt)
                  if (new Date() > new Date(response1["ExpiredDt"]) && response1["RequestId"] != null) {
                    //window.open
                    window.open("https://pare.u-appspecto.com/id/skpr/registration?req-id=" + response1["RequestId"] + "&verification=" + response1["Verification"]);
                    $(document).ready(function () {
                      window.addEventListener("message", receiveMessage, false)
                    })
                  }
                  //else
                  else {
                    //proses ulang
                    this.http.post(URLConstantX.ProcessAutoDebitRegistration, obj).subscribe(
                      (response2) => {
                        if (response2["StatusCode"] != 200) {
                          throw this.toastr.errorMessage(response2["Message"]);
                        }
                        else {
                          this.http.post(URLConstantX.GetListStgAutoDebitRegisLog, { TrxNo: e.RowObj.TransactionNo }).subscribe(
                            (response3) => {
                              window.open("https://pare.u-appspecto.com/id/skpr/registration?req-id=" + response3["RequestId"] + "&verification=" + response3["Verification"]);
                              $(document).ready(function () {
                                window.addEventListener("message", receiveMessage, false)
                              })
                            }
                          )
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
    else if (e.Key == "Customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: e.RowObj.CustNo }).subscribe(
        response => {
          if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if (response["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

}

function receiveMessage(event) {
  let xhr = new XMLHttpRequest();
  try {
    if (event.data === 'Success') {
      xhr.open("POST", URLConstantX.ChangeAutoDebitRegisStat);

      let obj = {
        TrxNo: trxNo,
        Stat: CommonConstantX.AUTO_DEBIT_STATUS_INPAUTH
      };

      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = () => {
        if (xhr.status === 200) {
          window.location.reload();
        }
      };

      xhr.send(JSON.stringify(obj));
    }
    else {
      xhr.open("POST", URLConstantX.ChangeAutoDebitRegisStat);

      let obj = {
        TrxNo: trxNo,
        Stat: CommonConstantX.AUTO_DEBIT_STATUS_FLD
      };

      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = () => {
        if (xhr.status === 200) {
          window.location.reload();
        }
      };

      xhr.send(JSON.stringify(obj));
    }
  } catch (e) {
    console.log(e);
  }
}