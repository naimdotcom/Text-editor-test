function TiptapHeaderButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        isActive
          ? "bg-black text-white"
          : "bg-white text-black border border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

export default TiptapHeaderButton;
