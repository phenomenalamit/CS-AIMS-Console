import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-user-component',
  templateUrl: './manage-user-component.component.html',
  styleUrls: ['./manage-user-component.component.css']
})
export class ManageUserComponentComponent implements OnInit {
  num:any;
    tabClick(index: number) {
      this.num=index;
    }
  constructor() { }

  ngOnInit(): void {
  }

}
