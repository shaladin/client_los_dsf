import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-accessories',
  templateUrl: './lookup-accessories.component.html',
  styleUrls: ['./lookup-accessories.component.scss']
})
export class LookupAccessoriesComponent implements OnInit {
  @Input() lookupInput: any;
  @Input() parentForm: any;
  @Input() jsonSelect : any;
  @Input() nameSelect: any = "Search ...";
  @Input() idSelect : any;
  @ViewChild('content') contentTemplate;
  resultData: any;
  closeResult: string;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  doNothing()
  {

  }

  searchClick()
  {
    this.resultData = [{
      accName : "Accessory 1",
      accCode : "Acc1"
    },{
      accName : "Accessory 2",
      accCode : "Acc2"
    },{
      accName : "Accessory 3",
      accCode : "Acc3"
    },{
      accName : "Accessory 4",
      accCode : "Acc4"
    }];
  }

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
    this.resultData = [];
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
