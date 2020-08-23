import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarMouPersonalDataComponent } from './similar-mou-personal-data.component';

describe('SimilarMouPersonalDataComponent', () => {
  let component: SimilarMouPersonalDataComponent;
  let fixture: ComponentFixture<SimilarMouPersonalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarMouPersonalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarMouPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
