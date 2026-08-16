import { jsx } from "react/jsx-runtime";
import { useResumeStore } from "../../store/useResumeStore";
import Modal from "../Modal";
const DocViewerModal = ({ isOpen, onClose, documentUrl }) => {
  const { analysisResult } = useResumeStore();
  const finalUrl = documentUrl || analysisResult?.documentUrl;
  const textContent = analysisResult?.resumeText;
  if (!isOpen || (!finalUrl && !textContent)) return null;
  return /* @__PURE__ */ jsx(Modal, {
    open: isOpen,
    onClose,
    title: "Document Viewer",
    size: "2xl",
    children: /* @__PURE__ */ jsx("div", {
      className: "h-[75vh] w-full",
      children: finalUrl
        ? /* @__PURE__ */ jsx("iframe", {
            src: finalUrl,
            className:
              "w-full h-full rounded-lg border border-base-300 bg-base-100",
            title: "Resume Document",
          })
        : /* @__PURE__ */ jsx("div", {
            className:
              "bg-base-100 p-6 rounded-lg border border-base-300 whitespace-pre-wrap font-mono text-sm shadow-inner h-full overflow-y-auto",
            children: textContent,
          }),
    }),
  });
};
export { DocViewerModal };
