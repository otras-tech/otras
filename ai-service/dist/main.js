"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const child_process_1 = require("child_process");
const express = require("express");
async function bootstrap() {
    const port = process.env.AI_SERVICE_PORT || 8000;
    try {
        if (process.platform === 'win32') {
            try {
                const stdout = (0, child_process_1.execSync)(`netstat -ano | findstr :${port}`).toString();
                const lines = stdout.split(/\r?\n/);
                for (const line of lines) {
                    if (line.includes('LISTENING')) {
                        const parts = line.trim().split(/\s+/);
                        const pid = parts[parts.length - 1];
                        if (pid && pid !== '0') {
                            console.log(`Killing process ${pid} on port ${port}`);
                            (0, child_process_1.execSync)(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
                        }
                    }
                }
            }
            catch (e) { }
        }
        else {
            (0, child_process_1.execSync)(`npx kill-port ${port}`, { stdio: 'ignore', timeout: 5000 });
        }
    }
    catch (e) { }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('OTRAS AI Service')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port);
    console.log(`AI Orchestration Service is running on: http://localhost:${port}`);
    console.log(`API Prefix: /api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map