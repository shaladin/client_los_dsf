import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwDealerInfoComponent } from './crd-rvw-dealer-info.component';

describe('CrdRvwDealerInfoComponent', () => {
  let component: CrdRvwDealerInfoComponent;
  let fixture: ComponentFixture<CrdRvwDealerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwDealerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwDealerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
