import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  get<T>(
    baseUrl: string,
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http
      .get<T>(`${baseUrl}/${endpoint}`, {
        params,
        headers,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  post<T>(
    baseUrl: string,
    endpoint: string,
    body: any,
    headers?: HttpHeaders,
    params?: HttpParams
  ): Observable<T> {
    return this.http
      .post<T>(`${baseUrl}/${endpoint}`, body, { headers, params })
      .pipe(catchError(this.handleError.bind(this)));
  }

  put<T>(
    baseUrl: string,
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http
      .put<T>(`${baseUrl}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete<T>(
    baseUrl: string,
    endpoint: string,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http
      .delete<T>(`${baseUrl}/${endpoint}`, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  postDownloadFile(
    baseUrl: string,
    endpoint: string,
    body: any,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<HttpResponse<Blob>> {
    return this.http
      .post(`${baseUrl}/${endpoint}`, body, {
        headers,
        params,
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.logout();
    }
    return throwError(() => new Error('An error occurred'));
  }
}
