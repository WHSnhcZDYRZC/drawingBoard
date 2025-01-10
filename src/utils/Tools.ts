import { Ellipse, Line, Pen, Rect, Text } from "leafer-ui";
import Index from "../components/tools/index";
import { render, h, ref, Ref, nextTick } from "vue";
import { Arrow } from "@leafer-in/arrow";

import SELECT_TOOl_ICON from "../assets/xuanzegongju.svg";
import BRUSH_TOOl_ICON from "../assets/huabi.svg";
import ERASER_TOOl_ICON from "../assets/xiangpigongju.svg";
import RECT_TOOl_ICON from "../assets/huabigongju-juxing.svg";
import ELLIPSE_TOOl_ICON from "../assets/huabigongju-tuoyuan.svg";
import TEXT_TOOl_ICON from "../assets/huabigongju-wenben.svg";
import LINE_TOOl_ICON from "../assets/zhixiangongju.svg";
import ARROW_TOOl_ICON from "../assets/jiantougongju-hover.svg";

import LineSegmentSizePlugin from "../components/plugins/LineSegmentSizePlugin";
import LineSegmentColorPlugin from "../components/plugins/LineSegmentColorPlugin";
import LineSegmentBackgroundColorPlugin from "../components/plugins/LineSegmentBackgroundColorPlugin";
import { IAppProps, IToolBarItem } from "./types";
import TextColor from "../components/plugins/TextColor";
import TextSize from "../components/plugins/TextSize";
import { COLOR } from "./constant";

export const INITIAL_WIDTH = 0;
export const INITIAL_HEIGHT = 0;

export const toolBarOptions: IToolBarItem[] = [
  {
    icon: SELECT_TOOl_ICON,
    name: "selectTool",
    title: "选择",
  },
  {
    icon: BRUSH_TOOl_ICON,
    name: "brushTool",
    title: "画笔",
    strokeWidth: 3,
    stroke: "rgba(0, 0, 0, 1)",
    createdFactory(x: number, y: number) {
      const pen: Pen = new Pen({
        name: "brushTool",
        x,
        y,
        editable: true,
      });

      pen.setStyle({
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        strokeCap: "round",
        strokeJoin: "round",
      });
      return pen;
    },
    onMousemove(e, drawingBoard, point) {
      drawingBoard.selectedGraphics.value.lineTo(point.width, point.height);
    },
    menuPlugins: [LineSegmentSizePlugin, LineSegmentColorPlugin],
  },
  {
    icon: RECT_TOOl_ICON,
    name: "rectTool",
    title: "矩形",
    strokeWidth: 2,
    stroke: "rgba(0, 0, 0, 1)",
    fill: COLOR.WHITE,
    createdFactory(x: number, y: number) {
      return new Rect({
        name: "rectTool",
        x,
        y,
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        fill: this.fill,
        editable: true,
      });
    },
    menuPlugins: [
      LineSegmentSizePlugin,
      LineSegmentColorPlugin,
      LineSegmentBackgroundColorPlugin,
    ],
  },
  {
    icon: ELLIPSE_TOOl_ICON,
    name: "ellipseTool",
    title: "椭圆",
    strokeWidth: 2,
    stroke: "rgba(0, 0, 0, 1)",
    fill: COLOR.WHITE,
    createdFactory(x: number, y: number) {
      return new Ellipse({
        name: "ellipseTool",
        x,
        y,
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
        innerRadius: 1,
        editable: true,
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        fill: this.fill,
      });
    },

    menuPlugins: [
      LineSegmentSizePlugin,
      LineSegmentColorPlugin,
      LineSegmentBackgroundColorPlugin,
    ],
  },
  {
    icon: LINE_TOOl_ICON,
    name: "lineTool",
    title: "线条",
    strokeWidth: 3,
    stroke: "rgba(0, 0, 0, 1)",
    createdFactory(x: number, y: number) {
      return new Line({
        name: "lineTool",
        x,
        y,
        toPoint: { x: 0, y: 0 },
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        editable: true,
      });
    },
    onMousemove(e, drawingBoard, point) {
      drawingBoard.selectedGraphics.value.toPoint = { x: point.width, y: point.height };
    },
    menuPlugins: [LineSegmentSizePlugin, LineSegmentColorPlugin],
  },
  {
    icon: ARROW_TOOl_ICON,
    name: "arrowTool",
    title: "箭头",
    strokeWidth: 3,
    stroke: "rgba(0, 0, 0, 1)",
    createdFactory(x: number, y: number) {
      return new Arrow({
        name: "arrowTool",
        x,
        y,
        toPoint: { x: 0, y: 0 },
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        editable: true,
      });
    },
    onMousemove(e, drawingBoard, point) {
      drawingBoard.selectedGraphics.value.toPoint = { x: point.width, y: point.height };
    },
    menuPlugins: [LineSegmentSizePlugin, LineSegmentColorPlugin],
  },
  {
    icon: TEXT_TOOl_ICON,
    name: "textTool",
    title: "文本",
    notMove: true,
    cursor: "text",
    fontSize: 24,
    fill: "rgba(0, 0, 0, 1)",
    createdFactory(x: number, y: number) {
      return new Text({
        name: "textTool",
        x: x - 5,
        width: 200,
        height: 35,
        y: y - 10,
        text: "请双击编辑内容",
        fontSize: this.fontSize,
        fill: this.fill,
        editable: true,
      });
    },
    menuPlugins: [TextSize, TextColor],
  },
  {
    icon: ERASER_TOOl_ICON,
    name: "eraserTool",
    title: "橡皮擦",
    cursor: "grabbing",
    isAfterRemove: true,
    createdFactory: (x: number, y: number) =>
      new Line({
        x,
        y,
        toPoint: { x: 0, y: 0 },
        strokeWidth: 3,
        stroke: "rgba(0, 0, 0, 1)",
        editable: true,
      }),

    onMousemove(e, drawingBoard) {
      const { target } = drawingBoard.leaferInstanceReadonly.pick(
        { x: e.x, y: e.y },
        {
          hitRadius: 2,
        }
      )!;

      if (!target) return;

      const has = drawingBoard.clearGraphicsQueue.has(target);

      if (has) return;

      drawingBoard.clearGraphicsQueue.set(target, target);
      target.opacity = 0.5;
    },
  },
];

class Tools {
  public toolbarActiveIndex: Ref<number> = ref(0);
  constructor(config: IAppProps["config"]) {
    this.init(config);
  }

  private init(config: IAppProps["config"]) {
    if (config.toolbar && config.toolbar.length) {
      config.toolbar.forEach((item) => {
        if (item.index) {
          toolBarOptions.splice(item.index, 0, item);
        }
      });
    }

    const div = document.createElement("div");
    document.getElementById("app").append(div);

    nextTick(() => render(h(Index), div));
  }

  public getActiveGraphics() {
    return toolBarOptions[this.toolbarActiveIndex.value];
  }

  public setTheme(value) {
    toolBarOptions.forEach((item) => {
      if (item.stroke) {
        item.stroke = value ? COLOR.BLACK : COLOR.WHITE
      }

      if (item.name === 'textTool') {
        item.fill = value ? COLOR.BLACK : COLOR.WHITE
      }
    })
  }
}

export default Tools;
