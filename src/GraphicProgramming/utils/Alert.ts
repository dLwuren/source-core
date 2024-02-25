import KeyframesAnimation from "./KeyframesAnimation";

let el: null|HTMLElement = null;
let count = 0;

function createcontainer(){
    count++;

    if (!el) {
        el = document.createElement("div");
        el.setAttribute("style",`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 20000;
            background: rgba(0,0,0,0.2)
        `);
    }
    
    if(count == 1) document.body.appendChild(el);
    
    return el;
}

function remove(){
    el?.remove();
}

export  class Alert{
    show(msg:string,fun=new Function(),cancel=new Function()){
        const el = this.getContainer();
        createcontainer().appendChild(el);

        el.innerHTML = `
            <p  style="border-bottom: solid 1px #d7d7d7; width: 100%;text-align: center; box-sizing: border-box;padding: 20px 10px;font-size:14px;color:#2e2e2e;word-break: break-all;">${msg}</p>
            <div style="display:flex;align-items: center;width: 100%;">
                <button class="cancel" style="cursor: pointer;color:#888;flex:1;width:100%;padding:10px;border:none;background:none;border-right:solid 1px #d7d7d7;">取消</button>
                <button class="confirm" style="cursor: pointer;flex:1;width:100%;padding:10px;border:none;background:none">确认</button>
            </div>
        `;

        new KeyframesAnimation(el)
        .Keyframes({
            time: 0,
            transform: "translate(-50%,-100%)",
            opacity: "0"
        })
        .Keyframes({
            time: 1,
            opacity: "1",
            transform: "translate(-50%,-50%)",
        })
        .start();

        el.querySelector(".cancel")?.addEventListener("click",()=>{
            new KeyframesAnimation(el)
            .Keyframes({
                time: 1,
                opacity: "0",
            })
            .Keyframes({
                time: 0,
                opacity: "1",
            })
            .start()
            .onEnd = ()=>{
                el.remove();
                count--;
                if(count == 0) remove();
                cancel();
            }
        })

        el.querySelector(".confirm")?.addEventListener("click",()=>{
            new KeyframesAnimation(el)
            .Keyframes({
                time: 1,
                opacity: "0",
            })
            .Keyframes({
                time: 0,
                opacity: "1",
            })
            .start()
            .onEnd = ()=>{
                el.remove();
                count--;
                if(count == 0) remove();
                fun();
            }
        })
    }

    private getContainer(){
        const el = document.createElement("div");
        el.setAttribute("style",`
            position: absolute;
            top: 50%;
            left: 50%;
            max-width: 250px;
            width:90%;
            padding: 10px;
            background: #fff;
            pointer-events: all;
            margin: 5px 0;
            transform: translate(-50%,-50%);
            transition: 0.25s;
            display: flex;
            flex-direction: column;
            align-items: center;
           
            border-radius: 10px;
            padding-bottom: 0px;
        `);

        return el;
    }
}