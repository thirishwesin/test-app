import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,from,tap } from "rxjs";
import { User } from './user';
import { map as _map, find as _find} from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  userList: User[] = [];
  constructor() { }
  private userSubject$ = new BehaviorSubject<User[]>(this.userList);

  setUser(user: User): void {
    this.userList.push(user);
    //this.userSubject$.next(this.userList);
  }

  getUser(): Observable<User[]> {
    return this.userSubject$;
  }

  // deleteUser(id:any) {
  //   let index = this.userList.findIndex(user => user.id === id);
  //   this.userList.splice(index, 1);
  //   this.userSubject$.next(this.userList);
  // }

  findById(id: any) {
    var user = _find(this.userList, ['id', id]);
    console.log(user);
    
    return user as User;
  }

  updateUser(user: any){
    this.userList = _map(this.userList, (u: User)=>{
      //console.log('User Update: ',u.id);
      if(u.id == user.id){
        console.log('Update User: ',user.id,user.name)
        
        return user;

      }
     
      return u;
    });
    console.log('User List: ',this.userList)
    this.userSubject$.next(this.userList);
  }


  removeFromList(id:any) {
    return from(this.removeByid(this.userList, id));
  }

  removeByid(users:User[],id:string) {
    let index = this.userList.findIndex(n => n.id === id);
    if (index >= 0) {
      return users.splice(index, 1);
    }
    return [];
  }


}