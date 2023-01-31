import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { RequestInsuranceDataObj } from 'app/shared/model/request-insurance-data-obj.model';
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
          var CustPremi = "";
          var InscoPremi = "";
          for (var i = 0; i < item.appInsAddCvgObjs.length; i++) {
            if (i == (item.appInsAddCvgObjs.length - 1)) {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode;
              CustPremi += (item.appInsAddCvgObjs[i].CustAddPremiRate).toFixed(3);
              InscoPremi +=  (item.appInsAddCvgObjs[i].InscoAddPremiRate).toFixed(3);
            }
            else {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode + ", ";
              CustPremi += (item.appInsAddCvgObjs[i].CustAddPremiRate).toFixed(3) + ", ";
              InscoPremi +=  (item.appInsAddCvgObjs[i].InscoAddPremiRate).toFixed(3) + ", ";
            }
          }
          var tempCustMainPremiRate: string = ""; 
          tempCustMainPremiRate += parseFloat(item.appInsMainCvgObj.CustMainPremiRate).toFixed(3);
          var tempInscoMainPremiRate: string = "";
          tempInscoMainPremiRate += parseFloat(item.appInsMainCvgObj.InscoMainPremiRate).toFixed(3);
          this.appInsCvgsFinal.push({
            YearNo: item.appInsMainCvgObj.YearNo,
            MrMainCvgTypeCode: item.appInsMainCvgObj.MrMainCvgTypeCode,
            MrAddCvgTypeCode: addCvg,
            CustMainPremiAmt: item.appInsMainCvgObj.CustMainPremiAmt,
            CustMainPremiRate: tempCustMainPremiRate,
            CustAddPremiAmt: item.appInsMainCvgObj.TotalCustAddPremiAmt,
            CustAddPremiRate: CustPremi,
            InscoMainPremiAmt: item.appInsMainCvgObj.InscoMainPremiAmt,
            InscoMainPremiRate: tempInscoMainPremiRate,
            InscoAddPremiAmt: item.appInsMainCvgObj.TotalInscoAddPremiAmt,
            InscoAddPremiRate: InscoPremi,
            PaidBy: item.appInsMainCvgObj.PaidByDescr,
            IsCapitalized: item.appInsMainCvgObj.IsCapitalized
          });
        }
      });
  }
}
