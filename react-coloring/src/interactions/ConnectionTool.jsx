import { Icon, Button } from "semantic-ui-react";
import { setTool } from "../javascripts/Paper";
import { useEffect } from "react";

const paper = require("paper");
const _ = require("underscore");

const ConnectionTool = () => {
  // define your hitOptions
  // use match to filter out the items you want to interact with
  let path;

  const isPointInFlowBox = (point) => {
    let found = false;
    paper.project.getItems({ name: "flowBox" }).forEach((flowBoxItem) => {
      if (flowBoxItem.contains(point)) {
        found = true;
      }
    });
    return found;
  };

  const drawStartOrEndMarker = (point, isStart) => {
    if (isPointInFlowBox(point)) {
      new paper.Path.Rectangle({
        point: point.subtract(10),
        size: [20, 20],
        fillColor: "green",
      });
    } else {
      const marker = new paper.Path.Circle({
        center: point,
        radius: 10,
        fillColor: "red",
      });
    }
  };

  const cT = new paper.Tool({
    name: "connection",
    onMouseDown: function (event) {
      // TODO

      path = new paper.Path({
        strokeColor: "black",
        strokeWidth: 10,
      });

      drawStartOrEndMarker(event.point, true);
    },
    onMouseDrag: function (event) {
      // TODO
      path.add(event.point);
    },
    onMouseUp: function (event) {
      // TODO
      path.simplify();

      drawStartOrEndMarker(event.point, false);
    },
  });

  useEffect(() => {
    cT.activate();

    return () => {
      if (paper.tool && paper.tool.name === "connection") {
        paper.tool.remove();
      }
    };
  }, []);

  return (
    <Button icon onClick={() => setTool("circle")}>
      <Icon name="sitemap" />
    </Button>
  );
};

export { ConnectionTool };
