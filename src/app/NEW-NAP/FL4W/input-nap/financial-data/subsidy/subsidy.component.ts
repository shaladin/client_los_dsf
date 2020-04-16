import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { GetAppSubsidyByAppIdObj } from 'app/shared/model/GetAppSubsidyByAppIdObj.Model';
import { FormBuilder, Validators } from '@angular/forms';
import { VendorObj } from 'app/shared/model/Vendor.Model';

@Component({
  selector: 'app-subsidy',
  templateUrl: './subsidy.component.html' 
})
export class SubsidyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder) { 
    this.GetListAppSubsidyByAppIdUrl = AdInsConstant.GetListAppSubsidyByAppId;
    this.GetVendorByVendorCodeUrl = AdInsConstant.GetVendorByVendorCode;
  }
  @Input() Mode: any;
  @Input() AppId: any;
  GetListAppSubsidyByAppIdUrl : string;
  GetVendorByVendorCodeUrl : string;
  getAppSubsidyByAppIdObj : any;
  vendorObj : any;
  listAppSubsidy : any;
  tempSubsidyFromTypeObj : any;
  tempMrSubsidyAllocCode : any;
  tempMrSubsidySourceCode : any;
  tempMrSubsidyValueTypeCode : any;
  AppSubsidyForm = this.fb.group({
    MrSubsidyFromTypeCode: [0, [Validators.required]],
    MrSubsidyAllocCode: [0, [Validators.required]],
    MrSubsidySourceCode: [0, [Validators.required]],
    MrSubsidyValueTypeCode: [0, [Validators.required]], 
    SubsidyAmt :[0, [Validators.required]]
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

      var refMasterSubsidyAllocObj = { RefMasterTypeCode: "SUBSIDY_ALLOC" };
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterSubsidyAllocObj).subscribe(
        (response) => {
          this.tempMrSubsidyAllocCode = response["ReturnObject"];
          console.log(this.tempMrSubsidyAllocCode);
          if(this.tempMrSubsidyAllocCode.length > 0){
            this.AppSubsidyForm.patchValue({
              MrSubsidyAllocCode: this.tempMrSubsidyAllocCode[0].Key
            });
          }
        }
      );  

      var refMasterSubsidySourceObj = { RefMasterTypeCode: "SUBSIDY_SOURCE" };
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterSubsidySourceObj).subscribe(
        (response) => {
          this.tempMrSubsidySourceCode = response["ReturnObject"];
          console.log(this.tempMrSubsidySourceCode);
          if(this.tempMrSubsidySourceCode.length > 0){
            this.AppSubsidyForm.patchValue({
              MrSubsidySourceCode: this.tempMrSubsidySourceCode[0].Key
            });
          }
        }
      ); 
 
      var refMasterSubsidyValueTypeObj = { RefMasterTypeCode: "SUBSIDY_VALUE_TYPE" };
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterSubsidyValueTypeObj).subscribe(
        (response) => {
          this.tempMrSubsidyValueTypeCode = response["ReturnObject"];
         
          if(this.tempMrSubsidyValueTypeCode.length > 0){
            this.AppSubsidyForm.patchValue({
              MrSubsidyValueTypeCode: this.tempMrSubsidyValueTypeCode[0].Key
            });
          }
        }
      ); 

  }

}
