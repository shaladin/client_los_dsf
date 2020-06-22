import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-guarantor-FL4W',
  templateUrl: './guarantor-FL4W.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class GuarantorFL4WComponent implements OnInit {
  @Input() AppId : any;
  @Input() AppGuarantorId : any;
  @Input() MrGuarantorTypeCode : any;
  @Input() showCancel: boolean = true;
  @Input() mode : any;
  @Output() closeX: EventEmitter<any> = new EventEmitter();
  closeChk : boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
  }

  isReady: boolean = false;
  param : string;
  key: any;
  criteria: CriteriaObj[] = [];
  CustTypeObj: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;

  CustDataForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]]
  });

  // AppGuarantorId:any;
  MrCustTypeCode:any;
  ngOnInit() {
    console.log(this.isReady);
    if(this.AppGuarantorId != null){
      this.mode = "edit";
      this.MrCustTypeCode = this.MrGuarantorTypeCode.toUpperCase();
      this.bindCustTypeObj(this.MrCustTypeCode);
      this.CustDataForm.controls.MrCustTypeCode.disable();
    }else{
      this.mode="add";
      this.bindCustTypeObj();
      this.ClearForm();
    }
  }

  bindCustTypeObj(MrCustTypeCode? : string) {
    this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        console.log("Response");
        console.log(response);
        this.CustTypeObj = response["ReturnObject"];
        if (this.CustTypeObj.length > 0) {
          if(MrCustTypeCode == undefined){
            this.CustDataForm.patchValue({
              MrCustTypeCode: this.CustTypeObj[0].Key
            });
          }
          else{
            this.CustDataForm.patchValue({
              MrCustTypeCode: MrCustTypeCode
            });
          }
        }
        this.isReady = true;
      }
    );
  }
  ClearForm() {
    this.CustDataForm = this.fb.group({
      MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  close(event){
    this.closeChk = event;
    this.closeX.emit(this.closeChk);
  }

}
