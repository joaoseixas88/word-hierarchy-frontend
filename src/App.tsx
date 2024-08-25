import { FileTextOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { AddThree } from "./pages/AddThree";
import { ExistingThrees } from "./pages/ExistingThrees";

const { Header, Content } = Layout;

enum PAGES {
  EXISTING_THREES = "EXISTING_THREES",
  ADD_THREE = "ADD_THREE",
}

const menuItems = [
  {
    key: PAGES.EXISTING_THREES,
    icon: <FileTextOutlined />,
    label: "Arvores",
  },
  {
    key: PAGES.ADD_THREE,
    icon: <FileTextOutlined />,
    label: "Inserir",
  },
];

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [page, setPage] = useState(PAGES.EXISTING_THREES);

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
            style={{ minHeight: "100%" }}
            items={menuItems}
            onClick={(v) => setPage(v.key as PAGES)}
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
          <Content>
            {page === PAGES.EXISTING_THREES && <ExistingThrees />}
            {page === PAGES.ADD_THREE && <AddThree />}
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
