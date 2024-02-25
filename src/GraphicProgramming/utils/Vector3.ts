export class Vector3{
    [k:string]: any;
    x = 0;
    y = 0;
    z = 0;

    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;
        this.z = z;

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

        Object.defineProperty(this,"2",{
            get() {
                return this.z;
            },
            set(v:number){
                this.z = v;
            }
        })
    }

    get(index=-1){
        if(index > -1 && index < 3){
            return this[index];
        }
        return [this.x,this.y,this.z];
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getZ(){
        return this.z;
    }

    set(x:number,y:number,z:number){
        this.x = x;
        this.y = y;
        this.z = z;
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

    copy(vector3:Vector3){
        this.set(vector3.x,vector3.y,vector3.z);
    }

    clone(){
        return new Vector3(this.x,this.y,this.z);
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

    max(vector3:Vector3){
        this.x = Math.max(this.x,vector3.x);
        this.y = Math.max(this.y,vector3.y);
        this.z = Math.max(this.z,vector3.z);

        return this;
    }

    min(vector3:Vector3){
        this.x = Math.min(this.x,vector3.x);
        this.y = Math.min(this.y,vector3.y);
        this.z = Math.min(this.z,vector3.z);

        return this;
    }

    length(){
        return this.x * this.x +
                this.y * this.y +
                this.z * this.z;
    }

    lengthSq(){
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z 
        );
    }

    setLength(index:number){
        const ratio = index / this.length();

        this.x = this.x * ratio;
        this.y = this.y * ratio;
        this.z = this.z * ratio;

        return this;
    }

    negate(){
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    }

    // +
    add(num:Vector3|number|number[]){
        if(num instanceof Vector3){
            this.x += num.x;
            this.y += num.y;
            this.z += num.z;
        }
        else if(typeof num == "number"){
            this.x += num;
            this.y += num;
            this.z += num;
        }
        else if(num instanceof Array){
            this.x += num[0];
            this.y += num[1];
            this.z += num[2];
        }

        return this;
    }

    // -
    sub(num:Vector3|number|number[]){
        if(num instanceof Vector3){
            this.x -= num.x;
            this.y -= num.y;
            this.z -= num.z;
        }
        else if(typeof num == "number"){
            this.x -= num;
            this.y -= num;
            this.z -= num;
        }
        else if(num instanceof Array){
            this.x -= num[0];
            this.y -= num[1];
            this.z -= num[2];
        }

        return this;
    }

    // * 
    multiply(num:Vector3|number|number[]){
        if(num instanceof Vector3){
            this.x *= num.x;
            this.y *= num.y;
            this.z *= num.z;
        }
        else if(typeof num == "number"){
            this.x *= num;
            this.y *= num;
            this.z *= num;
        }
        else if(num instanceof Array){
            this.x *= num[0];
            this.y *= num[1];
            this.z *= num[2];
        }

        return this;
    }

    // /
    divide(num:Vector3|number|number[]){
        if(num instanceof Vector3){
            this.x /= num.x;
            this.y /= num.y;
            this.z /= num.z;
        }
        else if(typeof num == "number"){
            this.x /= num;
            this.y /= num;
            this.z /= num;
        }
        else if(num instanceof Array){
            this.x /= num[0];
            this.y /= num[1];
            this.z /= num[2];
        }

        return this;
    }

    // %
    mod(num:Vector3|number|number[]){
        if(num instanceof Vector3){
            this.x %= num.x;
            this.y %= num.y;
            this.z %= num.z;
        }
        else if(typeof num == "number"){
            this.x %= num;
            this.y %= num;
            this.z %= num;
        }
        else if(num instanceof Array){
            this.x %= num[0];
            this.y %= num[1];
            this.z %= num[2];
        }

        return this;
    }

    // **
    square(num:Vector3|number|number[]){
        if(num instanceof Vector3){
            this.x **= num.x;
            this.y **= num.y;
            this.z **= num.z;
        }
        else if(typeof num == "number"){
            this.x **= num;
            this.y **= num;
            this.z **= num;
        }
        else if(num instanceof Array){
            this.x **= num[0];
            this.y **= num[1];
            this.z **= num[2];
        }

        return this;
    }

    // 点积
    dot(vector3:Vector3){
        return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z;
    }

    // 叉积
    cross(vector3:Vector3){
        console.log(vector3);
        
        return
    }

    // 向量的模
    norm(){
        return Math.sqrt( this.square(2).sum() );
    }

    sum(){
        return this.x + this.y + this.z;
    }

    normalize(){
        const magSqr = this.x * this.x + this.y * this.y + this.z * this.z;

        if (magSqr === 1.0)
            return this;


        if (magSqr === 0.0) {
            return this;
        }

        const invsqrt = 1.0 / Math.sqrt(magSqr);
        this.x *= invsqrt;
        this.y *= invsqrt;
        this.z *= invsqrt;

        return this;
    }

    includedAngle(vector3:Vector3){
        const cos = this.dot(vector3) / ( this.norm() * vector3.norm() );
        
        return Math.acos(cos);
    }

    distanceTo(vector3:Vector3){
        const x = vector3.x - this.x;
        const y = vector3.y - this.y;
        const z = vector3.z - this.z;

        return Math.sqrt(x*x+y*y+z*z);
    }

    lerp(point:Vector3,ratio:number){
       const x = point.x - this.x ;
       const y = point.y - this.y;
       const z = point.z - this.z;

       this.set(
            this.x + x * ratio,
            this.y + y * ratio,
            this.z + z * ratio
       )

       return this;
    }

    equal(vector3:Vector3){
        return this.x === vector3.x && this.y === vector3.y && this.z === vector3.z;
    }

    static from(obj:{
        [key:string]: any ,
        x: number,
        y: number,
        z: number
    } | {
        [key:string]: any ,
        "0": number,
        "1": number,
        "2": number
    }){

        const vector3 = new Vector3(0,0,0);

        if(!Vector3.isUndefined(obj,"0") && !Vector3.isUndefined(obj,"1") && !Vector3.isUndefined(obj,"2")){
            vector3.set(obj["0"],obj["1"],obj["2"]);
        }
        else if(!Vector3.isUndefined(obj,"x") && !Vector3.isUndefined(obj,"y") && !Vector3.isUndefined(obj,"z")){
            vector3.set(obj.x,obj.y,obj.z);
        }
        
        return vector3;
    }

    static isUndefined(obj:any,key:string){
        return typeof obj[key] == "undefined";
    }
}