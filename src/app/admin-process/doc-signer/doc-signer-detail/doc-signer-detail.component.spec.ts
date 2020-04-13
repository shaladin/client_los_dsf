import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSignerDetailComponent } from './doc-signer-detail.component';

describe('DocSignerDetailComponent', () => {
  let component: DocSignerDetailComponent;
  let fixture: ComponentFixture<DocSignerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSignerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSignerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
