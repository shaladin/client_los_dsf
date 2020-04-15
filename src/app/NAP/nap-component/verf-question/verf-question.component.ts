import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-verf-question',
  templateUrl: './verf-question.component.html',
  styleUrls: ['./verf-question.component.scss']
})
export class VerfQuestionComponent implements OnInit {

  @Input() ParentForm : FormGroup;
  @Input() VerfShcemeCode : string;

  constructor(
    private http: HttpClient,) { }

  ngOnInit() {
    this.http.post(AdInsConstant.GetVerfQuestionAnswerListBySchemeCode, { VerfSchemeCode : "CF4W_PHONEVERIF"}).subscribe(
      (response)=>{
        
      },
      (error)=>{

      }
    )
  }

  CheckValue(){
    console.log(this.ParentForm)
  }

}
