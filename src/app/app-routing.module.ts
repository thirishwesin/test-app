import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '',  redirectTo: '/register', pathMatch: 'full'  },
  { path:'register', component: RegisterComponent},
  // { path: 'register/:userId', component: RegisterComponent },
  { path: 'user/:userId', component: UserComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
