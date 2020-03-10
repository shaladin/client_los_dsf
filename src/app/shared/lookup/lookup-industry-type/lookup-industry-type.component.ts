import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-industry-type',
  templateUrl: './lookup-industry-type.component.html',
  styleUrls: ['./lookup-industry-type.component.scss']
})
export class LookupIndustryTypeComponent implements OnInit {
  @Input() lookupInput: any;
  nameSelect : any;
  idSelect : any;
  jsonSelect : any;
  resultData : any;
  closeResult : any;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }
  doNothing()
  {}

  choose(id, name, item) {
    console.log(id + " : " + name);
    console.log(item);
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
  }

  searchClick()
  {
    this.resultData = [{
      economicSectorCode : "001",
      economicSectorName : "Agrobisnis",
      industryTypeCode : "1111",
      industryTypeName : "Pertanian Padi"
    },{
      professionName : "001",
      professionCode : "Agrobisnis",
      industryTypeCode : "1115",
      industryTypeName : "Pertanian Kacang-kacangan"
    },{
      professionName : "002",
      professionCode : "Infrastrtuktur",
      industryTypeCode : "5110",
      industryTypeName : "Konstruksi Rumah SederhanaBank Tabungan Negara"
    },{
      professionName : "002",
      professionCode : "Infrastrtuktur",
      industryTypeCode : "5190",
      industryTypeName : "Konstruksi Rumah SederhanaLainnya"
    }];
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
