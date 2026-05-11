import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export class SwaggerConfig extends DocumentBuilder {
  constructor() {
    super();
    this.setTitle('Uber Microsservices API GATEWAY')
      .setDescription(
        'Esta documentação tem como objetivo auxiliar desenvolvedores a entender a estrutura e o funcionamento da API desenvolvida para estudos da arquitetura e funcionamento de microsserviços e API Gateways',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'jwt',
      )
      .addServer('http://localhost:3000/api/v1', 'Local Server')
      .addServer('', 'Development Server')
      .addServer('', 'Production Server');
  }
}

export function setupSwagger(app: INestApplication, path = 'api/docs') {
  const config = new SwaggerConfig().build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  document.security = [{ jwt: [] }];

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Documentação API - 3D Request',
    customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DRACULA),
  });
}
