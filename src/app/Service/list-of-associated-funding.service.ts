import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListOfAssociatedFunding } from '../Service-Class/list-of-associated-funding';

@Injectable({
  providedIn: 'root'
})
export class ListOfAssociatedFundingService {

  constructor(private httpClient:HttpClient) { }

  getListOfAssociatedFunding():Observable<ListOfAssociatedFunding[]>{
    return this.httpClient.get<ListOfAssociatedFunding[]>(`${environment.listOfAssociatedFundingURL}`);
  }
}
