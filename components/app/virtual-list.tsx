"use client";

import { cloneElement, type CSSProperties, type ReactElement, type UIEvent, useEffect, useMemo, useRef, useState } from "react";

type VirtualListProps<T> = {
  items: readonly T[];
  rowHeight: number;
  maxHeight: number;
  getKey: (item: T) => string;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactElement;
  overscan?: number;
  ariaLabel: string;
};

export function VirtualList<T>({ items, rowHeight, maxHeight, getKey, renderItem, overscan = 5, ariaLabel }: VirtualListProps<T>) {
  const container = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(maxHeight);
  const height = Math.min(maxHeight, items.length * rowHeight);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setViewportHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const maximum = Math.max(0, items.length * rowHeight - height);
    if (element.scrollTop > maximum) element.scrollTop = maximum;
  }, [height, items.length, rowHeight]);

  const range = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const end = Math.min(items.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
    return { start, end };
  }, [items.length, overscan, rowHeight, scrollTop, viewportHeight]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setScrollTop(event.currentTarget.scrollTop);
  }

  return (
    <div ref={container} className="image-list" style={{ height }} onScroll={handleScroll} role="list" aria-label={ariaLabel}>
      <div className="virtual-list-spacer" style={{ height: items.length * rowHeight }}>
        {items.slice(range.start, range.end).map((item, offset) => {
          const index = range.start + offset;
          return cloneElement(renderItem(item, index, {
            position: "absolute",
            insetInline: 0,
            top: index * rowHeight,
            height: rowHeight,
          }), { key: getKey(item) });
        })}
      </div>
    </div>
  );
}
