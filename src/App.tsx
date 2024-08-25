import { FileTextOutlined } from "@ant-design/icons";
import { Layout, Menu, Select, Space, theme } from "antd";
import FormItem from "antd/es/form/FormItem";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { httpClient } from "./api/http-client";
import { ThreeShower } from "./components/ThreeShower";
import { ThreeHierarchy } from "./helpers/three-helpers";

const { Header, Content } = Layout;

const pages = {
  1: "ARVORES_EXISTENTES",
  2: "ADICIONAR_ARVORES",
};
const menuItems = [
  {
    key: 1,
    icon: <FileTextOutlined />,
    label: "Arvores",
  },
  {
    key: 2,
    icon: <FileTextOutlined />,
    label: "Inserir",
  },
];

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [availableFileNames, setAvailableFileNames] = useState<
    { value: string; label: string }[]
  >([]);

  const [page, setPage] = useState(pages["1"]);

  const [fileData, setFileData] = useState<null | ThreeHierarchy>(null);

  const loadAvailableFiles = async () => {
    const { success, data } = await httpClient.get<string[]>("files");
    if (success) {
      setAvailableFileNames(data.map((v) => ({ value: v, label: v })));
    }
  };

  const handleSelectFile = async (filename: string) => {
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

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#2a57bf" }}>WaProjetct. Desafio</h1>
      </Header>

      <Layout
        style={{
          padding: "24px 0",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Sider style={{ background: colorBgContainer }} width={200}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%" }}
            items={menuItems}
            onClick={(v) => console.log(v)}
          />
        </Sider>
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <h3>Analisadore de Hierarquia de Palavras</h3>
          </div>
          <Space wrap>
            <FormItem>
              <Select
                options={availableFileNames}
                style={{ minWidth: 200 }}
                placeholder="Selecione arquivo"
                onChange={(v) => handleSelectFile(v)}
              />
            </FormItem>
          </Space>
          <div>{fileData && <ThreeShower data={fileData} />}</div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
