import { cloneElement, ReactElement } from 'react';

export function addClassName(element: ReactElement, className: string) {
  return cloneElement(element,
      {className: `${element.props.className} ${className}`});
}

export function classNames(classesObject: any): string {
  return Object.keys(classesObject).reduce<string>((acc, key) => {
    if (classesObject[key]) {
      return `${acc} ${key}`;
    }
    return acc;
  }, '');
}
