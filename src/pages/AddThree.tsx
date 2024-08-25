import { MinusOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { useState } from "react";
import { nanoid } from "nanoid";
import { ThreeHelper } from "../helpers/three-helpers";
import { httpClient } from "../api/http-client";
import { toast } from "react-toastify";

export type Tree = {
  id: string;
  key: string;
  children: Tree[];
};

const initialState: Tree = {
  id: nanoid(10),
  key: "",
  children: [],
};

const ThreeNode = ({
  node,
  setState,
}: {
  node: Tree;
  setState: React.Dispatch<React.SetStateAction<Tree[]>>;
}) => {
  const updateKey = (newKey: string) => {
    setState((prevState) =>
      prevState.map((tree) => {
        const updateNode = (t: Tree): Tree => {
          if (t.id === node.id) {
            return { ...t, key: newKey };
          }
          return { ...t, children: t.children.map(updateNode) };
        };
        return updateNode(tree);
      })
    );
  };

  const addChild = () => {
    setState((prevState) =>
      prevState.map((tree) => {
        const addNode = (t: Tree): Tree => {
          if (t.id === node.id) {
            return {
              ...t,
              children: [
                ...t.children,
                { id: nanoid(10), key: "", children: [] },
              ],
            };
          }
          return { ...t, children: t.children.map(addNode) };
        };
        return addNode(tree);
      })
    );
  };

  const removeNode = () => {
    setState(
      (prevState) =>
        prevState
          .map((tree) => {
            const removeNodeById = (t: Tree): Tree | null => {
              if (t.id === node.id) {
                return null;
              }
              return {
                ...t,
                children: t.children
                  .map(removeNodeById)
                  .filter((child) => child !== null) as Tree[],
              };
            };
            return removeNodeById(tree);
          })
          .filter((tree) => tree !== null) as Tree[]
    );
  };

  return (
    <div style={{ marginLeft: 20 }}>
      <Space direction="vertical">
        <Input
          placeholder="Digite o nome"
          value={node.key}
          onChange={(e) => updateKey(e.target.value)}
          addonAfter={
            <Button onClick={addChild}>
              <PlusOutlined />
            </Button>
          }
        />
        <Button onClick={removeNode} type="primary" danger>
          <MinusOutlined />
        </Button>
      </Space>
      {node.children.map((child) => (
        <ThreeNode key={child.id} node={child} setState={setState} />
      ))}
    </div>
  );
};

export const AddThree = () => {
  const [state, setState] = useState<Tree[]>([initialState]);

  const addRootNode = () => {
    setState((prevState) => [
      ...prevState,
      { id: nanoid(10), key: "", children: [] },
    ]);
  };
  const [fileName, setFileName] = useState("");
  const handleSaveFile = async () => {
    const formatted = ThreeHelper.formatStateTreeToObject(state);
    const { success } = await httpClient.post("files", {
      filename: fileName,
      data: formatted,
    });
    if (success) {
      toast;
      setState([initialState]);
      setFileName("");
      toast.success("Arquivo salvo com sucesso");
    } else {
      toast.error("Falha ao salvar arquivo");
    }
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h3>Criar nova árvore</h3>
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Input
            placeholder="nome do arquivo"
            value={fileName}
            onChange={(v) => setFileName(v.target.value)}
          />
          <Button onClick={handleSaveFile}>Salvar arquivo</Button>
        </Space>
        <Button
          type="dashed"
          onClick={addRootNode}
          icon={<PlusOutlined />}
          style={{ marginBottom: 20 }}
        >
          Adicionar Nível 0
        </Button>
        <Form>
          {state.map((node) => (
            <div style={{ marginTop: 10 }}>
              <ThreeNode key={node.id} node={node} setState={setState} />
            </div>
          ))}
        </Form>
      </Space>
    </>
  );
};
