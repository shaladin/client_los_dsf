import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-bpkb-city',
  templateUrl: './lookup-bpkb-city.component.html',
  styleUrls: ['./lookup-bpkb-city.component.scss']
})
export class LookupBpkbCityComponent implements OnInit {
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
      cityName : "City 1",
      cityCode : "1"
    },{
      cityName : "City 2",
      cityCode : "2"
    },{
      cityName : "City 3",
      cityCode : "3"
    },{
      cityName : "City 4",
      cityCode : "4"
    }];
  }

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.lookupInput.nameSelect = name;
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
