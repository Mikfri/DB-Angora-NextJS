// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalContextMenu.tsx
'use client';

import React, { useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaHeading,
  FaQuoteLeft,
  FaImage,
  FaFont
} from "react-icons/fa";

interface ContextMenuProps {
    x: number;
    y: number;
    onFormat: (type: string) => void;
    onClose?: () => void;
}

const MENU_HEIGHT = 220; // Justér hvis nødvendigt

export function ContextMenu({ x, y, onFormat, onClose }: ContextMenuProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            const handleClick = () => onClose?.();
            window.addEventListener("mouseup", handleClick);
            return () => window.removeEventListener("mouseup", handleClick);
        }, 150);
        return () => clearTimeout(timer);
    }, [onClose]);

    const btnStyle = {
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        background: "none",
        border: "none",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 12,
        textAlign: "left" as const,
        transition: "background 0.15s"
    };

    return (
        <div
            style={{
                position: "absolute",
                top: Math.max(y - MENU_HEIGHT, 0),
                left: x,
                zIndex: 1000,
                background: "#222",
                borderRadius: 6,
                boxShadow: "0 2px 8px #0008",
                padding: 8,
                minWidth: 160,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
            onContextMenu={e => e.preventDefault()}
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()} // <-- TILFØJ DENNE!
        >
            <button style={btnStyle} onClick={() => { console.log("Klik på bold i menu"); onFormat("bold"); onClose?.(); }}>
                <FaBold style={{ marginRight: 8 }} /> Fed
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på italic i menu"); onFormat("italic"); onClose?.(); }}>
                <FaItalic style={{ marginRight: 8 }} /> Kursiv
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på underline i menu"); onFormat("underline"); onClose?.(); }}>
                <FaUnderline style={{ marginRight: 8 }} /> Understreg
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på bullet i menu"); onFormat("bullet"); onClose?.(); }}>
                <FaListUl style={{ marginRight: 8 }} /> Punktliste
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på number i menu"); onFormat("number"); onClose?.(); }}>
                <FaListOl style={{ marginRight: 8 }} /> Nummereret liste
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på h1 i menu"); onFormat("h1"); onClose?.(); }}>
                <FaHeading style={{ marginRight: 8 }} /> H1
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på h2 i menu"); onFormat("h2"); onClose?.(); }}>
                <FaHeading style={{ marginRight: 8 }} /> H2
            </button>
            <button style={btnStyle} onClick={() => { console.log("Klik på h3 i menu"); onFormat("h3"); onFormat("h3"); onClose?.(); }}>
                <FaHeading style={{ marginRight: 8 }} /> H3
            </button>
            <button style={btnStyle} onClick={() => { onFormat("normal"); onClose?.(); }}>
              <FaFont style={{ marginRight: 8 }} /> Normal
            </button>
            <button style={btnStyle} onClick={() => { onFormat("quote"); onClose?.(); }}>
              <FaQuoteLeft style={{ marginRight: 8 }} /> Citat
            </button>
            <button style={btnStyle} onClick={() => { onFormat("image"); onClose?.(); }}>
              <FaImage style={{ marginRight: 8 }} /> Billede
            </button>
        </div>
    );
}