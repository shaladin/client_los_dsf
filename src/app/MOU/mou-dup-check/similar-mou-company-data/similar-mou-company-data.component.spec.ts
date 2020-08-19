import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarMouCompanyDataComponent } from './similar-mou-company-data.component';

describe('SimilarMouCompanyDataComponent', () => {
  let component: SimilarMouCompanyDataComponent;
  let fixture: ComponentFixture<SimilarMouCompanyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarMouCompanyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarMouCompanyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
