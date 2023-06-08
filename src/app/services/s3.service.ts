import { Injectable } from '@angular/core';
import * as aws from "aws-sdk";
import { SystemVariableService, SystemVariableServiceRecognitive } from "../services/system-variable";
import { Buffer } from 'buffer';
import { awsCredentials } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class S3Service {
  SYSTEM_VARIABLE = new SystemVariableService().SYSTEM_PARAMS;
  SYSTEM_VARIABLE_USER = new SystemVariableServiceRecognitive().SYSTEM_PARAMS

  upload(image, imageName, accessToken) {
    console.log("Upload metodo");
    return new Promise((resolve, reject) => {
      aws.config.region = this.SYSTEM_VARIABLE.REGION;
      aws.config.credentials = new aws.CognitoIdentityCredentials({
        IdentityPoolId: this.SYSTEM_VARIABLE.COGNITO_IDENTITY.IDENTITY_POOL_ID,
        Logins: {
          "cognito-idp.us-east-1.amazonaws.com/us-east-1_1cAr9PsQL": accessToken
        }
      });


      var s3 = new aws.S3({
        apiVersion: "2006-03-01",
        params: { Bucket: this.SYSTEM_VARIABLE.S3.BUCKET_NAME }
      });
      let something = Buffer.from(image, "base64")
      var data = {
        Bucket: this.SYSTEM_VARIABLE.S3.BUCKET_NAME,
        Key: imageName,
        Body: something,
        ContentEncoding: "base64",
        ContentType: "image/jpeg"
      };

      s3.putObject(data, (err, res) => {
        if (err) {
          console.log(err)
          reject(err);
        } else {
          console.log(res)
          resolve(res);
        }
      });

    });

  }
  uploadS3(image, imageName) {
    console.log("UploadS3");
    console.log(imageName);
    return new Promise((resolve) => {
      let s3 = new aws.S3()
      s3.config.update(awsCredentials)
      s3.config.update({ region: 'us-east-1' })
      let something = Buffer.from(image, "base64")
      const data = {
        Bucket: this.SYSTEM_VARIABLE.S3.BUCKET_NAME,
        Key: imageName,
        Body: something,
        ContentEncoding: "base64",
        ContentType: "image/jpeg"
      };

      s3.putObject(data, (err, res) => {
        console.log(data);
        if (err) {
          console.log(err);
          resolve(false);
          // return err
        } else {
          console.log(res);
          resolve(true);
        }
      });
    });
  }
  getURLPresignaded(imageName) {
    console.log("GetURLPresignaded");
    let s3 = new aws.S3()

    s3.config.update(awsCredentials)
    s3.config.update({ region: 'us-east-1' })

    const bucketName = 'fotos-sero-movil'
    const key = imageName
    const signedUrlExpireSeconds = 30000000 * 10

    const url = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: signedUrlExpireSeconds
    })
    return url

  }


  uploadPhotoUserChecador(photo: string, photoName: string) {
    return new Promise((resolve) => {
      let s3 = new aws.S3()
      s3.config.update(awsCredentials)
      s3.config.update({ region: 'us-east-1' })
      let something = Buffer.from(photo, "base64")
      const data = {
        Bucket: this.SYSTEM_VARIABLE.S3.BUCKET_NAME,
        Key: photoName,
        Body: something,
        ContentEncoding: "base64",
        ContentType: "image/jpeg"
      };

      s3.putObject(data, (err, res) => {
        console.log(data);
        if (err) {
          console.log(err);
          resolve(false);
          // return err
        } else {
          console.log(res);
          resolve(true);
        }
      });
    });
  }


  // esta igual que el otro metodo por que a este habra que cambiarle el nombre del bucket opcionalmente
  getURLPresignadedPhotoUser(imageName: any) {
    console.log(imageName)
    let s3 = new aws.S3()

    s3.config.update(awsCredentials)
    s3.config.update({ region: 'us-east-1' })

    const bucketName = 'fotos-sero-movil'
    const key = imageName
    const signedUrlExpireSeconds = 30000000 * 10

    const url = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: signedUrlExpireSeconds
    })
    console.log(url)
    return url

  }

}
