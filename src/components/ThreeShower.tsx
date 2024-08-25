import { ThreeHierarchy } from "../helpers/three-helpers";

type Props = {
  data: ThreeHierarchy;
};

const Dot = () => {
  return (
    <div
      style={{ background: "black", height: 5, width: 5, borderRadius: 5 }}
    ></div>
  );
};

const KeyShow = ({ value }: { value: string }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <Dot />
      <p>{value}</p>
    </div>
  );
};

const getArrayData = (data: string[]) => {
  return (
    <div style={{ marginTop: 1, marginLeft: 30 }}>
      {data.map((val) => (
        <KeyShow value={val} />
      ))}
    </div>
  );
};

const getObjectData = (data: ThreeHierarchy) => {
  const firstData = Object.entries(data);
  return (
    <div style={{ margin: 1 }}>
      {firstData.map(([key, values]) => {
        return (
          <>
            <KeyShow value={key} />
            <div style={{ marginTop: 1, marginLeft: 30 }}>
              {typeof values === "object" &&
                !Array.isArray(values) &&
                getObjectData(values as ThreeHierarchy)}
              {Array.isArray(values) && getArrayData(values)}
            </div>
          </>
        );
      })}
    </div>
  );
};
export const ThreeShower = ({ data }: Props) => {
  const firstData = Object.entries(data);
  return (
    <div style={{ display: "flex", gap: "1rem", marginLeft: '2rem' }}>
      {firstData.map(([key, values]) => {
        return (
          <>
            <div>
              <KeyShow value={key}/> 
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {typeof values === "object" &&
                !Array.isArray(values) &&
                getObjectData(values as ThreeHierarchy)}
              {Array.isArray(values) && getArrayData(values)}
            </div>
          </>
        );
      })}
    </div>
  );
};
