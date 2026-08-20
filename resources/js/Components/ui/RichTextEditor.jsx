import ReactQuill from "react-quill-new";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
    ],
};

export default function RichTextEditor({
    value = "",
    onChange,
    errorMessage,
    height = "160px",
    placeholder = "",
    className = "",
    readOnly = false,
}) {
    return (
        <>
            <ReactQuill
                className={`rich-text-editor ${className}`.trim()}
                theme="snow"
                modules={modules}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                modules={readOnly ? { toolbar: false } : modules}
                placeholder={placeholder}
                style={{ "--rich-editor-height": height }}
            />
            {errorMessage && <div className="text-danger small mt-2">{errorMessage}</div>}
        </>
    );
}
