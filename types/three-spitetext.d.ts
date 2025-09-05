declare module "three-spritetext" {
  import { Sprite } from "three";

  export default class SpriteText extends Sprite {
    constructor(text?: string, textHeight?: number, color?: string);

    text: string;
    textHeight: number;
    color: string;

    backgroundColor: string;
    fontFace: string;
    fontSize: number;
    fontWeight: string;
    padding: number;
    borderWidth: number;
    borderColor: string;
    strokeWidth: number;
    strokeColor: string;
  }
}
