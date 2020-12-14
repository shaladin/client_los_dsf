import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-credit-review-cr-detail',
  templateUrl: './credit-review-cr-detail.component.html',
  styleUrls: ['./credit-review-cr-detail.component.scss']
})
export class CreditReviewCrDetailComponent implements OnInit {

  AutoDeviationData: Array<any> = new Array();
  IsEditManualDeviation: boolean = true;
  DDLDeviationCriteriaData: Array<any> = new Array();
  ManualDeviationData: Array<any> = new Array();

  FormObjManualDeviationData = this.fb.group({
    DeviationCrit: [''],
    ApvAt: [''],
    Notes: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) { }
  
  ngOnInit() {
  }

  sortAutoDeviationData(){}
  
  AddNewForm(){}

  onChange(){}

  sortManualDeviationData(){}

  DeleteFromManualDeviationData(){}
}
