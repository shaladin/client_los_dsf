import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwCustPersonalInfoComponent } from './crd-rvw-cust-personal-info.component';

describe('CrdRvwCustPersonalInfoComponent', () => {
  let component: CrdRvwCustPersonalInfoComponent;
  let fixture: ComponentFixture<CrdRvwCustPersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwCustPersonalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwCustPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
