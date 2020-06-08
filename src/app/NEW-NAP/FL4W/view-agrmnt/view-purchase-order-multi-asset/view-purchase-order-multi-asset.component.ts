import { Output, EventEmitter, OnInit, Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http"; 
import { AdInsConstant } from "app/shared/AdInstConstant";
 

@Component({
  selector: 'app-view-purchase-order-multi-asset',
  templateUrl: './view-purchase-order-multi-asset.component.html'
})
export class ViewPurchaseOrderMultiAssetComponent implements OnInit {
 
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Input() agrmntId: number = 0;
  inputGridObj: any;
  isView : boolean;
  listPurchaseOrder : any;
  MrCustRelationshipCode: any = new Array();
  constructor(private http: HttpClient ) {
  }

  ngOnInit() {
  this.isView = false;
  
   
  var PurchaseOrderObj = {
    AgrmntId: this.agrmntId
  }
  console.log("awdawd");
  this.http.post(AdInsConstant.GetListPurchaseOrderHByAgrmntId, PurchaseOrderObj).subscribe(
    (response) => { 
      
      this.listPurchaseOrder = response;


    });
  }

  view(){
    this.isView=true;
  }

}
