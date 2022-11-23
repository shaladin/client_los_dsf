import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcInsuranceComponent } from 'app/NEW-NAP/sharing-component/input-nap-component/insurance-data/uc-insurance/uc-insurance.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputInsuranceObj } from 'app/shared/model/input-insurance-obj.model';
import { UcInsuranceXComponent } from '../uc-insurance-x/uc-insurance-x.component';

@Component({
  selector: 'app-insurance-multi-asset-data-x',
  templateUrl: './insurance-multi-asset-data-x.component.html'
})
export class InsuranceMultiAssetDataXComponent implements OnInit {
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Input() BLCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @ViewChild(UcInsuranceXComponent) ucInsCom : UcInsuranceXComponent;
  inputInsuranceObj: InputInsuranceObj = new InputInsuranceObj();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  async ngOnInit() {
    this.inputInsuranceObj.AppId = this.appId;
    this.inputInsuranceObj.IsMultiAsset = true;
    this.inputInsuranceObj.ShowCancel = this.showCancel;
    this.inputInsuranceObj.IsReady = true;
  }

  CancelHandler() {
    this.outputCancel.emit();
  }

  async SaveForm(event) {
    if(event.Action == "SaveDetail"){
      let url = URLConstant.EditInsuranceDataMultiAsset;
      if (event.InsuranceData.AppInsObjObj.AppInsObjId == 0) url = URLConstant.AddInsuranceDataMultiAsset;
      this.http.post(url, event.InsuranceData).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.ucInsCom.Cancel();
        });
    }else 
    {
      var isValid = true;
      await this.http.post(URLConstant.ValidateAppInsObjAmtByAppId, {id : this.appId}).toPromise().then(
        (response) => {
          if (!response || response['StatusCode'] != 200) isValid = false;
        }
      );
      if(!isValid) return;
      this.outputTab.emit();
    }
  }
}
