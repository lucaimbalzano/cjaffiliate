import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('CJAFFILIATE Driver - Luca Imbalzano')
    .setDescription('Telegram and Youtube automation')
    .setVersion('1.0')
    .addBearerAuth(
      { in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    await app.listen(3000);
  }
  console.log(`  

    ████████▓▓▓▓░░▒▒░░▒▒░░░░  ░░░░  ░░░░▒▒░░▒▒░░▓▓▓▓████████
    ██████▓▓▒▒▓▓▒▒  ▒▒░░░░  ░░    ░░  ░░░░▒▒  ▒▒▓▓▒▒▓▓██████
    ██▓▓██▓▓▓▓▒▒░░▒▒  ░░                ░░  ▒▒░░▒▒▓▓▓▓██▓▓██
    ████▓▓▒▒▓▓▒▒▒▒░░░░                    ░░░░▒▒▒▒▓▓▒▒▓▓████
    ████▓▓▓▓▒▒░░░░░░                        ░░░░░░▒▒▓▓▓▓████
    ██▓▓▓▓▒▒▒▒▒▒░░                            ░░▒▒▒▒▒▒▓▓▓▓██
    ▓▓▓▓▒▒▓▓▒▒▒▒  ░░                        ░░  ▒▒▒▒▓▓▒▒▓▓▓▓
    ██▓▓▓▓▒▒▒▒░░░░        CJAFFILIATE         ░░░░▒▒▒▒▓▓▓▓██
    ██▓▓▓▓▒▒▒▒░░░░          DRIVER            ░░░░▒▒▒▒▓▓▓▓██
    ▓▓▓▓▒▒▓▓▒▒▒▒  ░░                        ░░  ▒▒▒▒▓▓▒▒▓▓▓▓
    ██▓▓▓▓▒▒▒▒▒▒░░                            ░░▒▒▒▒▒▒▓▓▓▓██
    ████▓▓▓▓▒▒░░░░░░                        ░░░░░░▒▒▓▓▓▓████
    ████▓▓▒▒▓▓▒▒▒▒░░░░                    ░░░░▒▒▒▒▓▓▒▒▓▓████
    ██▓▓██▓▓▓▓▒▒░░▒▒  ░░                ░░  ▒▒░░▒▒▓▓▓▓██▓▓██
    ██████▓▓▒▒▓▓▒▒  ▒▒░░░░  ░░    ░░  ░░░░▒▒  ▒▒▓▓▒▒▓▓██████
    ████████▓▓▓▓░░▒▒░░▒▒░░░░  ░░░░  ░░░░▒▒░░▒▒░░▓▓▓▓████████
    
    `)
  bootstrap();
  
