import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-outstanding-tc-detail',
  templateUrl: './outstanding-tc-detail.component.html',
  styleUrls: ['./outstanding-tc-detail.component.scss'],
  providers: [NGXToastrService]
})
export class OutstandingTcDetailComponent implements OnInit {
  viewObj: string;
  AppId: number;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });
   }

   OustandingTCForm = this.fb.group({
    
  });

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewOutstandingTC.json";
  }

}
