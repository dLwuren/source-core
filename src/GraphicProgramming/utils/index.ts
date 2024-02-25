class MyPromise{
    state = "pending";
    resolveFun:any = null;
    rejectFun:any = null;
    res:any = null;
    err:any = null;

    nextMyPromiseInfo:any;

    constructor(callFun:any){
        callFun(this.resolve.bind(this),this.reject.bind(this));
    }

    // 成功
    resolve(res:any){
        if(this.state == "pending"){
            if(this.resolveFun) {
                const p = this.resolveFun(res);
                if(p instanceof MyPromise || p instanceof Promise){
                    p.then((res:any)=>{
                        this.nextMyPromiseInfo.resolve(res);
                    })
                }
            }
            else this.res = res;

            this.state = "resolved";
        }
    }

    // 失败
    reject(err:any){
        if(this.state == "pending"){
            if(this.rejectFun) {
                this.rejectFun(err);
            }
            else this.err = err;

            this.state = "rejected";
        }
    }

    then(resolveFun:any,rejectFun:any=new Function()){
        if(this.state == "pending"){
            this.nextMyPromiseInfo  = {};
            const p = new MyPromise((resolve:any,reject:any)=>{
                this.nextMyPromiseInfo.resolve = resolve;
                this.nextMyPromiseInfo.reject = reject;
            });
            this.rejectFun = rejectFun;
            this.resolveFun = resolveFun;
            return p;
        }
        else if(this.state == "resolved"){
            return resolveFun(this.res);
        }
        else{
            return rejectFun(this.err);
        }
    }
}

function * create():any{
    const b:any = yield new Promise((resolve)=>{
        resolve(1);
    });

    console.log(b);
    

    const a:any = yield new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(2);
        },2000)
    });

    console.log(a);

    const c:any = yield new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(22222223);
        },2000)
    });

    console.log(c);
}
// parser(create());
function parser(createObj:any,res:any=undefined){
    const obj = createObj.next(res);
    if(obj.value instanceof MyPromise || obj.value instanceof Promise ){
        obj.value.then((res:any)=>{
            if(!obj.done){
                parser(createObj,res);
            }
        })
    }else{
        if(!obj.done){
            parser(createObj,obj.value);
        }
    }
}