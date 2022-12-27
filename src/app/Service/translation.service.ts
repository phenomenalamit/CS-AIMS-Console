import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService implements TranslateLoader {

  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<string> {
    return this.http.get<string>(`${environment.translationServiceURL}` + lang)
    // .pipe(
    //   map((response: string) => {
    //     console.log("response : ",response);
    //   return response;
    // })
    // );
    }
}
