import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistryFormComponent } from './chemistry-form.component';

describe('ChemistryFormComponent', () => {
  let component: ChemistryFormComponent;
  let fixture: ComponentFixture<ChemistryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemistryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChemistryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
