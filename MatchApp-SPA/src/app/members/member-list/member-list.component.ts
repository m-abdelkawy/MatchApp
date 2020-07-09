import { Pagination, PaginatedResult } from './../../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any={};
  pagination: Pagination;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit() {
    //this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
      //console.log(this.pagination);
    });

    this.initializeDefaultFilters();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
      }, error => {
        this.alertify.error(error);
      });
  }

  initializeDefaultFilters(){
    this.userParams.gender = this.user.gender === 'male'?'female':'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    this.userParams.orderBy = 'lastActive';
  }
  resetFilters(){
    this.initializeDefaultFilters();
    this.loadUsers();
  }

  pageChanged(event) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  filterUsers(){
    // for (let i = 0; i < this.users.length; i++) {
    //   if(this.users[i].age < this.userParams.minAge || this.users[i].age > this.userParams.maxAge){
    //     this.users.splice(this.users.indexOf(this.users[i]), 1);
    //     i--;
    //   }
    // }
    debugger;
    this.loadUsers();
  }

  sort(sortType: string){
    this.userParams.orderBy = sortType;
    debugger;
    this.loadUsers();
  }
}
