import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  num:any;
  tabClick(index: number) {
    this.num=index;
  }
}
