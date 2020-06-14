import { Injectable } from "@angular/core";
import { User } from "../_models/user";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../_services/auth.service";

// to resolve the user data before the route is activated and 
//before the html is loaded in the member detail component
//previously we used the elvis operator

@Injectable()
export class MemberEditResolver implements Resolve<User>{

    constructor(private userService: UserService,
                private router: Router,
                private alertify: AlertifyService,
                private authService: AuthService){}


    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        //this automatically subscribes to the method.
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error=>{
                this.alertify.error('Problem retreiving your data!');
                this.router.navigate(['/members']);
                return of(null); //return observable of null
            })
        );
    }

}