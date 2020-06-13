import {
  getDestinationPath,
  getSourcePath
} from "@atlaskit/tree/dist/cjs/utils/flat-tree";
import {getTreePosition} from "@atlaskit/tree/dist/cjs/utils/tree";
import {
  isTopOfSubtree,
  hasSameParent,
  getPathOnLevel,
  moveAfterPath
} from "@atlaskit/tree/dist/cjs/utils/path";
import {between} from "@atlaskit/tree/dist/cjs/utils/handy";

export const calculateNewTreeFinalDropPositions = (
  sourceTree,
  sourceFlatTree,
  destTree,
  flatDestTree,
  dragState
) => {
  const {source, destination, combine, horizontalLevel} = dragState;
  const sourcePath = getSourcePath(sourceFlatTree, source.index);
  const sourcePosition = getTreePosition(sourceTree, sourcePath);

  if (combine) {
    return {
      sourcePosition,
      destinationPosition: {
        parentId: combine.draggableId
      }
    };
  }

  if (!destination) {
    return {sourcePosition, destinationPosition: null};
  }

  const destinationPath =
    sourceTree === destTree
      ? getDestinationPath(
      flatDestTree,
      source.index,
      destination.index,
      horizontalLevel
      )
      : getGraftDestinationPath(
      flatDestTree,
      destination.index,
      horizontalLevel
      );
  const destinationPosition = {
    ...getTreePosition(destTree, destinationPath)
  };
  return {sourcePosition, destinationPosition};
};

export const getGraftDestinationPath = (
  flattenedTree,
  destinationIndex,
  level
) => {
  const upperPath =
    flattenedTree[destinationIndex - 1] &&
    flattenedTree[destinationIndex - 1].path;
  const lowerPath =
    flattenedTree[destinationIndex] && flattenedTree[destinationIndex].path;

  if (!lowerPath && !upperPath) return [0];

  if (lowerPath && isTopOfSubtree(upperPath, lowerPath)) {
    return lowerPath;
  }

  if (upperPath && lowerPath && hasSameParent(upperPath, lowerPath)) {
    return lowerPath;
  }

  if (upperPath) {
    const finalLevel = calculateFinalLevel(
      upperPath,
      lowerPath,
      undefined,
      level
    );
    const previousPathOnTheFinalLevel = getPathOnLevel(upperPath, finalLevel);

    const finalPath = moveAfterPath(
      previousPathOnTheFinalLevel,
      previousPathOnTheFinalLevel
    );

    return finalPath;
  }
};

const calculateFinalLevel = (
  upperPath,
  lowerPath,
  sourcePath,
  level
): number => {
  const upperLevel: number = upperPath.length;
  const lowerLevel: number = lowerPath ? lowerPath.length : 1;
  const sourceLevel: number = sourcePath && sourcePath.length;

  if (typeof level === "number") {
    return between(lowerLevel, upperLevel, level);
  }
  return sourceLevel && sourceLevel <= lowerLevel ? lowerLevel : upperLevel;
};
