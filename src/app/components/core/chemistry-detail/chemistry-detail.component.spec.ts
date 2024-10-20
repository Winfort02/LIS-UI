import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistryDetailComponent } from './chemistry-detail.component';

describe('ChemistryDetailComponent', () => {
  let component: ChemistryDetailComponent;
  let fixture: ComponentFixture<ChemistryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemistryDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChemistryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
