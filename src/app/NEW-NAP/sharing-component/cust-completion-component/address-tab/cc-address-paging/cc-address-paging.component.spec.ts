import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcAddressPagingComponent } from './cc-address-paging.component';

describe('CcAddressPagingComponent', () => {
  let component: CcAddressPagingComponent;
  let fixture: ComponentFixture<CcAddressPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcAddressPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcAddressPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
