import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Dashboard } from './components/dashboard/dashboard';
import { GradesList } from './components/grades-list/grades-list';
import { AddGrade } from './components/add-grade/add-grade';
import { teacherGuard } from './guards/teacher-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard, canActivate: [teacherGuard]  },
  { path: 'grades', component: GradesList  },
  { path: 'add-grade', component: AddGrade, canActivate: [teacherGuard]  },
  { path: '**', redirectTo: 'login' }
];