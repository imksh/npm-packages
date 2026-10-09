import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import Modal from "../Modal";

interface DocViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl?: string;
}

export const DocViewerModal = ({ isOpen, onClose, documentUrl }: DocViewerModalProps) => {
  const { analysisResult } = useResumeStore();

  const finalUrl = documentUrl || analysisResult?.documentUrl;
  const textContent = analysisResult?.resumeText;

  if (!isOpen || (!finalUrl && !textContent)) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Document Viewer"
      size="2xl"
    >
      <div className="h-[75vh] w-full">
        {finalUrl ? (
          <iframe
            src={finalUrl}
            className="w-full h-full rounded-lg border border-base-300 bg-base-100"
            title="Resume Document"
          />
        ) : (
          <div className="bg-base-100 p-6 rounded-lg border border-base-300 whitespace-pre-wrap font-mono text-sm shadow-inner h-full overflow-y-auto">
            {textContent}
          </div>
        )}
      </div>
    </Modal>
  );
};
