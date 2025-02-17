import { create } from "zustand";
import axios from "axios";

const useFileStore = create((set) => ({
    files: [],
    currentFolderId: "root",

    // Fetch all files
    fetchFiles: async () => {
        try {
            const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL);
            set({ files: res.data, currentFolderId: null });  // Ensure home directory starts at root
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    },


    // Create a file or folder
    createFile: async (name, type, parentId) => {
        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL, { name, type, parentId });
            set((state) => ({ files: [...state.files, res.data] }));
        } catch (error) {
            console.error("Error creating file:", error);
        }
    },

    // Rename a file/folder
    renameFile: async (id, name) => {
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${id}`, { name });
            set((state) => ({
                files: state.files.map((file) => (file._id === id ? res.data : file)),
            }));
        } catch (error) {
            console.error("Error renaming file:", error);
        }
    },

    // Delete a file/folder
    deleteFile: async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${id}`);
            set((state) => ({ files: state.files.filter((file) => file._id !== id) }));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    },

    // Move a file/folder to a new parent folder
    moveFile: async (id, newParentId) => {
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/${id}/move`,  // ✅ Correct endpoint
                { parentId: newParentId }
        );

            set((state) => ({
                files: state.files.map((file) =>
                    file._id === id ? { ...file, parentId: newParentId } : file
                ),
            }));

            console.log("Moved the file:", res.data);
        } catch (error) {
            console.error("Error moving file:", error);
        }
    },

    // Update file content
    updateFileContent: async (fileId, newContent) => {
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${fileId}/content`, { content: newContent });

            set((state) => ({
                files: state.files.map((file) =>
                    file._id === fileId ? { ...file, content: newContent } : file
                ),
            }));

            console.log("Updated file content:", res.data);
        } catch (error) {
            console.error("Error updating file content:", error);
        }
    },

    // Set the current folder
    setCurrentFolder: (folderId) => {
        set({ currentFolderId: folderId });
    },
}));

export default useFileStore;


