import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-mapping-component',
  templateUrl: './user-mapping-component.component.html',
  styleUrls: ['./user-mapping-component.component.css']
})
export class UserMappingComponentComponent implements OnInit {
  num:any;
  tabClick(index: number) {
    this.num=index;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
