import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agr-main-info',
  templateUrl: './agr-main-info.component.html',
  styleUrls: ['./agr-main-info.component.scss']
})
export class AgrMainInfoComponent implements OnInit {

  viewObj: string;
  @Input() arrValue = [];
  token : any = localStorage.getItem("Token");
  constructor(
    private router: Router ) { }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfo.json";
  }
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.ViewObj.ProdOfferingCode + "&prodOfferingVersion=" + ev.ViewObj.ProdOfferingVersion + "&Token=" + this.token;
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    }
  }

}