import './candidate_list.style.css'

import { DragEvent, useEffect, useRef } from 'react';

const DROP_EFFECT = 'move';

type Point = {
  x: number;
  y: number;
};

function indexInRange(index: number, range: {a: number, b: number}): boolean {
  return (range.a <= index && range.b >= index) ||
      (range.b <= index && range.a >= index);
}

function setPosition(element: HTMLElement, coordinates: Point) {
  element.style.position = 'absolute';
  element.style.left = `${coordinates.x}px`;
  element.style.top = `${coordinates.y}px`;
}

function resetPosition(element: HTMLElement) {
  element.style.position = 'relative';
  element.style.left = '';
  element.style.top = '';
}

function computeDragOffset(e: DragEvent<HTMLElement>): Point {
  const draggedRect = (e.target as HTMLElement).getBoundingClientRect();
  return {
    x: draggedRect.left - e.clientX,
    y: draggedRect.top - e.clientY,
  };
}

function removeDragImage(e: DragEvent<HTMLElement>) {
  e.dataTransfer.setDragImage(new Image(), 0, 0);
}

function setDragPointer(e: DragEvent<HTMLElement>) {
  e.dataTransfer!.dropEffect = DROP_EFFECT;
}

type CandidateListProps = {
  candidates: string[];
};

export default function CandidateList({ candidates }: CandidateListProps) {
  const candidateElementsRefs = useRef<Array<HTMLDivElement|null>>([]);
  let dragElement: HTMLElement;
  let dragElementIndex: number;
  let rectsBeforeDrag: DOMRect[];
  let dragOffset: Point;

  useEffect(() => {
    document.addEventListener('dragover',
        onDragOver as unknown as EventListener);
    return () => {
      document.removeEventListener('dragover',
          onDragOver as unknown as EventListener);
    }
  }, []);

  function onDragStart(e: DragEvent<HTMLDivElement>) {
    dragElement = e.target as HTMLElement;
    dragElementIndex = candidateElementsRefs.current.findIndex(
        el => el === dragElement);
    dragOffset = computeDragOffset(e);
    rectsBeforeDrag = computeCandidateRects();
    removeDragImage(e);
    setDragPointer(e);
  }
  
  function computeCandidateRects(): DOMRect[] {
    return candidateElementsRefs.current.map(el => el!.getBoundingClientRect());
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    setPositions(e);
    setDraggedPosition(e);
    setDragPointer(e);
    e.preventDefault();
  }

  function setPositions(e: DragEvent<HTMLDivElement>) {
    const hoveredIndex = indexAt({x: e.clientX, y: e.clientY});
    if (hoveredIndex === -1 || hoveredIndex === dragElementIndex) {
      setOriginalPositions();
    } else {
      setTranslatedPositions();
    }

    function setOriginalPositions() {
      candidateElementsRefs.current.forEach((el, i) => {
        positionElementAtIndex(el!, i);
      });
    }

    function positionElementAtIndex(element: HTMLElement, index: number) {
      const indexRect = rectsBeforeDrag[index];
      const indexPosition = {x: indexRect.x, y: indexRect.y};
      setPosition(element, indexPosition);
    }

    function setTranslatedPositions() {
      const draggingTowardsBottom = hoveredIndex > dragElementIndex;
      const translateOffset = draggingTowardsBottom ? -1 : 1;
      candidateElementsRefs.current.forEach((el, i) => {
        if (i === dragElementIndex) return;
        if (indexInRange(i, {a: dragElementIndex, b: hoveredIndex})) {
          positionElementAtIndex(el!, i + translateOffset);
        } else {
          positionElementAtIndex(el!, i);
        }
      });
    }
  }

  function setDraggedPosition(e: DragEvent<HTMLDivElement>) {
    setPosition(dragElement, {
      x: e.clientX + dragOffset.x,
      y: e.clientY + dragOffset.y
    });
  }

  function indexAt(position: Point): number {
    return rectsBeforeDrag.findIndex(rect =>
        rect.left <= position.x && rect.right >= position.x &&
            rect.top <= position.y && rect.bottom >= position.y);
  }

  function onDragEnd() {
    candidateElementsRefs.current.forEach(el => resetPosition(el!));
  }

  return (
    <div id='candidate-list'>
      {candidates.map((name, i) =>
        <div id='candidate-container' key={i} draggable
            ref={el => candidateElementsRefs.current[i] = el}
            onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {name}
        </div>
      )}
    </div>
  );
}
