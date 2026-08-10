import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteAluno } from './componente-aluno';

describe('ComponenteAluno', () => {
  let component: ComponenteAluno;
  let fixture: ComponentFixture<ComponenteAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
