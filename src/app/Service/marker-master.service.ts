import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarkerMaster } from '../Service-Class/marker-master';
import { Covid19Master, GenderEqualityMarker, MarkerMasterOptions, RioMarkerBioDiversity, RioMarkerClimateChangeAdaption, RioMarkerClimateChangeDesertification, RioMarkerClimateChangeMitigation } from './marker-master-options';

@Injectable({
  providedIn: 'root'
})
export class MarkerMasterService {

  constructor(private httpClient: HttpClient) { }

  public getMarkerMasterDetails():Observable<MarkerMaster[]>{
    return this.httpClient.get<MarkerMaster[]>(`${environment.getMarkerMasterURL}`);
  }
  public getAllMarkerMasterDetails(searchValue:string):Observable<MarkerMaster[]>{
    return this.httpClient.get<MarkerMaster[]>(`${environment.allMarkerMaster}`+"?searchValue="+searchValue);
  }
  public getMarkerMasterOptionsDetails():Observable<MarkerMasterOptions[]>{
    return this.httpClient.get<MarkerMasterOptions[]>(`${environment.getMarkerMasterOptionsDetails}`);
  }
  public getAllMarkerMasterOptionsDetails(searchValue:string):Observable<MarkerMasterOptions[]>{
    return this.httpClient.get<MarkerMasterOptions[]>(`${environment.allMarkerMasterOptionsDetails}`+"?searchValue="+searchValue);
  }
  public getAllCovid19MasterDetails():Observable<Covid19Master[]>{
    return this.httpClient.get<Covid19Master[]>(`${environment.getAllCovid19MasterDetails}`);
  }
  public getAllGenderEqualityMarkerDetails():Observable<GenderEqualityMarker[]>{
    return this.httpClient.get<GenderEqualityMarker[]>(`${environment.getAllGenderEqualityMarkerDetails}`);
  }
  public getAllRioMarkerClimateChangeMitigationDetails():Observable<RioMarkerClimateChangeMitigation[]>{
    return this.httpClient.get<RioMarkerClimateChangeMitigation[]>(`${environment.getAllRioMarkerClimateChangeMitigationDetails}`);
  }
  public getAllRioMarkerClimateChangeDesertificationDetails():Observable<RioMarkerClimateChangeDesertification[]>{
    return this.httpClient.get<RioMarkerClimateChangeDesertification[]>(`${environment.getAllRioMarkerClimateChangeDesertificationDetails}`);
  }
  public getAllRioMarkerClimateChangeAdaptionDetails():Observable<RioMarkerClimateChangeAdaption[]>{
    return this.httpClient.get<RioMarkerClimateChangeAdaption[]>(`${environment.getAllRioMarkerClimateChangeAdaptionDetails}`);
  }
  public getAllRioMarkerBioDiversityDetails():Observable<RioMarkerBioDiversity[]>{
    return this.httpClient.get<RioMarkerBioDiversity[]>(`${environment.getAllRioMarkerBioDiversityDetails}`);
  }
}
