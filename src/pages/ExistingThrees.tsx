import { Button, Input, Modal, Select, Space } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useEffect, useState } from "react";
import { httpClient } from "../api/http-client";
import { ThreeShower } from "../components/ThreeShower";
import { ThreeHierarchy } from "../helpers/three-helpers";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { DownloadOutlined } from "@ant-design/icons";

type IAnalyzeResponse = {
  amount: number;
  value: string;
}[];

const initialState = {
  depth: 1,
  text: "",
  fileName: null as null | string,
};

export const ExistingThrees = () => {
  const [availableFileNames, setAvailableFileNames] = useState<
    { value: string; label: string }[]
  >([]);
  const [fileData, setFileData] = useState<null | ThreeHierarchy>(null);

  const loadAvailableFiles = async () => {
    const { success, data } = await httpClient.get<string[]>("files");
    if (success) {
      setAvailableFileNames(data.map((v) => ({ value: v, label: v })));
    }
  };
  const [analyzingData, setAnalyzingData] = useState(initialState);

  const handleSelectFile = async (filename: string) => {
    setAnalyzingData((old) => ({ ...old, fileName: filename }));

    const { success, data } = await httpClient.get<ThreeHierarchy>(
      `files/data/${filename}`
    );
    if (success) {
      setFileData(data);
    }
  };

  useEffect(() => {
    loadAvailableFiles();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [analizedText, setAnalizedText] = useState([] as IAnalyzeResponse);

  const handleOpenModal = () => {
    if (!fileData) {
      toast.error("Seleciona um arquivo primeiro");
      return;
    }
    setModalOpen(true);
  };

  const handleInputAnalyzeText = async () => {
    const { data, success } = await httpClient.post<IAnalyzeResponse>("words", {
      depth: analyzingData.depth,
      text: analyzingData.text,
      fileName: analyzingData.fileName,
    });
    if (success) {
      setAnalyzeModalOpen(true);
      setAnalizedText(data);
      setModalOpen(false);
      setAnalyzingData((old) => ({ ...old, depth: 1, text: "" }));
    } else {
      toast.error("Algo deu errado na análise do texto");
    }
  };

  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);

  const handleDownload = async () => {
    if (!analyzingData.fileName) {
      toast.error("Selecione arquivo");
      return;
    }
    const { success } = await httpClient.download(
      `/files/download/${analyzingData.fileName}`,
      analyzingData.fileName
    );
    if (success) {
      return;
    } else {
      toast.error("Erro ao baixar arquivo");
    }
  };
  return (
    <>
      <Space wrap>
        <FormItem>
          <Space>
            <Select
              options={availableFileNames}
              style={{ minWidth: 200 }}
              placeholder="Selecione arquivo"
              onChange={(v) => handleSelectFile(v)}
            />
            <Button onClick={handleDownload}>
              <DownloadOutlined />
            </Button>
            <Button onClick={handleOpenModal}>Analisar Texto</Button>
          </Space>
        </FormItem>
      </Space>
      <div>{fileData && <ThreeShower data={fileData} />}</div>
      <Modal
        title="Digite o texto para analisar"
        centered
        open={modalOpen}
        onOk={handleInputAnalyzeText}
        onCancel={() => setModalOpen(false)}
      >
        <Input
          addonBefore="profundidade"
          style={{ marginBottom: 10 }}
          value={analyzingData.depth}
          type="number"
          onChange={(e) =>
            setAnalyzingData((old) => ({
              ...old,
              depth: Number(e.target.value),
            }))
          }
        />
        <TextArea
          value={analyzingData.text}
          onChange={(e) =>
            setAnalyzingData((old) => ({ ...old, text: e.target.value }))
          }
          placeholder="Texto para análise"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Modal>
      <Modal
        centered
        open={analyzeModalOpen}
        onOk={() => setAnalyzeModalOpen(false)}
        onCancel={() => setAnalyzeModalOpen(false)}
      >
        {analizedText.length &&
          analizedText.map((v) => (
            <div style={{ display: "flex", gap: 5 }}>
              <p>{v.value}: </p>
              <p>{v.amount}; </p>
            </div>
          ))}
      </Modal>
    </>
  );
};
