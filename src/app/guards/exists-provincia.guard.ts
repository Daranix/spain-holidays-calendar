import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RestClientService } from '../services/rest-client.service';
import { firstValueFrom } from 'rxjs';

export const existsProvinciaGuard: CanActivateFn = async (route, state) => {

  const provincia = route.params['provincia'];
  const year = route.params['year'];

  const restApiService = inject(RestClientService);
  const router = inject(Router);


  try {
    await firstValueFrom(restApiService.findFestivosProvincia({ provincia, year }));
  } catch(ex) {
    router.navigate(['/error'], { skipLocationChange: true });
    return false;
  }

  return true;
};
