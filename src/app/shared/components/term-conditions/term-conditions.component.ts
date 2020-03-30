import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html',
  styleUrls: ['./term-conditions.component.scss']
})
export class TermConditionsComponent implements OnInit {

  @Input() AppId: number;
  TCFormObj: FormArray = this.fb.array([]);

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    var appTcObj = {
      AppId: this.AppId
    }
    this.http.post(AdInsConstant.GetListTCbyAppId, appTcObj).subscribe(
      (response) => {
        console.log(response);  
      },
      (error) => {
        console.log(error);
      }
    );
  }

}