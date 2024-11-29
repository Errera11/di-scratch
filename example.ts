import "reflect-metadata";

type constructor = { new (...args: any[]): {}};

class Container {
    private container: Map<constructor, {}>;

    constructor() {
        this.container = new Map();
    }

    register(constr: constructor) {
        const params: constructor[] = Reflect.getMetadata('params', constr);

        const args = [];

        for (const param of params) {
            const instance = this.getInstance(param);

            args.push(instance);
        }

        const instance = new constr(...args);

        this.container.set(constr, instance);
    }

    getInstance<T extends constructor>(constr: T): InstanceType<T> {
        const instance =  this.container.get(constr);

        if(!instance) throw new Error(`Instance ${constr.name} have not been registered!`);

        return instance as InstanceType<T>;
    }
}

function InjectThis<T extends { new(...args: any[]): {} }>(constr: T) {
    const params = Reflect.getMetadata('design:paramtypes', constr);
    let paramsConstructors = [];

    if(params) {
        for (const param of params) {
            paramsConstructors.push(param);
        }
    }

    Reflect.defineMetadata('params', paramsConstructors, constr);
}

interface ICommand {
    compute: (a: number, b: number) => number;
}

interface IMyClass {
    compute: (a: number, b: number) => void;
}

interface ILogger {
    log: (r: number) => void;
}

@InjectThis
class Logger implements ILogger {
    log(r: number) {
        console.log(`Computed value is ${r}`);
    }
}

@InjectThis
class Command implements ICommand {

    compute(a: number, b: number) {
        return a + b;
    }
}

@InjectThis
class MyClass implements IMyClass {
    constructor(readonly command: Command, private logger: Logger) {}

    compute(a: number, b: number) {
        const result = this.command.compute(a, b);

        this.log(result);
    }

    log(val: number) {
        this.logger.log(val);
    }
}

const container = new Container();

container.register(Command);
container.register(Logger);
container.register(MyClass);

const myClass = container.getInstance(MyClass);
myClass.compute(1, 4);