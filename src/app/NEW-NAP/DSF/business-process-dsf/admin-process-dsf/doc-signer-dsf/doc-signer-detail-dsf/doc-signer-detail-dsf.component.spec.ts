import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSignerDetailDsfComponent } from './doc-signer-detail-dsf.component';

describe('DocSignerDetailDsfComponent', () => {
  let component: DocSignerDetailDsfComponent;
  let fixture: ComponentFixture<DocSignerDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSignerDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSignerDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
