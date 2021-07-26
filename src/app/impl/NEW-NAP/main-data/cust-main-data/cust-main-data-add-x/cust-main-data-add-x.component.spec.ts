import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataAddXComponent } from './cust-main-data-add-x.component';

describe('CustMainDataAddXComponent', () => {
  let component: CustMainDataAddXComponent;
  let fixture: ComponentFixture<CustMainDataAddXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataAddXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataAddXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
