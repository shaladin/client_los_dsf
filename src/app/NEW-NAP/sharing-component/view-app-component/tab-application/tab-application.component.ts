import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-tab-application',
  templateUrl: './tab-application.component.html',
  styleUrls: ['./tab-application.component.scss']
})
export class TabApplicationComponent implements OnInit {

  @Input() appId;
  viewProdMainInfoObj;
  constructor( 
    private http: HttpClient
  ) { }

  initData(){
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewTabApplicationInfo.json";
  }

  async ngOnInit() {
    this.initData();
    await this.GetCrossAppData();
  }

  ListCrossAppData
  async GetCrossAppData(){
    var obj={ AppId: this.appId };
    
    await this.http.post(environment.losUrl + AdInsConstant.GetListAppCross, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ListCrossAppData = response[AdInsConstant.ReturnObj];

      }
    );
  }
}
