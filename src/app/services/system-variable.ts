import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SystemVariableService {
  public SYSTEM_PARAMS = {
    REGION: "us-east-1",
    COGNITO_POOL: {
      UserPoolId: "us-east-1_Ab129fabB",
      ClientId: "7lhlkkfbfb4q5kpp90urffao"
    },
    COGNITO_IDENTITY: {
      IDENTITY_POOL_ID: "us-east-2:ec533192-33a3-4a74-89af-ebe4dc409b47"
    },
    S3: {
      BUCKET_NAME: "fotos-sero-movil"
    }
  };
}

export class SystemVariableServiceRecognitive {
  public SYSTEM_PARAMS = {
    REGION: "us-east-1",
    COGNITO_POOL: {
      UserPoolId: "us-east-1_Ab129fabB",
      ClientId: "7lhlkkfbfb4q5kpp90urffao"
    },
    COGNITO_IDENTITY: {
      IDENTITY_POOL_ID: "us-east-2:ec533192-33a3-4a74-89af-ebe4dc409b47"
    },
    S3: {
      BUCKET_NAME: "fotos-usuarios"
    }
  };
}