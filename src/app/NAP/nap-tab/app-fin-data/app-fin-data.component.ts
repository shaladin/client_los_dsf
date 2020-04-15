import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-app-fin-data',
  templateUrl: './app-fin-data.component.html',
})
export class AppFinDataComponent implements OnInit {

  FinDataForm : FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.FinDataForm = this.fb.group(
      {
        TotalFeeAmt : [0],
        TotalFeeCapitalizeAmt : [0],
        AppFee : this.fb.array([])
      }
    );
  }

  test()
  {
    console.log(this.FinDataForm)
    console.log(this.FinDataForm.value);
  }
}
