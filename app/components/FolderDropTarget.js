"use client";
import { useDrop } from "react-dnd";
import { Folder } from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";

export default function FolderDropTarget({ folder, moveFile }) {
    const [{ isOver }, drop] = useDrop({
        accept: "FILE",
        drop: async (item) => {
            console.log("Dropped item:", item);
            console.log("Target folder ID:", folder._id);

            if (item.id !== folder._id) {
                await moveFile(item.id, folder._id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <ListItem ref={drop} style={{ backgroundColor: isOver ? "#f0f0f0" : "transparent" }}>
            <Folder color="primary" />
            <ListItemText primary={folder.name} />
        </ListItem>
    );
}
