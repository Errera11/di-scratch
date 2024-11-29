"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
class Container {
    constructor() {
        this.container = new Map();
    }
    register(constr) {
        const params = Reflect.getMetadata('params', constr);
        const args = [];
        for (const param of params) {
            const instance = this.getInstance(param);
            args.push(instance);
        }
        const instance = new constr(...args);
        this.container.set(constr, instance);
    }
    getInstance(constr) {
        const instance = this.container.get(constr);
        if (!instance)
            throw new Error(`Instance ${constr.name} have not been registered!`);
        return instance;
    }
}
function InjectThis(constr) {
    const params = Reflect.getMetadata('design:paramtypes', constr);
    let paramsConstructors = [];
    if (params) {
        for (const param of params) {
            paramsConstructors.push(param);
        }
    }
    Reflect.defineMetadata('params', paramsConstructors, constr);
}
let Logger = class Logger {
    log(r) {
        console.log(`Computed value is ${r}`);
    }
};
Logger = __decorate([
    InjectThis
], Logger);
let Command = class Command {
    compute(a, b) {
        return a + b;
    }
};
Command = __decorate([
    InjectThis
], Command);
let MyClass = class MyClass {
    constructor(command, logger) {
        this.command = command;
        this.logger = logger;
    }
    compute(a, b) {
        const result = this.command.compute(a, b);
        this.log(result);
    }
    log(val) {
        this.logger.log(val);
    }
};
MyClass = __decorate([
    InjectThis,
    __metadata("design:paramtypes", [Command, Logger])
], MyClass);
const container = new Container();
container.register(Command);
container.register(Logger);
container.register(MyClass);
const myClass = container.getInstance(MyClass);
myClass.compute(1, 4);
