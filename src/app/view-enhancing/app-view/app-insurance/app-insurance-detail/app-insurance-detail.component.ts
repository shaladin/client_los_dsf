import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { RequestInsuranceDataObj } from 'app/shared/model/RequestInsuranceDataObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-app-insurance-detail',
  templateUrl: './app-insurance-detail.component.html',
  styles: []
})
export class AppViewInsuranceDetailComponent implements OnInit {
  @Input() AppInsObjId: number;
  appInsObj: AppInsObjObj;
  appInsCvgs: any;
  appInsCvgsFinal: Array<any>;
  public static CUSTOMER: string = CommonConstant.InsuredByCustomer;
  public static COMPANY: string = CommonConstant.InsuredByCompany;
  public static CUSTOMER_COMPANY: string = CommonConstant.InsuredByCustomerCompany;
  public static OFF_SYSTEM: string = CommonConstant.InsuredByOffSystem;
  reqInsuranceDataObj: any;

  constructor(
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    // this.appInsObj = new AppInsObjObj();
    // this.appInsObj.AppInsObjId = this.AppInsObjId
    this.reqInsuranceDataObj = new RequestInsuranceDataObj();
    this.reqInsuranceDataObj.AppInsObjObj.AppInsObjId = this.AppInsObjId;
    this.httpClient.post(URLConstant.GetAppInsObjViewDetail, { Id: this.AppInsObjId }).subscribe(
      (response: any) => {
        this.appInsObj = response.appInsObj;
        this.appInsCvgs = response.appInsCvgs;
        this.appInsCvgsFinal = new Array<any>();

        for (const item of this.appInsCvgs) {
          var addCvg = "";
          for (var i = 0; i < item.appInsAddCvgObjs.length; i++) {
            if (i == (item.appInsAddCvgObjs.length - 1)) {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode;
            }
            else {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode + ", ";
            }
          }
          this.appInsCvgsFinal.push({
            YearNo: item.appInsMainCvgObj.YearNo,
            MrMainCvgTypeCode: item.appInsMainCvgObj.MrMainCvgTypeCode,
            MrAddCvgTypeCode: addCvg,
            CustMainPremiAmt: item.appInsMainCvgObj.CustMainPremiAmt,
            CustAddPremiAmt: item.appInsMainCvgObj.TotalCustAddPremiAmt,
            InscoMainPremiAmt: item.appInsMainCvgObj.InscoMainPremiAmt,
            InscoAddPremiAmt: item.appInsMainCvgObj.TotalInscoAddPremiAmt
          });
        }
      });
  }
}
