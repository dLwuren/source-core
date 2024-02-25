
const fun = new Function();
const el = document.createElement("div");
export default class KeyframesAnimation{
    target:HTMLElement;
    array:{[key:string]:any}[]=[];

    style:HTMLElement = document.createElement("style");
    className = "";
  
    duration = 0.15;
    timingFunction: number|string = "linear";
    delay = 0;
    iterationCount:number|string = "1";
    direction = "normal";
    fillMode = "backwards" || "forwards";

    bindEnd:any;

    constructor(target:HTMLElement|null|undefined){
        if(target instanceof HTMLElement) this.target = target;
        else{
            this.target = el;
        }
    }

    setTarget($el:HTMLElement){
        this.target = $el;

        return this;
    }

    setDuration(t:number){
        this.duration = t;
        return this;
    }

    setTimingFunction(timingFunction: number|string){
        this.timingFunction = timingFunction;
        return this;
    }

    setDelay(t:number){
        this.delay = t;
        return this;
    }

    setIterationCount(iterationCount:number|string){
        this.iterationCount = iterationCount;
        return this;
    }

    setDirection(direction:string){
        this.direction = direction;
        return this;
    }

    setFillMode(fillMode:string){
        this.fillMode = fillMode;
        return this;
    }

    Keyframes(obj:{[key:string]:any}){
        this.array.push(obj);
        return this;
    }

    start(){

        this.style.innerHTML = this.create();
        this.target.appendChild(this.style);
        this.target.classList.add(this.className);

        this.bindEnd = this.end.bind(this);

        this.target.addEventListener("animationend",this.bindEnd);
        
        return this;
    }

    create() {
        this.className = "ani_"+this.uuid();

        let style = `.${this.className}{
            animation: ${this.className} ${this.duration}s ${this.timingFunction} ${this.delay}s ${this.iterationCount} ${this.direction} ${this.fillMode};
        }\n`;
        
        style += "@keyframes "+this.className+ "{";
        for (const item of this.array) {
            style += `${item.time*100}%{`;
            for (const key in item) {
                if(key=="time") continue;
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    const element = item[key];
                    style += `${key}:${element};`;
                }
            }
            style += "}\n"
        }

        style+="}";

        return style;
    }

    private uuid(){
        return Number(new Date().getTime()+""+Math.floor(Math.random()*1000)).toString(16);
    }

    end(){
        this.target.removeEventListener("animationend",this.bindEnd);
        this.target.removeChild(this.style);

        this.target.classList.remove(this.className);

        this.onEnd();
    }

    onEnd = fun;
}