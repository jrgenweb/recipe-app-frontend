import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

export const authInterceptor =
  (getToken: () => string | null) =>
  (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const token = getToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    }
    return next(req);
  };
