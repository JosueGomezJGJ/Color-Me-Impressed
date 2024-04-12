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
  // const t = new paper.PointText({
  //   point: paper.view.center,
  //   content: "TODO: Direct Manipulation.jsx",
  //   fillColor: "black",
  //   fontSize: 20,
  //   onMouseDown: function (event) {
  //     //TODO
  //   },
  //   oneMouseMove: function (event) {
  //     //TODO
  //   },
  //   onMouseUp: function (event) {
  //     //TODO
  //   },
  // });
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
