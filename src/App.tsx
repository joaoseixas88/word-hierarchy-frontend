import { Layout, theme } from "antd";

const { Header, Content } = Layout;

function App() {
  console.log(import.meta.env.VITE_API_URL);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            paddingInlineStart: 100,
          }}
        >
          <h1 style={{ color: "#2a57bf" }}>WaProjetct. Desafio</h1>
        </Header>
        <Content>
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
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
