import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-form-add-dynamic',
  templateUrl: './form-add-dynamic.component.html',
  styleUrls: ['./form-add-dynamic.component.scss'],
  providers: [NGXToastrService]
})
export class FormAddDynamicComponent implements OnInit {

  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() FormInputObj;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService
  ) { }

  FormObj = this.fb.group({
    arr: this.fb.array([])
  });

  arr;
  DDLContentName = new Array();
  DDLBankAccount = new Array();
  ngOnInit() {
    this.arr = this.FormObj.get('arr') as FormArray;
    console.log(this.FormInputObj);
    if(this.FormInputObj["content"] != "Referantor"){
      this.GetDDLContentName();
    }else{
      this.GetDDLBankAccountCond2();
    }
  }

  GetDDLContentName(){

  }

  GetDDLBankAccountCond1(){
    
  }

  GetDDLBankAccountCond2(){
    
  }

  AddNewDataForm(){
    var NewDataForm = this.fb.group({
      ContentName: [''],
      BankAccount: [''],
      TaxAmount: ['', Validators.pattern("^[0-9]+$")],
      TotalCommisionAmount: ['', Validators.pattern("^[0-9]+$")],
      VATAmount: ['', Validators.pattern("^[0-9]+$")],
      AllocateFromUppingRate: ['', Validators.pattern("^[0-9]+$")],
      AllocateFromFeeOrUppingFee: ['', Validators.pattern("^[0-9]+$")],
      AllocateFromInsuranceIncome: ['', Validators.pattern("^[0-9]+$")],
      AllocateFromLifeInsuranceIncome: ['', Validators.pattern("^[0-9]+$")],
      AllocateFromOther: ['', Validators.pattern("^[0-9]+$")]
    }) as FormGroup;
    this.arr.push(NewDataForm);
    console.log(this.FormObj);
  }

  DeleteDataForm(idx){
    // console.log(idx);
    if (confirm('Are you sure to delete this record?')) {
      this.arr.removeAt(idx);
      this.PassData();

    }
  }

  CheckData(){
    console.log(this.FormObj);
  }

  PassData(){
    // console.log("change data");
    this.DataEmit.emit(this.FormObj);
  }

  ChooseContentName(){
    this.GetDDLBankAccountCond1();
    this.PassData();
  }

  ChangeDataLabel(idx){
    console.log(idx);
    var tempUppRate: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromUppingRate.value;
    var tempInsuranceIncome: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromInsuranceIncome.value;
    var tempLifeInsuranceIncome: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromLifeInsuranceIncome.value;
    var tempOther: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromOther.value;
    var tempFeeOrUppFee: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromFeeOrUppingFee.value;
    var tempTotal = tempFeeOrUppFee + tempUppRate + tempInsuranceIncome + tempLifeInsuranceIncome + tempOther;
    
    this.FormObj.controls.arr["controls"][idx].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData();
  }
}
