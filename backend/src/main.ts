import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Platarforma Tour 360')
    .setDescription('API for Plataforma Tour 360')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log('Listening on port 3000');
    console.log('########## http://localhost:3000/api-docs for documentation ##########');
  });
}
bootstrap();
