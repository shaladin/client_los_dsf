import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-guarantor-FL4W',
  templateUrl: './guarantor-FL4W.component.html',
  styleUrls: []
})
export class GuarantorFL4WComponent implements OnInit {
  @Input() AppId : any;
  @Input() AppGuarantorId : any;
  @Input() MrGuarantorTypeCode : any;
  @Input() showCancel: boolean = true;
  @Input() mode : any;
  @Input() ListCustNoPersonal : any;
  @Input() ListCustNoCompany : any;
  @Output() closeX: EventEmitter<any> = new EventEmitter();
  closeChk : boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute) {
  }

  isReady: boolean = false;
  param : string;
  criteria: CriteriaObj[] = [];
  CustTypeObj: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;

  CustDataForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]]
  });

  MrCustTypeCode:string;
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
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        console.log("Response");
        console.log(response);
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
