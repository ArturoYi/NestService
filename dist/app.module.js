"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const config_2 = __importDefault(require("./config"));
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const nestjs_cls_1 = require("nestjs-cls");
const shared_module_1 = require("./shared/shared.module");
const database_module_1 = require("./shared/datebase/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                expandVariables: true,
                envFilePath: [`.env.${process.env.NODE_ENV}`],
                load: [...Object.values(config_2.default)],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: () => ({
                    errorMessage: '当前操作过于频繁，请稍后再试！',
                    throttlers: [{ ttl: (0, throttler_1.seconds)(10), limit: 7 }],
                }),
            }),
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                interceptor: {
                    mount: true,
                    setup: (cls, context) => {
                        const req = context.switchToHttp().getRequest();
                        if (req.params?.id && req.body) {
                            cls.set('operateId', Number.parseInt(req.params.id));
                        }
                    },
                },
            }),
            shared_module_1.SharedModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_INTERCEPTOR, useFactory: () => new timeout_interceptor_1.TimeoutInterceptor(15 * 1000) },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map