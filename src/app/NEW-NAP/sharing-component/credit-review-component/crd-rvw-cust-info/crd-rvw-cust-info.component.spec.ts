import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwCustInfoComponent } from './crd-rvw-cust-info.component';

describe('CrdRvwCustInfoComponent', () => {
  let component: CrdRvwCustInfoComponent;
  let fixture: ComponentFixture<CrdRvwCustInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwCustInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwCustInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
