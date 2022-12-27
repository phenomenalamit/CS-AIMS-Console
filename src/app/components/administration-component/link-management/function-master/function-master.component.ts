import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-function-master',
  templateUrl: './function-master.component.html',
  styleUrls: ['./function-master.component.css']
})
export class FunctionMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  num: any;
  funds:any;
  tabClick(index: number) {
    this.num = index;
  }
}
