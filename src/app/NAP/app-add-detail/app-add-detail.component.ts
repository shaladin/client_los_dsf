import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-app-add-detail',
  templateUrl: './app-add-detail.component.html',
  styleUrls: ['./app-add-detail.component.scss'],
  providers: [NGXToastrService]
})
export class AppAddDetailComponent implements OnInit {

  param;
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private toastr: NGXToastrService) { 
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.param = params["AppId"];
      }
    });
  }

  viewProdMainInfoObj;
  ngOnInit() {
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
  }

}
