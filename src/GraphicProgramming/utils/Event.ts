
export class Event {
    [key:string]: any;
    target = null;

    constructor(target:any){
        this.target = target;
    }

    emit(eventName:string,e:{[key:string]:any}={}){
        if(this[eventName] instanceof Array){
            const list = this[eventName];
            for (let i = 0; i < list.length; i++) {
               list[i].call(this.target,e);
            }
        }
        return this;
    }

    on(eventName:string,calback: (e:{[key:string]:any})=>any ){
        if(!(this[eventName] instanceof Array)){
            this[eventName] = [];
        }

        this[eventName].push(calback);
        return this;
    }

    remove(eventName:string,calback:any){
        if(this[eventName] instanceof Array){
            const list = this[eventName];
            for (let i = 0; i < list.length; i++) {
                if(list[i] == calback){
                    list.splice(i,1);
                    return;
                }
            }
        }
        return this;
    }
}