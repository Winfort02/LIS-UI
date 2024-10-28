import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredItemFormComponent } from './expired-item-form.component';

describe('ExpiredItemFormComponent', () => {
  let component: ExpiredItemFormComponent;
  let fixture: ComponentFixture<ExpiredItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredItemFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpiredItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
