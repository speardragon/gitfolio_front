import React from "react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import ResumeDocument from "./ResumeDocument";
import { Download } from "lucide-react";
import { ResumeDetailResponse } from "@/app/(home)/community/_hooks/useResumeQuery";

type Props = {
  resume: ResumeDetailResponse;
};

const PdfDownloadButton = ({ resume }: Props) => {
  const downloadPdf = async () => {
    const fileName = `${resume.result.memberName}_이력서_깃트폴리오`;
    const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
    saveAs(blob, fileName);
  };

  return (
    <Button
      className="h-12 w-full justify-between rounded-[20px] bg-white px-4 text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-100"
      onClick={downloadPdf}
    >
      <div className="text-left">PDF로 저장</div>
      <Download size={18} className="text-blue-600" />
    </Button>
  );
};

export default PdfDownloadButton;
