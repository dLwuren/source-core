import { Vector3 } from "../utils/Vector3";
import { CustomElement } from "../element/custom_element";
import { GraphNode } from "../graph/BaseNode";
import { Line } from "../element/group/index"
import { GraphNodeLayout } from "../graph_node_layout";
import { Circular, Input, Path, Svg } from "../element/Element";
import { Message } from "../utils/message";
import { isMobile } from "../utils/isMobile";

export const linkNodeType = {
    boolean: "布尔",
    string: "字符串",
    number: "数值",
    function:"函数",
    array:"数组",
    linkNode:"linkNode",
    object:"对象",
    undefined:"未定义",
    null:"空"
}

const linkNodeTypeColor = {
    string: "#e3b487",
    numbet: "#fff697",
    boolean: "#2c5ebc",
    function: "#f477ff",
    object: "#26d1ac",
    any: "#940000"
}

export class LinkNode extends Circular{
    static ENTRY = 1;
    static OUTPUT = 0;
    line:Line | undefined;
    lines:Line[]=[];
    graphNodeLayout:GraphNodeLayout;
    parentNode: GraphNode | undefined;
    alias:any = null;

    linkMaxCount = 1;
    mode = 0;
    typeName: string[] | string = "default";
    isNext = true;

    bgColor = "#fff"

    constructor(graphNodeLayout:GraphNodeLayout){
        super();
        this.setRadius(6).setStyle({"border":"solid 1px #fff"});
        this.graphNodeLayout = graphNodeLayout;

        this.init();
        this.initMobile();
    }

    init(){
        let boxinfo:any;
        let parentBoxinfo:any;

        const move = (e:PointerEvent)=>{
            if (this.line){
                this.line.set(this.index,e.pageX - parentBoxinfo.left,e.pageY - parentBoxinfo.top);
            }
        }

        const remove = (e:PointerEvent)=>{
            if (this.graphNodeLayout) {
                this.graphNodeLayout.$el.removeEventListener("mousemove",move);
                this.graphNodeLayout.$el.removeEventListener("mouseup",remove);

                if(this.graphNodeLayout.activeLinkNode && this.graphNodeLayout.openActiveLinkNode){
                    const activeLinkNode:LinkNode | undefined = this.graphNodeLayout.activeLinkNode;
                    if(activeLinkNode){
                        activeLinkNode.setStyle({
                            background: this.bgColor
                        });
    
                        if(this.line) {
                            this.lines.push(this.line);
                            activeLinkNode.lines.push(this.line);

                            this.line.startObject = this;
                            this.line.endObject = activeLinkNode;
                        }

                        this.line = undefined;
                    }
                }
                else{
                    if(this.line)
                        this.graphNodeLayout.removeChild(this.line);
                    
                    if(!this.lines.length){
                        this.setStyle({
                            background:"none"
                        });
                    }

                    this.line = undefined;
                }
                
                this.graphNodeLayout.openActiveLinkNode = undefined;
                this.graphNodeLayout.activeLinkNode = undefined;
            }
        }

        this.$el.addEventListener("mousedown",(e:PointerEvent)=>{
            if (this.graphNodeLayout && this.mode == LinkNode.OUTPUT) {

                if(this.lines.length >= this.linkMaxCount && this.linkMaxCount != -1) return;
                
                this.line = new Line();
                this.line.path.stroke(this.bgColor);

                this.graphNodeLayout.openActiveLinkNode = this;
                
                this.setStyle({
                    background: this.bgColor
                });

                this.graphNodeLayout?.appendChild(this.line);
                
                boxinfo = this.$el.getBoundingClientRect();
                parentBoxinfo = this.graphNodeLayout.$el.getBoundingClientRect();
                
                this.line.set(0,boxinfo.left - parentBoxinfo.left + 8,boxinfo.top - parentBoxinfo.top + 8);
                this.line.set(1,boxinfo.left - parentBoxinfo.left + 8,boxinfo.top - parentBoxinfo.top + 8);

                this.graphNodeLayout.$el.addEventListener("mousemove",move);
                this.graphNodeLayout.$el.addEventListener("mouseup",remove);
            }
            else{
                this.setStyle({"cursor":"no-drop",});
            }

            e.stopPropagation();
            e.preventDefault();
        })

        this.$el.addEventListener("mouseenter",()=>{
            let isTypeName = false;

            if(this.graphNodeLayout){
                if(this.typeName instanceof Array){
                    isTypeName = this.typeName.indexOf(this.graphNodeLayout.openActiveLinkNode?.typeName+"") > -1;
                }
                else{
                    isTypeName = this.typeName == this.graphNodeLayout.openActiveLinkNode?.typeName+"";
                }
            }
            
            if(
                this.graphNodeLayout && 
                this.graphNodeLayout.openActiveLinkNode &&
                isTypeName &&
                this.graphNodeLayout.openActiveLinkNode != this &&
                this.graphNodeLayout.openActiveLinkNode.mode != this.mode &&
                this.lines.length < this.linkMaxCount
            ){
                this.graphNodeLayout.activeLinkNode = this;
                this.setStyle({
                    border:"solid 1px "+this.bgColor,
                });
            }
            else if(
                this.graphNodeLayout && 
                this.graphNodeLayout.openActiveLinkNode
            ){
                this.setStyle({"cursor":"no-drop"});
            }
        })
        
        this.$el.addEventListener("mouseleave",()=>{
            if(
                this.graphNodeLayout && 
                this.graphNodeLayout.openActiveLinkNode && 
                this.graphNodeLayout.activeLinkNode == this
            ){
                this.graphNodeLayout.activeLinkNode = undefined;
            }
            this.setStyle({"border":"solid 1px #fff","cursor":"default"});
        })

        this.$el.addEventListener("dblclick",(e:PointerEvent)=>{
            this.removeLines();
            e.preventDefault();
            e.stopPropagation();
            return false;
        })
    }

    initMobile(){
        let boxinfo:any;
        let parentBoxinfo:any;
        let long = false;
        this.$el.addEventListener("touchstart",(e:PointerEvent)=>{
            if(this.graphNodeLayout.openActiveLinkNode){
                if(this.graphNodeLayout.openActiveLinkNode==this){
                    if(this.lines.length==0){
                        this.setStyle({
                            background: "none"
                        });
                    }

                    this.setStyle({
                        border:"solid 1px #fff"
                    });
                    
                    this.graphNodeLayout.openActiveLinkNode = undefined;
                }
                else if(this.mode == LinkNode.OUTPUT){
                    this.graphNodeLayout.openActiveLinkNode.setStyle({
                        border:"solid 1px #fff"
                    });
                    this.graphNodeLayout.openActiveLinkNode = undefined;
                }
                else{
                    let isTypeName = false;

                    if(this.lines.length >= this.linkMaxCount && this.linkMaxCount != -1){
                        new Message().setMode(Message.WARN).show("已达最大链接数");
                        return
                    }

                    if(this.graphNodeLayout){
                        if(this.typeName instanceof Array){
                            isTypeName = this.typeName.indexOf(this.graphNodeLayout.openActiveLinkNode?.typeName+"") > -1;
                        }
                        else{
                            isTypeName = this.typeName == this.graphNodeLayout.openActiveLinkNode?.typeName+"";
                        }
                    }

                    if(isTypeName && this.graphNodeLayout.openActiveLinkNode.line){
                        const line = this.graphNodeLayout.openActiveLinkNode.line;

                        line.startObject = this.graphNodeLayout.openActiveLinkNode;
                        line.endObject = this;
                        this.lines.push( line );
                        this.graphNodeLayout.openActiveLinkNode.lines.push( line );
                        this.updatedLine();
                        this.setStyle({
                            background: this.bgColor
                        });

                        this.graphNodeLayout.openActiveLinkNode.setStyle({
                            border:"solid 1px #fff"
                        });

                        this.graphNodeLayout.openActiveLinkNode = undefined;
                    }
                    else{
                        new Message().setMode(Message.WARN).show("链接类型不一样，可连接:"+this.graphNodeLayout.openActiveLinkNode?.typeName);
                    }
                }
            }
            else if (this.graphNodeLayout && this.mode == LinkNode.OUTPUT) {
                if(this.lines.length >= this.linkMaxCount && this.linkMaxCount != -1) return;
                
                this.line = new Line();
                this.line.path.stroke(this.bgColor);

                this.graphNodeLayout.openActiveLinkNode = this;
                
                this.setStyle({
                    background: this.bgColor,
                    border:"solid 1px red"
                });

                this.graphNodeLayout?.appendChild(this.line);
                
                boxinfo = this.$el.getBoundingClientRect();
                parentBoxinfo = this.graphNodeLayout.$el.getBoundingClientRect();
                
                this.line.set(0,boxinfo.left - parentBoxinfo.left + 8,boxinfo.top - parentBoxinfo.top + 8);
                this.line.set(1,boxinfo.left - parentBoxinfo.left + 8,boxinfo.top - parentBoxinfo.top + 8);
            }
            else if(this.mode == LinkNode.ENTRY){
                setTimeout(()=>{
                    long = true;
                },500)
            }

            e.stopPropagation();
            e.preventDefault();
        })
        this.$el.addEventListener("touchend",(e:PointerEvent)=>{
            if(long){
                this.removeLines();
                long = false;
            }
        })
    }

    updatedLine(parentBoxinfo:any=null) {
        const boxinfo = this.$el.getBoundingClientRect();
        parentBoxinfo = parentBoxinfo || this.graphNodeLayout.$el.getBoundingClientRect();

        const left = boxinfo.left - parentBoxinfo.left + this.radius;
        const top = boxinfo.top - parentBoxinfo.top + this.radius;
        this.lines.forEach(line=>{
            line.set(this.mode,left,top);
        })
    }

    setTypeName(name:string|string[]){
        this.typeName = name;
        return this;
    }

    selfAuto(fun:(el:CustomElement)=>void){
        fun.call(this,this);

        return this;
    }

    setMode(mode:number){
        this.mode = mode;
        return this;
    }

    setLinkMaxCount(count:number){
        this.linkMaxCount = count;
        return this;
    }

    setIsNext(is=true){
        this.isNext = is;
        return this;
    }

    setAlias(alias:any){
        this.alias = alias;
        return this;
    }

    removeLines(){
        const len = this.lines.length;
        for (let i = 0; i < len; i++) {
            const line = this.lines.pop();
            if(line) this.removeLine(line,false);
        }
    }

    removeLine(line:Line,removeFlag=true){
        let index = -1;
        if(removeFlag){
            index = this.lines.indexOf(line);
            if(index > -1) this.lines.splice(index);
        }

        if(this.lines.length == 0)  {
            this.setStyle({
                background:"none"
            });
        }
        
        const endObject = line.endObject == this ? line.startObject : line.endObject;

        index = endObject.lines.indexOf(line);
        if(index > -1) endObject.lines.splice(index);

        if(endObject.lines.length == 0)  {
            endObject.setStyle({
                background:"none"
            });
        }
        
        this.graphNodeLayout.removeChild(line);
    }
}

export class LinkNodeCircularEntry extends LinkNode{
    constructor(graphNodeLayout:GraphNodeLayout){
        super(graphNodeLayout);
        this.setMode(LinkNode.ENTRY);
    }
}

export class LinkNodeCircularOutput extends LinkNode{
    constructor(graphNodeLayout:GraphNodeLayout){
        super(graphNodeLayout);
        this.setMode(LinkNode.OUTPUT);
    }
}

//  box
export class LinkNodeBoxEntry extends LinkNodeCircularEntry{
    constructor(graphNodeLayout:GraphNodeLayout){
        super(graphNodeLayout);
        this.setRadius(5).setStyle({"border":"solid 1px #fff","border-radius":"0"});
    }
}

export class LinkNodeBoxOutput extends LinkNodeCircularOutput{
    constructor(graphNodeLayout:GraphNodeLayout){
        super(graphNodeLayout);
        this.setRadius(5).setStyle({"border":"solid 1px #fff","border-radius":"0"});
    }
}

//  next up
export class LinkNodeNext extends LinkNodeCircularOutput{
    bgColor = "#fff";
    path:Path;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName("linkNode");
        this.setRadius(7);
        this.setAlias("next");

        let path:any;
        this.appendChild(
            new Svg()
            .setStyle({
                width:"100%",
                "height":"100%"
            })
            .appendChild(
                new Path()
                .setAttribute("viewBox","0 0 100 100")
                .selfAuto(el=>path = el)
                .set([
                    5,5,Path.M,
                    50,5,Path.L,

                    95,50,Path.L,

                    50,95,Path.L,
                    2,95,Path.L,

                    5,5,Path.L,
                ])
                .fill("none")
                .stroke("#fff")
                .strokeWidth(10)
            )
        )
        this.path = path;

        this.setStyle({
            "border-radius": "0",
            "display": "flex",
            "border":"none"
        })
    }

    setStyle(style: { [k: string]: any; }) {
        if(style.background){
            this.path.fill(style.background)
        }
        if(style.border && style.border.trim() == "none"){
            this.path?.stroke("#ffffff")
        }
        else if(style.border && style.border.trim()!=""){
           if(isMobile()){
                this.path?.stroke("red")
           }
        }
        else{
            this.path?.stroke("#fff")
        }
        delete style.border;
        delete style.background;

        super.setStyle(style);
        return this;
    }
}

export class LinkNodeUp extends LinkNodeNext{
    bgColor = "#fff";
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName("linkNode");
        this.setAlias("up");
        this.setMode(LinkNode.ENTRY);
    }
}

// number
export class LinkNodeNumberOutput extends LinkNodeBoxOutput{
    bgColor = linkNodeTypeColor.numbet;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.number);
        this.setRadius(5);
    }
}

export class LinkNodeNumberEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.numbet;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.number);
        this.setRadius(5);
    }
}

// boolean
export class LinkNodeBooleanOutput extends LinkNodeBoxOutput{
    bgColor = linkNodeTypeColor.boolean;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.boolean);
        this.setRadius(5);
    }
}

export class LinkNodeBooleanEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.boolean;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.boolean);
        this.setRadius(5);
    }
}

// string
export class LinkNodeStringOutput extends LinkNodeBoxOutput{
    bgColor = linkNodeTypeColor.string;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.string);
        this.setRadius(5);
    }
}

export class LinkNodeStringEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.string;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.string);
        this.setRadius(5);
    }
}

// function
export class LinkNodeFunctionOutput extends LinkNodeBoxOutput{
    bgColor = linkNodeTypeColor.function;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.null);
        this.setRadius(5);
    }
}

export class LinkNodeFunctionEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.function;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.null);
        this.setRadius(5);
    }
}

// Object
export class LinkNodeObjectOutput extends LinkNodeBoxOutput{
    bgColor = linkNodeTypeColor.object;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.object);
        this.setRadius(5);
    }
}

export class LinkNodeObjectEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.object;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.object);
        this.setRadius(5);
    }
}

// Array
export class LinkNodeArrayOutput extends LinkNodeBoxOutput{
    bgColor = linkNodeTypeColor.object;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.function);
        this.setRadius(5);
    }
}

export class LinkNodeArrayEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.object;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(linkNodeType.function);
        this.setRadius(5);
    }
}

// any
export class LinkNodeAnyEntry extends LinkNodeBoxEntry{
    bgColor = linkNodeTypeColor.any;
    constructor(graphNodeLayout: GraphNodeLayout){
        super(graphNodeLayout);
        this.setTypeName(Object.values(linkNodeType).filter(k=>{
            if(k == linkNodeType.linkNode){
                return false;
            }
            return true;
        }));
        this.setRadius(5);
    }
}