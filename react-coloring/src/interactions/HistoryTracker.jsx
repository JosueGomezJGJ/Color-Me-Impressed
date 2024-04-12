import { Button, Icon } from "semantic-ui-react";
import { useEffect } from "react";

let _ = require("underscore");
let paper = require("paper");

const HistoryTracker = ({
  paperReady,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
}) => {
  useEffect(() => {
    if (paperReady && paper.project) {
      paper.project.clear();
    }

    return () => {
      if (paper.project) {
        paper.project.clear();
      }
    };
  }, [paperReady]);

  const undo = () => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const historyEvent = newUndoStack.splice(0, 1)[0];

      historyEvent.inverse();

      const newRedoStack = [historyEvent, ...redoStack];

      setUndoStack(newUndoStack);
      setRedoStack(newRedoStack);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const historyEvent = newRedoStack.splice(0, 1)[0];

      historyEvent.action();

      const newUndoStack = [historyEvent, ...undoStack];

      setUndoStack(newUndoStack);
      setRedoStack(newRedoStack);
    }
  };

  return (
    <div>
      <Button icon onClick={undo}>
        <Icon name="undo" />
      </Button>
      <Button icon onClick={redo}>
        <Icon name="redo" />
      </Button>
    </div>
  );
};

export { HistoryTracker };
