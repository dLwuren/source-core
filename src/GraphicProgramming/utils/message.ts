import KeyframesAnimation from "./KeyframesAnimation";

let el: null|HTMLElement = null;
let count = 0;

const icon = [
    `<svg style="width:26px;height:26px" t="1679542168354" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3755" "><path d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m218.624 672.256c15.872 15.872 15.872 41.984 0 57.856-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776L512 569.856l-160.256 160.256c-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776c-15.872-15.872-15.872-41.984 0-57.856L454.144 512 293.376 351.744c-15.872-15.872-15.872-41.984 0-57.856 15.872-15.872 41.984-15.872 57.856 0L512 454.144l160.256-160.256c15.872-15.872 41.984-15.872 57.856 0 15.872 15.872 15.872 41.984 0 57.856L569.856 512l160.768 160.256z" fill="#CF3736" p-id="3756"></path></svg>`,
    `<svg style="width:26px;height:26px" t="1679542201843" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4738" ><path d="M1001.661867 796.544c48.896 84.906667 7.68 157.013333-87.552 157.013333H110.781867c-97.834667 0-139.050667-69.504-90.112-157.013333l401.664-666.88c48.896-87.552 128.725333-87.552 177.664 0l401.664 666.88zM479.165867 296.533333v341.333334a32 32 0 1 0 64 0v-341.333334a32 32 0 1 0-64 0z m0 469.333334v42.666666a32 32 0 1 0 64 0v-42.666666a32 32 0 1 0-64 0z" fill="#FAAD14" p-id="4739"></path></svg>`,
    `<svg style="width:26px;height:26px" t="1679542270683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8217" ><path d="M874.119618 149.859922A510.816461 510.816461 0 0 0 511.997 0.00208a509.910462 509.910462 0 0 0-362.119618 149.857842c-199.817789 199.679789-199.817789 524.581447 0 724.260236a509.969462 509.969462 0 0 0 362.119618 149.857842A508.872463 508.872463 0 0 0 874.119618 874.120158c199.836789-199.679789 199.836789-524.581447 0-724.260236zM814.94268 378.210681L470.999043 744.132295a15.359984 15.359984 0 0 1-5.887994 4.095996c-1.751998 1.180999-2.913997 2.362998-5.276994 2.913997a34.499964 34.499964 0 0 1-13.469986 2.914997 45.547952 45.547952 0 0 1-12.897986-2.303998l-4.095996-2.363997a45.291952 45.291952 0 0 1-7.009992-4.095996l-196.902793-193.789796a34.126964 34.126964 0 0 1-10.555989-25.186973c0-9.37399 3.583996-18.74698 9.98399-25.186974a36.429962 36.429962 0 0 1 50.372947 0l169.98382 167.423824L763.389735 330.220732a37.059961 37.059961 0 0 1 50.371947-1.732998 33.647965 33.647965 0 0 1 11.165988 25.186973 35.544963 35.544963 0 0 1-9.98399 24.575974v-0.04z m0 0" fill="#52C41A" p-id="8218"></path></svg>`,
    `<svg style="width:26px;height:26px" fill="#888" t="1679542092544"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2786" ><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-85.333333c235.648 0 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667z m-42.666667-469.333334a42.666667 42.666667 0 0 1 85.333334 0v298.666667a42.666667 42.666667 0 0 1-85.333334 0v-298.666667z m38.4-136.533333a59.733333 59.733333 0 1 1 0-119.466667 59.733333 59.733333 0 0 1 0 119.466667z"  p-id="2787"></path></svg>`,
];

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
            pointer-events: none;
            z-index: 20000;
            
        `);
    }
    
    if(count == 1) document.body.appendChild(el);
    
    return el;
}

function remove(){
    el?.remove();
}

export class Message{
    static get ERROR(){return 0}
    static get WARN(){return 1}
    static get SUCESS(){return 2}
    static get TIP(){return 3}

    mode = Message.TIP;
    show(msg:string,duration=2000){
        const el = this.getContainer();
        createcontainer().appendChild(el);

        el.innerHTML = `
            ${icon[this.mode]}
            <p  style="display: flex;align-items: center;font-size:14px;color:#2e2e2e;margin-left:10px;white-space: none;flex:1word-break: break-all;">${msg}</p>
        `;

        new KeyframesAnimation(el)
        .Keyframes({
            time: 0,
            transform: "translate(-50%, -50%)",
            opacity: "0"
        })
        .Keyframes({
            time: 1,
            transform: "translate(-50%, 0%)",
            opacity: "1"
        })
        .start();

        setTimeout(()=>{
            new KeyframesAnimation(el)
            .Keyframes({
                time: 1,
                transform: "translate(-50%, -50%)",
                opacity: "0"
            })
            .Keyframes({
                time: 0,
                transform: "translate(-50%, 0%)",
                opacity: "1"
            })
            .start()
            .onEnd = ()=>{
                el.remove();
                count--;
                if(count == 0) remove();
            }
        },duration);
    }

    private getContainer(){
        const el = document.createElement("div");
        el.setAttribute("style",`
            position: relative;
            top: 0;
            left: 50%;
            max-width: 300px;
            width:90%;
            padding: 10px;
            background: whitesmoke;
            pointer-events: none;
            margin: 5px 0;
            transform: translateX(-50%);
            transition: 0.25s;
            display: grid;
            grid-template-columns: 16px 1fr;
            grid-gap: 10px;
        `);

        return el;
    }

    setMode(mode:number){
        this.mode = mode;
        return this;
    }
}