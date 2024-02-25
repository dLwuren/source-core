import { CustomElement } from "../custom_element";
import { Text} from "../Element";

export class Layout extends CustomElement{
    constructor(){
        super();
        this.setTag("div");
    }
}

enum Direction{
    column = 0,
    row = 1,
}

/**线性布局 */
export class LinearLayout extends Layout{
    static Direction = Direction;
    column = Direction.row;
    constructor(){
        super();
        this.setStyle({
            "width" : "auto",
            "height" : "auto",
        });
        this.setColumn(this.column);
    }

    setColumn(column:number){
        if (column == Direction.column) {
            this.setStyle({
                "display": "flex",
                "flex-direction": "column"
            })
        }
        else if (column == Direction.row) {
            this.setStyle({
                "display": "flex",
                "flex-direction": "row"
            })
        }

        this.updateStyle();

        return this;
    }

    alignItems(str="center"){
        this.setStyle({
            "align-items":str
        })
        return this;
    }

    justifyContent(str="center"){
        this.setStyle({
            "justify-content":str
        })
        return this;
    }
}

/**绝对布局 */
export class AbsoluteLayout extends Layout{
    constructor(){
        super();

        this.setStyle({
            "width" : "auto",
            "height" : "auto",
        });

        this.updateStyle();

        this.event.on("appendChild",(el:any)=>{
            el.event.emit("absoluteLayout",el);
            el.setPosition = (x:any,y:any)=>{
                el.setStyle({
                    "position": "absolute",
                    "left": x,
                    "top": y,
                })
            };
            return el;
        });
    }

    appendChild(el:CustomElement,x:any="0px",y:any="0px"){
        this.$el.appendChild(el.$el);
        this.event.emit("appendChild",el);
        el.setPosition(x,y);
        el.parent = this;
        return this;
    }
}

/**列表布局。被用于下拉选择框 */
export class ListLayout extends Layout{
  adapter:Adapter = new BaseAdapter();
  list:CustomElement[] = [];

  constructor(){
      super();
      this.setTag("ul");

      this.setStyle({
          width: "100px",
          "list-style": "none",
          "padding": 0,
          "margin": 0
      });
  }

  render() {
      this.$el.innerHTML = "";
      const count = this.adapter.getCount();
      for (let i = 0; i < count; i++) {
          const item = this.adapter.getItem(i);
          
          const element = this.adapter.template(item);
          const li = new CustomElement()
          .setStyle({
              "cursor": "pointer"
          })
          li.setTag("li");
          li.setStyle({
              padding:"5px"
          })
          li.appendChild(element);
          this.appendChild(li);

          li.$el.addEventListener("click",()=>{
              this.event.emit("clickItem",{
                  index: i,
                  target: element
              })
          })

          this.event.emit("renderItem",{
              target:li,
              index: i
          });
      }
  }
}

/**适配器、转换器 */
export interface Adapter{
    [k:string]:any;
    getItem(i:number|string):any;
    getId(i:number|string):any;
    getCount():number;
    template(item:any):CustomElement;
}

export class BaseAdapter implements Adapter{
    list:any[] = [];

    template(item: any): CustomElement {
        const text = new Text(item);
        return text;
    }

    getItem(i: number) {
        return this.list[i];
    }

    getId(i:number) {
        return this.list[i];
    }

    getCount(): number {
        return this.list.length;
    }
}