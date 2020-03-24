import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
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
  }

  AddNewDataForm(){
    var NewDataForm = this.fb.group({
      ContentName: [''],
      BankAccount: [''],
      TaxAmount: [''],
      TotalCommisionAmount: [''],
      VATAmount: [''],
      AllocateFromUppingRate: [''],
      AllocateFromFeeOrUppingFee: [''],
      AllocateFromInsuranceIncome: [''],
      AllocateFromLifeInsuranceIncome: [''],
      AllocateFromOther: ['']
    }) as FormGroup;
    this.arr.push(NewDataForm);
  }

  DeleteDataForm(idx){
    // console.log(idx);
    if (confirm('Are you sure to delete this record?')) {
      this.arr.removeAt(idx);
    }
  }

  CheckData(){
    console.log(this.FormObj);
  }

  PassData(){
    console.log("change data");
  }
}
