import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInquiryComponent } from './asset-inquiry.component';

describe('AssetInquiryComponent', () => {
  let component: AssetInquiryComponent;
  let fixture: ComponentFixture<AssetInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
