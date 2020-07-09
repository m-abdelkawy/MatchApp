import { Injectable } from "@angular/core";
import { User } from "../_models/user";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

// to resolve the user data before the route is activated and 
//before the html is loaded in the member detail component
//previously we used the elvis operator

@Injectable()
export class MemberListResolver implements Resolve<User[]>{

    // pageNumber = 1;
    // pageSize = 3;

    constructor(private userService: UserService,
                private router: Router,
                private alertify: AlertifyService){}


    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        //this automatically subscribes to the method.
        return this.userService.getUsers(/*this.pageNumber, this.pageSize*/).pipe(
            catchError(error=>{
                this.alertify.error('Problem retreiving data!');
                this.router.navigate(['/home']);
                return of(null); //return observable of null
            })
        );
    }

}