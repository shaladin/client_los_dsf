import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { GetAppSubsidyByAppIdObj } from 'app/shared/model/GetAppSubsidyByAppIdObj.Model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subsidy',
  templateUrl: './subsidy.component.html',
  styleUrls: ['./subsidy.component.scss']
})
export class SubsidyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder) { 
    this.GetListAppSubsidyByAppIdUrl = AdInsConstant.GetListAppSubsidyByAppId;
  }
  @Input() Mode: any;
  @Input() AppId: any;
  GetListAppSubsidyByAppIdUrl : string;
  getAppSubsidyByAppIdObj : any;
  listAppSubsidy : any;
  tempSubsidyFromTypeObj : any;
  AppSubsidyForm = this.fb.group({
    MrSubsidyFromTypeCode: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    RefFeeId: [0, [Validators.required]],
    FeePrcnt: [0, [Validators.required]],
    FeeAmt: [0, [Validators.required]],
    MrFeeTypeCode: ['', [Validators.required]],
    RowVersion: ['']
  });


  ngOnInit() {
    this.getAppSubsidyByAppIdObj = new GetAppSubsidyByAppIdObj();
    this.getAppSubsidyByAppIdObj.AppId = this.AppId;
    this.http.post(this.GetListAppSubsidyByAppIdUrl, this.getAppSubsidyByAppIdObj).subscribe(
      response => {
        this.listAppSubsidy = response["AppSubsidies"];
        console.log(this.listAppSubsidy);
      });

      var refMasterSubsidyFromTypeObj = { RefMasterTypeCode: "SUBSIDY_FROM_TYPE" };
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterSubsidyFromTypeObj).subscribe(
        (response) => {
          this.tempSubsidyFromTypeObj = response["ReturnObject"];
          console.log(this.tempSubsidyFromTypeObj);
          if(this.tempSubsidyFromTypeObj.length > 0){
            this.AppSubsidyForm.patchValue({
              MrSubsidyFromTypeCode: this.tempSubsidyFromTypeObj[0].Key
            });
          }
        }
      );

      var refMasterSubsidyFromTypeObj = { RefMasterTypeCode: "SUBSIDY_FROM_TYPE" };
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterSubsidyFromTypeObj).subscribe(
        (response) => {
          this.tempSubsidyFromTypeObj = response["ReturnObject"];
          console.log(this.tempSubsidyFromTypeObj);
          if(this.tempSubsidyFromTypeObj.length > 0){
            this.AppSubsidyForm.patchValue({
              MrSubsidyFromTypeCode: this.tempSubsidyFromTypeObj[0].Key
            });
          }
        }
      );


      var refMasterSubsidyFromTypeObj = { RefMasterTypeCode: "SUBSIDY_FROM_TYPE" };
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterSubsidyFromTypeObj).subscribe(
        (response) => {
          this.tempSubsidyFromTypeObj = response["ReturnObject"];
          console.log(this.tempSubsidyFromTypeObj);
          if(this.tempSubsidyFromTypeObj.length > 0){
            this.AppSubsidyForm.patchValue({
              MrSubsidyFromTypeCode: this.tempSubsidyFromTypeObj[0].Key
            });
          }
        }
      );  



  }

}
