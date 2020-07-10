import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html',
  styleUrls: ['./app-main-info.component.scss']
})
export class AppMainInfoComponent implements OnInit {

  viewObj: string;
  @Input() arrValue = [];
  token : any = localStorage.getItem("Token");
  AppObj : any;
  constructor(private http: HttpClient,
    private router: Router ) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, {AppId : this.arrValue[0]}).subscribe(
      (response) => {
        console.log(response);
        this.AppObj = response;
        if(this.AppObj.BizTemplateCode == "CF4W"){
          this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
        }else if(this.AppObj.BizTemplateCode == "FL4W"){
          this.viewObj = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
        }else{
          this.viewObj = "./assets/ucviewgeneric/viewAppMainInfo.json";
        }
      }
    );
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion, this.token );  
    }
  }

}
