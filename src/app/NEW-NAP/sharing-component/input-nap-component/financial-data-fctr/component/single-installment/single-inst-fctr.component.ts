import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';
import { CalcSingleInstObj } from 'app/shared/model/AppFinData/CalcSingleInstObj.Model';

@Component({
  selector: 'app-single-inst-fctr',
  templateUrl: './single-inst-fctr.component.html',
})
export class SingleInstFctrComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  InterestTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcSingleInstObj: CalcSingleInstObj = new CalcSingleInstObj();
  listInstallment: any;
  responseCalc: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLInterestType();
  }

  LoadDDLInterestType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "INTEREST_INPUT_TYPE" }).subscribe(
      (response) => {
        this.InterestTypeOptions = response["ReturnObject"];
        if(this.InterestTypeOptions != undefined && this.InterestTypeOptions != null){
          this.ParentForm.patchValue({
            InterestType: this.InterestTypeOptions[0].Key
          });
        }
      }
    );
  }

  Calculate() {
    this.calcSingleInstObj = this.ParentForm.value;
    this.calcSingleInstObj.TopBased = "EFF_DT";
    this.http.post<ResponseCalculateObj>(AdInsConstant.CalculateSingleInst, this.calcSingleInstObj).subscribe(
      (response) => {
        console.log(response);

        this.SetNeedReCalculate(false);
      }
    );
  }

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  EstEffDtFocusOut(event){
    var topBased = this.ParentForm.get("TopBased").value;
    var maturityDate: Date;
    if(topBased == AdInsConstant.InvcDt){
      maturityDate = new Date(this.ParentForm.get("InvcDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
    }

    if(topBased == AdInsConstant.EffDt){
      maturityDate = new Date(this.ParentForm.get("EstEffDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
    }
  
    this.ParentForm.patchValue({
      MaturityDate: maturityDate
    });
  }
}
