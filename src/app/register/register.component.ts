import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { initUser, User } from '../user';
import { cloneDeep, findIndex } from "lodash";
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm!: FormGroup;
  currentUsers: User[] = [];
  formSubmitted: boolean = false;

  user:User = cloneDeep(initUser);

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router, private service: RegisterService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
  
      console.log(params['userId']);
      
  if(params['userId'] && params['userId'] != 0){ 
    this.user = this.service.findById(params['userId']);
  }
    });
      
    this.service.getUser().subscribe(data => this.currentUsers = data);
    console.log('Registered User: ', this.currentUsers);

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("[A-Z].*$"), this.duplicateTeamNameValidator()]],
      phno: ['', [Validators.required, Validators.pattern("[0-9]+$"), Validators.minLength(7), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      nrc: ['', [Validators.required]]

    })

  }

  markFormTouched(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      control.markAsTouched();
      control.markAsPristine();
    })
  }

  markFormUntouched(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      control.markAsUntouched();
    })
  }

  register() {
    this.formSubmitted = true;
    this.markFormTouched(this.userForm);

    if (this.userForm.invalid) return;
    if(this.user.id == '0'){
      this.user.id = (this.currentUsers.length + 1).toString();
      this.service.setUser(this.user);
    }
    // }else{
    //   this.service.updateUser(this.user);
    // }
   
    this.markFormUntouched(this.userForm);
    this.router.navigate(['/user']);
  }

  duplicateTeamNameValidator(): ValidatorFn {
    console.log("duplicateTeamNameValidator")
    return (control: AbstractControl): ValidationErrors | null => {
      const idx = findIndex(this.currentUsers, user => user.name.trim() === control.value.trim() && this.user.id === '0');
      if (this.currentUsers.length > 0 && idx !== -1) {
        return { duplicateTeamName: true };
      } else return null;
    }
  }
}