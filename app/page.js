"use client";
import { useState } from "react";
import FileTree from "./components/FileTree";
import useFileStore from "./context/FileContext";
import { Container, Typography, Button } from "@mui/material";
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export default function HomePage() {
  const [currentParent, setCurrentParent] = useState(null);

  return (
      <DndProvider backend={HTML5Backend}>

      <Container maxWidth="md" style={{ marginTop: "40px" }}>
        {/* File Directory */}
        <FileTree parentId={currentParent} setCurrentParent={setCurrentParent} />
      </Container>
</DndProvider>
  );
}
