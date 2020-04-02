import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cust-confirmation-subj-detail',
  templateUrl: './cust-confirmation-subj-detail.component.html',
  styleUrls: ['./cust-confirmation-subj-detail.component.scss']
})
export class CustConfirmationSubjDetailComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
