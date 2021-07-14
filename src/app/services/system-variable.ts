import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemVariableService {
  public SYSTEM_PARAMS = {
    REGION: "us-east-1",
    COGNITO_POOL: {
      UserPoolId: "us-east-1_1cAr9PsQL",
      ClientId: "1q21rlt46i81nv7hr26jk2l43l"
    },
    COGNITO_IDENTITY: {
      IDENTITY_POOL_ID: "us-east-1:850348cc-bb23-486f-b42c-62b2bece34d1"
    },
    S3: {
      BUCKET_NAME: "fotos-implementta-movil"
    }
  };
}