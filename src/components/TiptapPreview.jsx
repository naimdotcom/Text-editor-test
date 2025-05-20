import { useCurrentEditor } from "@tiptap/react";

const EditorJSONPreview = () => {
  const { editor } = useCurrentEditor();

  return <pre>{JSON.stringify(editor.getJSON())}</pre>;
};

export default EditorJSONPreview;
