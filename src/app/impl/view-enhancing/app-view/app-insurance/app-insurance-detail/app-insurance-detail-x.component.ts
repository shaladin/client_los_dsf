import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { RequestInsuranceDataObj } from 'app/shared/model/request-insurance-data-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { forkJoin } from 'rxjs';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-app-insurance-detail-x',
  templateUrl: './app-insurance-detail-x.component.html',
  // styles: []
})
export class AppViewInsuranceDetailXComponent implements OnInit {
  @Input() AppInsObjId: number;
  appInsObj: AppInsObjObj;
  appInsCvgs: any;
  appInsCvgsFinal: Array<any>;
  public static CUSTOMER: string = CommonConstant.InsuredByCustomer;
  public static COMPANY: string = CommonConstant.InsuredByCompany;
  public static CUSTOMER_COMPANY: string = CommonConstant.InsuredByCustomerCompany;
  public static OFF_SYSTEM: string = CommonConstant.InsuredByOffSystem;
  reqInsuranceDataObj: any;
  appInsAssId: number;
  inputGridObj: InputGridObj = new InputGridObj();
  appAsset: any;
  payName: string = "";

  constructor(
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  async ngOnInit() {
    // this.appInsObj = new AppInsObjObj();
    // this.appInsObj.AppInsObjId = this.AppInsObjId
    this.inputGridObj.pagingJson = "./assets/impl/ucgridview/gridAppInsuranceAssetAccessory.json";
    this.reqInsuranceDataObj = new RequestInsuranceDataObj();
    this.reqInsuranceDataObj.AppInsObjObj.AppInsObjId = this.AppInsObjId;
    await this.httpClient.post(URLConstant.GetAppInsObjViewDetail, { Id: this.AppInsObjId }).toPromise().then(
      (response: any) => {
        this.appInsObj = response.appInsObj;
        this.appInsAssId = this.appInsObj.AppAssetId
        this.appInsCvgs = response.appInsCvgs;
        this.appInsCvgsFinal = new Array<any>();

        for (const item of this.appInsCvgs) {
          var addCvg = "";
          var CustPremi = "";
          var InscoPremi = "";
          for (var i = 0; i < item.appInsAddCvgObjs.length; i++) {
            if (i == (item.appInsAddCvgObjs.length - 1)) {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode;
              CustPremi += (item.appInsAddCvgObjs[i].CustAddPremiRate * 100).toString();
              InscoPremi +=  (item.appInsAddCvgObjs[i].InscoAddPremiRate * 100).toString();
            }
            else {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode + ", ";
              CustPremi += (item.appInsAddCvgObjs[i].CustAddPremiRate * 100).toString() + ", ";
              InscoPremi +=  (item.appInsAddCvgObjs[i].InscoAddPremiRate * 100).toString() + ", ";
            }
          }
          this.appInsCvgsFinal.push({
            YearNo: item.appInsMainCvgObj.YearNo,
            MrMainCvgTypeCode: item.appInsMainCvgObj.MrMainCvgTypeCode,
            MrAddCvgTypeCode: addCvg,
            CustMainPremiAmt: item.appInsMainCvgObj.CustMainPremiAmt,
            CustMainPremiRate: item.appInsMainCvgObj.CustMainPremiRate,
            CustAddPremiAmt: item.appInsMainCvgObj.TotalCustAddPremiAmt,
            CustAddPremiRate: CustPremi,
            InscoMainPremiAmt: item.appInsMainCvgObj.InscoMainPremiAmt,
            InscoMainPremiRate: item.appInsMainCvgObj.InscoMainPremiRate,
            InscoAddPremiAmt: item.appInsMainCvgObj.TotalInscoAddPremiAmt,
            InscoAddPremiRate: InscoPremi,
            PaidBy: item.appInsMainCvgObj.PaidByDescr,
            IsCapitalized: item.appInsMainCvgObj.IsCapitalized
          });
        }
      });
      await this.getAsset();
      await this.getPaymentType();
    }

    async getAsset(){
      let AppAsset = this.httpClient.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { Id: this.appInsAssId });
      forkJoin([AppAsset]).toPromise().then(
        (response: any) => {
          this.appAsset = response[0];
          this.inputGridObj.resultData = {
            Data: ""
          }
          this.inputGridObj.resultData["Data"] = new Array();
          this.inputGridObj.resultData.Data = this.appAsset.ResponseAppAssetAccessoryObjs;
        }
      );
    }

    async getPaymentType(){
      let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
        RefMasterTypeCode: CommonConstantX.RefMasterTypeCodePayPeriodToInsco,
        MasterCode: this.appInsObj.PayPeriodToInsco
      };
      await this.httpClient.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
        (response) => {
          this.payName = response.Value;
        }
      );
    }
}
