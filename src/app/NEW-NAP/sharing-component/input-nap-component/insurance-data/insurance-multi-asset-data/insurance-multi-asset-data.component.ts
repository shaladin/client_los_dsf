import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputInsuranceObj } from 'app/shared/model/input-insurance-obj.model';
import { UcInsuranceComponent } from '../uc-insurance/uc-insurance.component';

@Component({
  selector: 'app-insurance-multi-asset-data',
  templateUrl: './insurance-multi-asset-data.component.html',
  styleUrls: ['./insurance-multi-asset-data.component.css']

})
export class InsuranceMultiAssetDataComponent implements OnInit {
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Input() BLCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @ViewChild(UcInsuranceComponent) ucInsCom : UcInsuranceComponent;
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

  SaveForm(event) {
    if(event.Action == "SaveDetail"){
      let url = URLConstant.EditInsuranceDataMultiAsset;
      if (event.InsuranceData.AppInsObjObj.AppInsObjId == 0) url = URLConstant.AddInsuranceDataMultiAsset;
      this.http.post(url, event.InsuranceData).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.ucInsCom.Cancel();
        });
    }else this.outputTab.emit();
  }
}