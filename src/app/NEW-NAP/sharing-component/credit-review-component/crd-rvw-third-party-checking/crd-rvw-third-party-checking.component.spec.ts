import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwThirdPartyCheckingComponent } from './crd-rvw-third-party-checking.component';

describe('CrdRvwThirdPartyCheckingComponent', () => {
  let component: CrdRvwThirdPartyCheckingComponent;
  let fixture: ComponentFixture<CrdRvwThirdPartyCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwThirdPartyCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwThirdPartyCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
