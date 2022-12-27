import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PrimaryLink } from '../Service-Class/primary-link';

// import { PrimaryLink } from './primary-link';

@Injectable({
  providedIn: 'root'
})
export class PrimaryLinkService {
  // private saveURL="http://localhost:8080/api/registerPrimaryLink";
  // private updateURL="http://localhost:8080/api/updatePrimaryLinkDetails";
  // private getURL="http://localhost:8080/api/getPrimaryLinkDetails";
  // private getURLWithStatusActive="http://localhost:8080/api/getPrimaryLinkDetailsWithStatusActive";
  // private getByIdURL="http://localhost:8080/api/getPrimaryLinkDetailsById";
  // private checkPrimaryLinkName="http://localhost:8080/api/checkPrimaryLinkDetailsByPrimaryLinkName";
  
  constructor(private httpClient: HttpClient) { }

  savePrimaryLink(primaryLink:PrimaryLink):Observable<Object>{
    return this.httpClient.post(`${environment.savePrimaryLinkURL}`,primaryLink);
  }

  checkPrimaryLinkNameDuplicate(primaryLink:PrimaryLink):Observable<Object>{
    console.log("aasuchi primaryLink service ku duplicate check pain");
    return this.httpClient.post(`${environment.checkPrimaryLinkName}`,primaryLink);

  }

  getPrimaryLinkList():Observable<PrimaryLink[]>{
    return this.httpClient.get<PrimaryLink[]>(`${environment.getPrimaryLinkURL}`);
  }
  getPrimaryLinkListWithStatusActive():Observable<PrimaryLink[]>{
    return this.httpClient.get<PrimaryLink[]>(`${environment.getPrimaryLinkDetailsWithPermission}`);
  }
  getPrimaryLinkById(primaryLinkId:number):Observable<PrimaryLink>{
    return this.httpClient.get<PrimaryLink>(`${environment.getPrimaryLinkByIdURL}/${primaryLinkId}`);
  }
  updatePrimaryLink(primaryLink:PrimaryLink):Observable<Object>{
    console.log("aasuchi primaryLink update service ku");
    return this.httpClient.post(`${environment.updatePrimaryLinkURL}`,primaryLink);

  }
}
