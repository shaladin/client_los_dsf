import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-guarantor-main-data',
  templateUrl: './guarantor-main-data.component.html'
})
export class GuarantorMainDataComponent implements OnInit {

  @Input() AppGuarantorId : any;
  @Input() MrGuarantorTypeCode : any;
  @Input() mode : any;
  @Input() AppId : any;
  @Output() closeX: EventEmitter<any> = new EventEmitter();
  closeChk : boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
  }

  param : string;
  key: any;
  criteria: CriteriaObj[] = [];
  CustTypeObj: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;

  CustDataForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]]
  });

  // AppGuarantorId:any;
  MrCustTypeCode:any;
  ngOnInit() {
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
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
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
    this.ClearForm();
  }

}
