import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';

@Component({
  selector: 'app-app-insurance-detail',
  templateUrl: './app-insurance-detail.component.html',
  styles: []
})
export class AppInsuranceDetailComponent implements OnInit {
  @Input() AppInsObjId: number;
  appInsObj: AppInsObjObj;
  appInsCvgs: any;
  appInsCvgsFinal: Array<any>;
  public static CUSTOMER: string = "CU";
  public static COMPANY: string = "CO";
  public static CUSTOMER_COMPANY: string = "CUCO";
  public static OFF_SYSTEM: string = "OFF";

  constructor(
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.httpClient.post(AdInsConstant.GetAppInsObjViewDetail, { AppInsObjId: this.AppInsObjId }).subscribe(
      (response: any) => {
        this.appInsObj = response.appInsObj;
        this.appInsCvgs = response.appInsCvgs;
        this.appInsCvgsFinal = new Array<any>();

        for (const item of this.appInsCvgs) {
          var addCvg = "";
          for (var i = 0; i < item.appInsAddCvgObjs.length; i++) {
            if(i == (item.appInsAddCvgObjs.length - 1)){
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode;
            }
            else{
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode + ", ";
            }
          }
          this.appInsCvgsFinal.push({
            YearNo: item.YearNo,
            MrMainCvgTypeCode: item.MrMainCvgTypeCode,
            MrAddCvgTypeCode: addCvg,
            CustMainPremiAmt: item.CustMainPremiAmt,
            CustAddPremiAmt: item.TotalCustAddPremiAmt,
            InscoMainPremiAmt: item.InscoMainPremiAmt,
            InscoAddPremiAmt: item.TotalInscoAddPremiAmt
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
