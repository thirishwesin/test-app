import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal,ModalDismissReasons, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { cloneDeep, findIndex } from 'lodash';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { initUser, User } from '../user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  closeResult = '';
  formSubmitted:boolean= false;
  id:any;
  userList: User[] = [];
  editdata: any;
  editForm!: FormGroup;
  user: User = cloneDeep(initUser);
  constructor(private fb: FormBuilder,private route: ActivatedRoute,public service:RegisterService, private router : Router,private modalService: NgbModal) { 

  }


  ngOnInit(): void {

    // this.route.params.subscribe(params => {
    // console.log(params['userId']);
      
    // if(params['userId'] && params['userId'] != 0){ 
    //   this.user = this.service.findById(params['userId']);
    // }
    //   });
    this.id= this.route.snapshot.params['userId'];
    this.user = this.service.findById(this.id);

    
    this.service.getUser().subscribe((userList: User[]) => {
    this.userList = userList;
    });
    
    this.editForm = this.fb.group({

      name: [''],
      phno: [''],
      email: [''],
      nrc: ['']
    })
 
  }
  
  updateuser() {
    this.formSubmitted = true;
    this.user.name = this.editForm.value.name;
    this.user.email = this.editForm.value.email;
    this.user.phno = this.editForm.value.phno;
    this.user.nrc = this.editForm.value.nrc;
    if (this.editForm.invalid) return;
    if(this.user.id != '0') { 
      this.service.updateUser(this.user);
      console.log('Update user Id: ',this.user.id);
    }
    
  }

  openDelete(content:any, id:any) {  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  

      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deleteUser(id);
      } 
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }  


  openEdit(targetModal:any, user: User) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    }).result.then((result) => {  

      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.updateuser();
      } 
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });
    this.user=user;
    this.editForm.patchValue( {
      name: this.user.name, 
      phno: this.user.phno,
      email: this.user.email,
      nrc: this.user.nrc
    });
    
    //this.router.navigate(['user', user.id]);
  }

  
  private getDismissReason(reason: any): string { 
    if (reason === ModalDismissReasons.ESC) {  
      return 'by pressing ESC';  
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {  
      return 'by clicking on a backdrop';  
    } else {  
      return `with: ${reason}`;  
    }  
  }  

  deleteUser(id:any){
    this.service.removeFromList(id as string)
      .subscribe(
        () => this.router.navigate(['/user'])
      );
  }

}