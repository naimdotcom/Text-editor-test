import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";

import { useCallback, useEffect, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Image from "@tiptap/extension-image";

import { ImageIcon } from "lucide-react";
import TiptapHeaderButton from "./TiptapHeaderButton";
import { uploadBlog } from "../utils/upload";

const Tiptap = ({ setEditor }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      StarterKit.configure({ history: true }),
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3, 4],
        HTMLAttributes: { class: "font-semibold" },
      }),
      Bold,
      OrderedList,
      BulletList,
      ListItem,
      Code,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full h-auto",
        },
      }),
    ],
    content: `<h1 class="text-2xl font-bold">Welcome</h1><p>Start editing...</p>`,
  });
  const imageFilesRef = useRef([]);
  const fileInputRef = useRef(null);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        imageFilesRef.current.push({ file, preview: imageUrl }); // Save file with preview URL
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    },
    [editor]
  );
  if (!editor) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border border-zinc-300 bg-white rounded-lg shadow-sm">
        {[1, 2, 3, 4].map((level) => (
          <TiptapHeaderButton
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            isActive={editor.isActive("heading", { level })}
          >
            H{level}
          </TiptapHeaderButton>
        ))}

        <TiptapHeaderButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          Bold
        </TiptapHeaderButton>
        <TiptapHeaderButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          Italic
        </TiptapHeaderButton>
        <TiptapHeaderButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          Code
        </TiptapHeaderButton>

        {/* File Upload Button */}
        <div>
          <button
            onClick={handleOpenFileDialog}
            className="px-2 py-1 rounded-md border border-zinc-300 bg-white hover:bg-zinc-100 transition"
          >
            <ImageIcon size={18} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <TiptapHeaderButton onClick={addImage}>Image</TiptapHeaderButton>

        <TiptapHeaderButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          • List
        </TiptapHeaderButton>
        <TiptapHeaderButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          1. List
        </TiptapHeaderButton>
      </div>

      {/* Editor Area */}
      <div className="mt-4 border border-zinc-300 rounded-md p-4 bg-white shadow-sm">
        <EditorContent
          editor={editor}
          className="prose max-w-none prose-zinc [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-1 [&_p]:mb-2"
        />
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bg-white border border-zinc-300 shadow-sm rounded px-2 py-1 text-sm"
      >
        {/* <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 hover:bg-zinc-100 rounded"
        >
          • Bullet List
        </button> */}
      </FloatingMenu>

      {/* Bubble Menu */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bg-white border border-zinc-300 shadow-sm rounded px-2 py-1 flex gap-2 text-sm"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 hover:bg-zinc-100 rounded"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 hover:bg-zinc-100 rounded"
        >
          Italic
        </button>
      </BubbleMenu>

      {/* upload  */}
      <div>
        <button
          onClick={async () => {
            await uploadBlog({
              editor,
              imageFiles: imageFilesRef.current, // Pass stored images
            });
          }}
          className="px-2 py-1 rounded-md border w-full mt-3 border-zinc-300 bg-white hover:bg-zinc-100 transitions"
        >
          upload
        </button>
      </div>
      {/* Rendered Output */}
      <div className="mt-6 border border-zinc-300 rounded-md p-4 bg-white shadow-sm prose prose-zinc max-w-none">
        {editor.getHTML()}
      </div>
    </div>
  );
};

export default Tiptap;
