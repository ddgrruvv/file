"use client";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { Folder, InsertDriveFile, Edit, Delete } from "@mui/icons-material";
import useFileStore from "../context/FileContext";

export default function DraggableFile({ file, navigateToFolder, moveFile }) {
    const { renameFile, deleteFile, updateFileContent } = useFileStore();

    // State for rename modal
    const [renameOpen, setRenameOpen] = useState(false);
    const [newName, setNewName] = useState(file.name);

    // State for file content modal
    const [editorOpen, setEditorOpen] = useState(false);
    const [fileContent, setFileContent] = useState(file.content || "");

    // Make file/folder draggable
    const [{ isDragging }, drag] = useDrag({
        type: "FILE_OR_FOLDER",
        item: { id: file._id, type: file.type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Make folder a drop target
    const [{ isOver }, drop] = useDrop({
        accept: "FILE_OR_FOLDER",
        drop: async (item) => {
            console.log("Dropped item:", item);
            console.log("Target folder ID:", file._id);

            if (item.id !== file._id && file.type === "folder") {
                await moveFile(item.id, file._id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    // Open Rename Modal
    const handleRenameOpen = () => setRenameOpen(true);
    const handleRenameClose = () => setRenameOpen(false);

    // Rename File/Folder
    const handleRename = () => {
        if (newName.trim()) {
            renameFile(file._id, newName);
        }
        handleRenameClose();
    };

    // Open File Editor Modal
    const handleEditorOpen = () => setEditorOpen(true);
    const handleEditorClose = () => setEditorOpen(false);

    // Save File Content
    const handleSaveContent = () => {
        updateFileContent(file._id, fileContent);
        handleEditorClose();
    };

    return (
        <>
            {/* File/Folder List Item */}
            <ListItem
                ref={(node) => drag(drop(node))}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    cursor: "pointer",
                    backgroundColor: isOver ? "#f0f0f0" : "transparent",
                }}
                secondaryAction={
                    <>
                        <IconButton onClick={handleRenameOpen}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => deleteFile(file._id)}>
                            <Delete />
                        </IconButton>
                    </>
                }
            >
                {file.type === "folder" ? (
                    <Folder color="primary" onClick={() => navigateToFolder(file._id, file.name)} />
                ) : (
                    <InsertDriveFile color="action" onClick={handleEditorOpen} />
                )}
                <ListItemText
                    primary={file.name}
                    style={{ marginLeft: "10px" }}
                    onClick={() => file.type === "folder" && navigateToFolder(file._id, file.name)}
                />
            </ListItem>

            {/* Rename Modal */}
            <Dialog open={renameOpen} onClose={handleRenameClose}>
                <DialogTitle>Rename {file.type === "folder" ? "Folder" : "File"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Name"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRenameClose} color="secondary">Cancel</Button>
                    <Button onClick={handleRename} color="primary">Rename</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
