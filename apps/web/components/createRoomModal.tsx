"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./ui/animated-modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createRoom } from "@/lib/roomUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateRoomModal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  
  const handleCreateRoom = async () => {
    try {
      console.log("Creating room with data:", { name, slug, description, password });
      const response = await createRoom({ name, slug, description, password });
      console.log("Room created:", response);
      toast.success("Room created successfully");
      router.push(`/room/${response.roomSlug}`);
      // Reset form
      setName("");
      setSlug("");
      setDescription("");
      setPassword("");
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
    }
  };
  
  return (
    <div className="py-40  flex items-center justify-center">
      <Modal>
        <ModalTrigger className="cursor-pointer bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Create Board
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            ✈️📝
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Create a new{" "}
              <span className="px-1 py-0.5 text-amber-800 dark:text-amber-400 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                Board
              </span>{" "}
              now! 📝
            </h4>
            <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start">
              {/* we have to create a form here */}
              <div className="flex flex-col gap-4 w-full">
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter the board's name" 
                  className="w-full shadow-2xl shadow-amber-200" 
                />
                <Input 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="Enter the board's slug" 
                  className="w-full shadow-2xl shadow-amber-200" 
                />
                <Input 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter an optional description" 
                  className="w-full shadow-2xl shadow-amber-200" 
                />
                <Input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter an optional password" 
                  className="w-full shadow-2xl shadow-amber-200" 
                />
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <Button className="px-2 py-1 hover:bg-amber-200 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRoom} 
              disabled={!name.trim() || !slug.trim()}
              className="bg-amber-800 text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create now
            </Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}