export class Vector2{
    [k:string]: any;
    x = 0;
    y = 0;

    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;

        Object.defineProperty(this,"0",{
            get() {
                return this.x;
            },
            set(v:number){
                this.x = v;
            }
        })

        Object.defineProperty(this,"1",{
            get() {
               return this.y;
            },
            set(v:number){
                this.y = v;
            }
        })
    }

    get(index=-1){
        if(index > -1 && index < 2){
            return this[index];
        }
        return [this.x,this.y];
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    set(x:number,y:number){
        this.x = x;
        this.y = y;
    }

    setX(x:number){
        this.x = x;
    }

    setY(y:number){
        this.y = y;
    }

    setZ(z:number){
        this.z = z;
    }

    copy(vector3:Vector2){
        this.set(vector3.x,vector3.y);
    }

    clone(){
        return new Vector2(this.x,this.y);
    }

    random(){
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();

        return this;
    }

    randomDirection(){
        this.x = Math.random() * 2 - 1 ;
        this.y = Math.random() * 2 - 1 ;
        this.z = Math.random() * 2 - 1 ;

        return this;
    }

    randomInt(min=0,max=10){
        this.x = Math.floor(Math.random() * (max - min) - min );
        this.y = Math.floor(Math.random() * (max - min) - min );
        this.z = Math.floor(Math.random() * (max - min) - min );

        return this;
    }

    randomFloat(min=0,max=10){
        this.x = Math.random() * (max - min) - min ;
        this.y = Math.random() * (max - min) - min ;
        this.z = Math.random() * (max - min) - min ;
    }

    ceil(){
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y)
        this.z = Math.ceil(this.z);

        return this;
    }

    floor(){
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y)
        this.z = Math.floor(this.z);

        return this;
    }

    round(){
        this.x = Math.round(this.x);
        this.y = Math.round(this.y)
        this.z = Math.round(this.z);

        return this;
    }

    max(vector3:Vector2){
        this.x = Math.max(this.x,vector3.x);
        this.y = Math.max(this.y,vector3.y);

        return this;
    }

    min(vector3:Vector2){
        this.x = Math.min(this.x,vector3.x);
        this.y = Math.min(this.y,vector3.y);

        return this;
    }

    length(){
        return this.x * this.x +
                this.y * this.y ;
    }

    lengthSq(){
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y
        );
    }

    setLength(index:number){
        const ratio = index / this.length();

        this.x = this.x * ratio;
        this.y = this.y * ratio;

        return this;
    }

    negate(){
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    // +
    add(num:Vector2|number|number[]){
        if(num instanceof Vector2){
            this.x += num.x;
            this.y += num.y;
        }
        else if(typeof num == "number"){
            this.x += num;
            this.y += num;
        }
        else if(num instanceof Array){
            this.x += num[0];
            this.y += num[1];
        }

        return this;
    }

    // -
    sub(num:Vector2|number|number[]){
        if(num instanceof Vector2){
            this.x -= num.x;
            this.y -= num.y;
        }
        else if(typeof num == "number"){
            this.x -= num;
            this.y -= num;
        }
        else if(num instanceof Array){
            this.x -= num[0];
            this.y -= num[1];
        }

        return this;
    }

    // * 
    multiply(num:Vector2|number|number[]){
        if(num instanceof Vector2){
            this.x *= num.x;
            this.y *= num.y;
        }
        else if(typeof num == "number"){
            this.x *= num;
            this.y *= num;
        }
        else if(num instanceof Array){
            this.x *= num[0];
            this.y *= num[1];
        }

        return this;
    }

    // /
    divide(num:Vector2|number|number[]){
        if(num instanceof Vector2){
            this.x /= num.x;
            this.y /= num.y;
        }
        else if(typeof num == "number"){
            this.x /= num;
            this.y /= num;
        }
        else if(num instanceof Array){
            this.x /= num[0];
            this.y /= num[1];
        }

        return this;
    }

    // %
    mod(num:Vector2|number|number[]){
        if(num instanceof Vector2){
            this.x %= num.x;
            this.y %= num.y;
        }
        else if(typeof num == "number"){
            this.x %= num;
            this.y %= num;
        }
        else if(num instanceof Array){
            this.x %= num[0];
            this.y %= num[1];
        }

        return this;
    }

    // **
    square(num:Vector2|number|number[]){
        if(num instanceof Vector2){
            this.x **= num.x;
            this.y **= num.y;
        }
        else if(typeof num == "number"){
            this.x **= num;
            this.y **= num;
        }
        else if(num instanceof Array){
            this.x **= num[0];
            this.y **= num[1];
        }

        return this;
    }

    // 点积
    dot(vector3:Vector2){
        return this.x * vector3.x + this.y * vector3.y ;
    }

    // 叉积
    cross(vector3:Vector2){
        console.log(vector3);
        
        return
    }

    // 向量的模
    norm(){
        return Math.sqrt( this.square(2).sum() );
    }

    sum(){
        return this.x + this.y;
    }

    normalize(){
        const magSqr = this.x * this.x + this.y * this.y ;

        if (magSqr === 1.0)
            return this;


        if (magSqr === 0.0) {
            return this;
        }

        const invsqrt = 1.0 / Math.sqrt(magSqr);
        this.x *= invsqrt;
        this.y *= invsqrt;

        return this;
    }

    includedAngle(vector3:Vector2){
        const cos = this.dot(vector3) / ( this.norm() * vector3.norm() );
        
        return Math.acos(cos);
    }

    distanceTo(vector3:Vector2){
        const x = vector3.x - this.x;
        const y = vector3.y - this.y;

        return Math.sqrt(x*x+y*y);
    }

    lerp(point:Vector2,ratio:number){
       const x = point.x - this.x ;
       const y = point.y - this.y;

       this.set(
            this.x + x * ratio,
            this.y + y * ratio
       )

       return this;
    }

    equal(vector3:Vector2){
        return this.x === vector3.x && this.y === vector3.y ;
    }

    static from(obj:{
        [key:string]: any ,
        x: number,
        y: number,
    } | {
        [key:string]: any ,
        "0": number,
        "1": number,
    }){

        const vector3 = new Vector2(0,0,0);

        if(!Vector2.isUndefined(obj,"0") && !Vector2.isUndefined(obj,"1")){
            vector3.set(obj["0"],obj["1"]);
        }
        else if(!Vector2.isUndefined(obj,"x") && !Vector2.isUndefined(obj,"y") ){
            vector3.set(obj.x,obj.y);
        }
        
        return vector3;
    }

    static isUndefined(obj:any,key:string){
        return typeof obj[key] == "undefined";
    }
}