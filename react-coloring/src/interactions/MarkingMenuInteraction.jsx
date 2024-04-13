import React, { useEffect } from "react";
import { Icon, Button } from "semantic-ui-react";
import { loadPage } from "../components/ColoringBook.jsx";
import { setTool } from "../javascripts/Paper";

const paper = require("paper");
const _ = require("underscore");

const bindInteractivity = (setHistory) => {
  paper.activeColor = new paper.Color("red"); // Binding global variable to paper object
  paper.activeColor.brightness = 0.5;
  let originalBrightness = paper.activeColor.brightness;

  const menuRadius = 200;

  const hitOptions = {
    stroke: false,
    fill: true,
    tolerance: 1,
    minDistance: 10,
  };

  // Grabbing relevant elements from the SVG (named in FIGMA)
  const menu = paper.project.getItem({ name: "MarkingMenu" });
  menu.visible = false; // Comment out when you are ready to test.

  const swatch = paper.project.getItem({ name: "Swatch" }); // The Middle of the Marking Menu
  let eyedropperActive = false;

  new paper.Tool({
    name: "marking",
    getRegion: function (point) {
      const hitResults = menu.hitTestAll(point, { fill: true });
      if (hitResults.length > 0) {
        return hitResults[0].item.parent
          ? hitResults[0].item.parent.name
          : hitResults[0].item;
      }
      return null;
    },
    onMouseMove: function (event) {
      const region = this.getRegion(event.point);
      if (region === "BrightenRegion" || region === "DarkenRegion") {
        const center = menu.position;
        const distance = center.getDistance(event.point);
        const adjustmentRatio = distance / menuRadius;

        if (region === "BrightenRegion" && paper.activeColor.brightness < 1) {
          const newBrightness = Math.min(
            originalBrightness + adjustmentRatio * (1 - originalBrightness),
            1
          );
          swatch.fillColor = new paper.Color({
            hue: paper.activeColor.hue,
            saturation: paper.activeColor.saturation,
            brightness: newBrightness,
          });
          paper.activeColor = swatch.fillColor;
        } else if (
          region === "DarkenRegion" &&
          paper.activeColor.brightness > 0
        ) {
          const newBrightness = Math.max(
            originalBrightness - adjustmentRatio * originalBrightness,
            0
          );
          swatch.fillColor = new paper.Color({
            hue: paper.activeColor.hue,
            saturation: paper.activeColor.saturation,
            brightness: newBrightness,
          });
          paper.activeColor = swatch.fillColor;
        }
      } else {
        if (region === "ClearRegion") {
          swatch.fillColor = new paper.Color("white");
          originalBrightness = paper.activeColor.brightness;
        } else {
          swatch.fillColor = paper.activeColor;
        }
      }
    },
    onMouseLeave: function (event) {
      console.log("ML", this.getRegion(event.point));
    },
    onMouseUp: function (event) {
      const region = this.getRegion(event.point);
      menu.visible = false;

      if (region === "EyedropperRegion") {
        originalBrightness = paper.activeColor.brightness;
        eyedropperActive = true;
      } else if (region === "ClearRegion") {
        paper.activeColor = new paper.Color("white");
      }
    },
    onMouseDown: function (event) {
      const region = this.getRegion(event.point);
      if (event.event.button === 2) {
        menu.position = new paper.Point(
          event.event.clientX,
          event.event.clientY - 75
        );
        menu.visible = true;
        originalBrightness = paper.activeColor.brightness;
      }

      if (eyedropperActive) {
        const hit = paper.project.hitTest(event.point, hitOptions);
        if (
          hit &&
          hit.item !== menu &&
          hit.item.fillColor &&
          hit.item.fillColor.brightness > 0
        ) {
          paper.activeColor = hit.item.fillColor;
          originalBrightness = paper.activeColor.brightness;
        }
        eyedropperActive = false;
      }

      // BUCKET INTERACTION -- WILL COLOR ANY WHITE CELL WITH ACTIVE COLOR
      var hitResults = paper.project.hitTestAll(event.point, hitOptions);
      if (hitResults.length > 0) {
        _.each(hitResults, function (h) {
          if (h.item.name === "well") {
            return;
          }
          // Don't color black lines
          if (h.item.fillColor.brightness === 0) {
            return;
          }
          h.item.set({
            fillColor: paper.activeColor,
          });
        });
      }
    },
  });
};

// NO NEED TO MODIFY CODE UNDER THIS LINE

const loadMarkingMenu = ({ setHistory, innerRadius, outerRadius }) => {
  console.log("Generating Marking Menu");
  if (paper.project.activeLayer.children.MarkingMenu) {
    return;
  }
  loadPage({
    url: "/coloring_pages/MarkingMenu.svg",
    fitBounds: false,
    onLoaded: () => {
      console.log("SVG Loaded");
      bindInteractivity(setHistory);
    },
    extract: "MarkingMenu",
    // postProcess: (item) => item.visible = false
  });
};

const MarkingMenuInteraction = ({ paperReady }) => {
  useEffect(() => {
    if (paperReady) {
      if (paper.project) {
        paper.project.clear();
      }
      loadMarkingMenu({ innerRadius: 50, outerRadius: 200 });
      const g = new paper.Group({ name: "swatches" });
      _.each(_.range(0, 360, 45), function (el, i) {
        new paper.Path.Circle({
          parent: g,
          name: "well",
          fillColor: new paper.Color({
            brightness: 0.8,
            hue: el,
            saturation: 0.8,
          }),
          strokeColor: "black",
          strokeWidth: 3,
          position: paper.view.center.add(
            new paper.Point({ length: 100 * i, angle: 0 })
          ),
          radius: 30,
        });
      });
      g.position = paper.view.bounds.topCenter.add(
        new paper.Point({ x: 0, y: 50 })
      );
    }
  }, [paperReady]);

  return (
    <Button icon onClick={() => setTool("marking")}>
      <Icon name="arrows alternate horizontal" />
    </Button>
  );
};

export { MarkingMenuInteraction };
