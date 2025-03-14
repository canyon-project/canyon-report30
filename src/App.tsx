// @ts-nocheck
import Report from "canyon-report";
import React, { useEffect, useState } from "react";

// 加载summary数据
// @ts-ignore
const dataSource = window.data;
const reportName = window.reportName;
const date = window.date;
// 重要
// 通过动态引入js文件的方式加载数据，避免全量覆盖率source文件的加载导致内存占用过大。加载完成后，删除全局变量
const dynamicLoadingSource = (val) => {
  return new Promise((resolve) => {
    // 1.检查是否是文件
    if (!val.includes(".")) {
      resolve({
        fileCoverage: undefined,
        fileContent: undefined,
        fileCodeChange: [],
      });
    } else {
      const script = document.createElement("script");
      script.src = `dynamic-data/${val}.js`;
      script.onload = () => {
        resolve({
          // @ts-ignore
          fileCoverage: window[val].coverage,
          // @ts-ignore
          fileContent: window[val].content,
          fileCodeChange: [],
        });
        document.body.removeChild(script);
        window[val] = undefined;
      };
      document.body.appendChild(script);
    }
  });
};

function App() {
  const [value, setValue] = useState(window.location.hash.slice(1));
  const onSelect = (val) => {
    window.location.hash = val;
    return dynamicLoadingSource(val).then((r) => {
      setValue(val);
      return r;
    });
  };

  return (
      <div className={"p-[10px] pb-0"}>
        <div style={{ minHeight: "calc(100vh - 48px)" }}>
          <Report
              name={reportName}
              dataSource={dataSource.reduce((acc, cur) => {
                acc[cur.path] = cur;
                return acc;
              }, {})}
              onSelect={onSelect}
              value={value}
          />
        </div>
        <footer
            style={{ color: "rgba(0,0,0,0.5)", fontSize: "12px" }}
            className={"text-center p-[10px]"}
        >
          Code coverage generated by{" "}
          <a
              href="https://github.com/canyon-project/canyon/"
              target="_blank"
              rel="noreferrer"
          >
            canyon
          </a>{" "}
          at {date}
        </footer>
      </div>
  );
}

export default App;
