import { Base } from "./Base";
import { Application } from "./Application";
import { Text } from "./Text";
import { Process } from "./Process";
import { Keyboard_mouse } from "./Keyboard_mouse";
import { Os } from "./Os";
import { DataType } from "./DataType";
import { Window } from "./Window";
import { File } from "./File";
import { Mind } from "./Mind";

import { JavaScript } from "./JavaScript";
import { ArrayToken } from "./Array";
import { NetWork } from "./NetWork";
import { ObjectAnalysis } from "./Object";
import { StringAnalysis } from "./String";


export default {
  name: "js",
  install() {
    return [
      // 自定义
      new Base(),
      new Application(),
      new Text(),
      new Process(),
      new Keyboard_mouse(),
      new Os(),
      new DataType(),
      new Window(),
      new File(),
      new Mind(),
      
      // 自带的
      // new JavaScript(),
      // new ObjectAnalysis(),
      // new ArrayToken(),
      // new StringAnalysis(),
      // new NetWork(),
    ]
  }
}