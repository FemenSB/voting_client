import { assert } from '../../utils/assert';
import styles from './candidate_list.style.module.css';
import React, { useRef, useState } from 'react';

const DROP_EFFECT = 'move';

type DragEventTypes = React.DragEvent | DragEvent;
type TouchEventTypes = React.TouchEvent | TouchEvent;

class GenericDragEvent {
  target: EventTarget | null;
  clientX: number;
  clientY: number;
  private isTouch_: boolean;
  private originalEvent_: DragEventTypes | TouchEventTypes;

  static fromTouch(event: TouchEventTypes): GenericDragEvent {
    return new GenericDragEvent(undefined, event);
  }
  
  static fromDrag(event: DragEventTypes): GenericDragEvent {
    return new GenericDragEvent(event, undefined);
  }

  private constructor(
      dragEvent?: DragEventTypes, touchEvent?: TouchEventTypes) {
    assert(dragEvent || touchEvent,
        'GenericDragEvent cannot be instantiated witout an event');

    this.originalEvent_ = (dragEvent ?? touchEvent)!;
    this.target = this.originalEvent_.target;
    this.isTouch_ = !!touchEvent;

    if (this.isTouch_) {
      this.clientX = touchEvent!.touches[0]?.clientX
          || touchEvent!.changedTouches[0].clientX;
      this.clientY = touchEvent!.touches[0]?.clientY
          || touchEvent!.changedTouches[0].clientY;
    } else {
      this.clientX = dragEvent!.clientX;
      this.clientY = dragEvent!.clientY;
    }
  }

  get dataTransfer() {
    if (this.isTouch_) {
      return null;
    }
    return (this.originalEvent_ as DragEventTypes).dataTransfer;
  }

  preventDefault() {
    this.originalEvent_.preventDefault();
  }
};

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

function computeDragOffset(e: GenericDragEvent): Point {
  const draggedRect = (e.target as HTMLElement).getBoundingClientRect();
  return {
    x: draggedRect.left - e.clientX,
    y: draggedRect.top - e.clientY,
  };
}

function elementCoordinates(element: HTMLElement): Point {
  const rect = element.getBoundingClientRect();
  return {x: rect.left, y: rect.top};
}

function removeDragImage(e: GenericDragEvent) {
  e.dataTransfer?.setDragImage(new Image(), 0, 0);
}

function setDragPointer(e: GenericDragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = DROP_EFFECT;
  }
}

type CandidateListProps = {
  candidates: string[];
  onReordered: (reorderedCandidates: string[]) => void;
  locked: boolean;
};

export default function CandidateList(
    { candidates, onReordered, locked }: CandidateListProps) {
  const candidateElementsRefs = useRef<Array<HTMLDivElement|null>>([]);
  const listElementRef = useRef<HTMLDivElement|null>(null);
  const [orderedCandidates, setOrderedCandidates] = useState(candidates);
  let dragElement: HTMLElement;
  let dragElementIndex: number;
  let rectsBeforeDrag: DOMRect[];
  let dragOffset: Point;
  let containerOffset: Point;

  function onDragStart(e: React.DragEvent) {
    const genericEvent = GenericDragEvent.fromDrag(e);
    startDrag(genericEvent);
  }

  function onTouchStart(e: React.TouchEvent) {
    const genericEvent = GenericDragEvent.fromTouch(e);
    startDrag(genericEvent)
  }

  function startDrag(e: GenericDragEvent) {
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('touchmove', onTouchMove);
    saveDragStartState();
    removeDragImage(e);
    setDragPointer(e);

    function saveDragStartState() {
      rectsBeforeDrag = computeCandidateRects();
      dragElement = e.target as HTMLElement;
      dragElementIndex = indexAt(
          {x: e.clientX, y: e.clientY});
      dragOffset = computeDragOffset(e);
      containerOffset = elementCoordinates(listElementRef.current!);
    }
  }
  
  function computeCandidateRects(): DOMRect[] {
    return candidateElementsRefs.current.map(el => el!.getBoundingClientRect());
  }

  function onDragOver(e: DragEvent) {
    const genericEvent = GenericDragEvent.fromDrag(e);
    performDrag(genericEvent);
  }

  function onTouchMove(e: TouchEvent) {
    const genericEvent = GenericDragEvent.fromTouch(e);
    performDrag(genericEvent);
  }

  function performDrag(e: GenericDragEvent) {
    setPositions(e);
    setDraggedPosition(e);
    setDragPointer(e);
    e.preventDefault();
  }

  function setPositions(e: GenericDragEvent) {
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
      const indexPosition = {
        x: indexRect.x - containerOffset.x,
        y: indexRect.y - containerOffset.y
      };
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

  function setDraggedPosition(e: GenericDragEvent) {
    setPosition(dragElement, {
      x: e.clientX + dragOffset.x - containerOffset.x,
      y: e.clientY + dragOffset.y - containerOffset.y
    });
  }

  function indexAt(position: Point): number {
    return rectsBeforeDrag.findIndex(rect =>
        rect.left <= position.x && rect.right >= position.x &&
            rect.top <= position.y && rect.bottom >= position.y);
  }

  function onDragEnd(e: React.DragEvent) {
    const genericEvent = GenericDragEvent.fromDrag(e);
    endDrag(genericEvent);
  }

  function onTouchEnd(e: React.TouchEvent) {
    const genericEvent = GenericDragEvent.fromTouch(e);
    endDrag(genericEvent);
  }

  function endDrag(e: GenericDragEvent) {
    const dropIndex = indexAt({x: e.clientX, y: e.clientY});
    if (validDropPosition(dropIndex)) {
      moveDroppedCandidateTo(dropIndex);
    }
    resetElementPositions();
    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('touchmove', onTouchMove);

    function validDropPosition(index: number): boolean {
      return index !== -1;
    }
    
    function moveDroppedCandidateTo(index: number) {
      const reordered = moveIndexTo(orderedCandidates, dragElementIndex, index);
      setOrderedCandidates(reordered);
      onReordered(reordered);

      function moveIndexTo<T>(array: T[], from: number, to: number): T[] {
        const result = [...array];
        const movedItem = result[from];
        result.splice(from, 1);
        result.splice(to, 0, movedItem);
        return result;
      }
    }

    function resetElementPositions() {
      candidateElementsRefs.current.forEach(el => resetPosition(el!));
    }
  }

  return (
    <div id={styles['candidate-list']} className={locked ? styles.locked : ''}
        ref={listElementRef}>
      {orderedCandidates.map((name, i) =>
        <div id={styles['candidate']} key={i} draggable={!locked}
            ref={el => candidateElementsRefs.current[i] = el}
            onDragStart={onDragStart} onDragEnd={onDragEnd}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {name}
        </div>
      )}
    </div>
  );
}
