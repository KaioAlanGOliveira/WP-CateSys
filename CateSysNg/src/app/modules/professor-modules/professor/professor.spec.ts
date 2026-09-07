import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorForm } from '../professor-form/professor-form';

describe('ProfessorForm', () => {
  let component: ProfessorForm;
  let fixture: ComponentFixture<ProfessorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
