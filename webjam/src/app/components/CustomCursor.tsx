"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isOverText, setIsOverText] = useState(false);

  const isOverTextElement = (x: number, y: number) => {
    if (typeof window === "undefined") return false;

    // Try to get the text node at the exact cursor position
    let range: Range | null = null;
    let textNode: Node | null = null;

    // Modern browsers
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
      if (range) {
        textNode = range.startContainer;
      }
    }
    // Fallback for older browsers
    else if ((document as any).caretPositionFromPoint) {
      const caret = (document as any).caretPositionFromPoint(x, y);
      if (caret) {
        textNode = caret.offsetNode;
      }
    }

    // Check if we found a text node with actual text content
    if (textNode) {
      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent || "";
        if (range) {
          const offset = range.startOffset;
          const textBefore = text.substring(0, offset);
          const textAt = text.substring(offset, offset + 1);
          if ((textBefore.trim().length > 0 || textAt.trim().length > 0) && text.trim().length > 0) {
            return true;
          }
        } else {
          if (text.trim().length > 0) {
            return true;
          }
        }
      } else if (textNode.nodeType === Node.ELEMENT_NODE) {
        const element = textNode as Element;
        if (range) {
          const clonedRange = range.cloneRange();
          clonedRange.collapse(true);
          try {
            clonedRange.setStart(clonedRange.startContainer, Math.max(0, clonedRange.startOffset - 1));
            clonedRange.setEnd(clonedRange.endContainer, Math.min(clonedRange.endContainer.textContent?.length || 0, clonedRange.endOffset + 1));
            const textAtPosition = clonedRange.toString().trim();
            if (textAtPosition.length > 0) {
              return true;
            }
          } catch (e) {
            const textContent = element.textContent?.trim();
            if (textContent && textContent.length > 0) {
              return true;
            }
          }
        }
      }
    }

    // Fallback: check if the element at the point is a leaf node with text
    const element = document.elementFromPoint(x, y);
    if (!element) return false;

    // For input/textarea elements, check if they have actual text content
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const value = element.value?.trim();
      if (value && value.length > 0) {
        return true;
      }
    }

    // For contenteditable elements (like Tiptap editor)
    if (element.isContentEditable || element.closest('[contenteditable="true"]')) {
      if (range) {
        const clonedRange = range.cloneRange();
        try {
          const startContainer = clonedRange.startContainer;
          const startOffset = clonedRange.startOffset;
          
          if (startContainer.nodeType === Node.TEXT_NODE) {
            const text = startContainer.textContent || "";
            const charBefore = text.charAt(startOffset - 1);
            const charAt = text.charAt(startOffset);
            if (charBefore.trim() || charAt.trim()) {
              return true;
            }
          }
        } catch (e) {
          // If we can't check, assume no text
        }
      }
      return false;
    }

    // Only consider leaf elements (elements with no child elements, only text)
    const hasChildElements = element.children.length > 0;
    if (!hasChildElements) {
      const textContent = element.textContent?.trim();
      if (textContent && textContent.length > 0) {
        const style = window.getComputedStyle(element);
        if (style.display !== "none" && style.visibility !== "hidden") {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      const overText = isOverTextElement(e.clientX, e.clientY);
      setIsOverText(overText);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="custom-cursor"
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "14px",
        height: "14px",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        mixBlendMode: isOverText ? "normal" : "difference",
        isolation: "isolate",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{ display: "block" }}
      >
        {/* Black border outline */}
        <circle
          cx="7"
          cy="7"
          r="5.5"
          fill="none"
          stroke="black"
          strokeWidth="3.2"
          strokeOpacity="1"
        />
        {/* White circle */}
        <circle
          cx="7"
          cy="7"
          r="5.5"
          fill="none"
          stroke={isOverText ? "white" : "white"}
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

