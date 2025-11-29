"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnectionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let DbConnectionInterceptor = class DbConnectionInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            const isConnectionError = error?.message?.includes('connection') ||
                error?.message?.includes('timeout') ||
                error?.message?.includes('ECONNREFUSED') ||
                error?.message?.includes('Connection terminated') ||
                error?.message?.includes('Unable to connect') ||
                error?.code === 'ECONNREFUSED' ||
                error?.code === 'ETIMEDOUT';
            if (isConnectionError) {
                console.error('Database connection error detected:', error.message);
                return (0, rxjs_1.throwError)(() => new common_1.HttpException({
                    statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                    message: 'Database connection error. Please try again.',
                    error: 'Service Unavailable',
                }, common_1.HttpStatus.SERVICE_UNAVAILABLE));
            }
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
};
exports.DbConnectionInterceptor = DbConnectionInterceptor;
exports.DbConnectionInterceptor = DbConnectionInterceptor = __decorate([
    (0, common_1.Injectable)()
], DbConnectionInterceptor);
//# sourceMappingURL=db-connection.interceptor.js.map