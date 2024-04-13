import { useEffect } from "react";

let _ = require("underscore");
let paper = require("paper");

const createDMCircle = () => {
  const t = new paper.Path.Circle({
    radius: 150,
    fillColor: "red",
    strokeColor: "black",
    strokeWidth: 3,
    onMouseDown: function (event) {
      this.dragging = true;
      this.fillColor = "blue";
    },
    onMouseDrag: function (event) {
      if (this.dragging) {
        this.position = this.position.add(event.delta);
      }
    },
    onMouseUp: function (event) {
      this.fillColor = "red";
      this.dragging = false;
    },
  });
  t.position = paper.view.center;
};

const DirectManipulation = (paperReady) => {
  useEffect(() => {
    if (paperReady && paper.project) {
      paper.project.clear();
      createDMCircle();
    }

    return () => {
      if (paper.project) {
        paper.project.clear();
      }
    };
  }, [paperReady]);
};

export { DirectManipulation };
