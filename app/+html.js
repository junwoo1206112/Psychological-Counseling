import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';

export default function Root({ children }) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();

  return (
    <html lang="ko" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#2C6E63" />
        <meta name="color-scheme" content="light" />
        <meta
          name="description"
          content="검증된 PHQ-9, PHQ-A, GAD-7, ASQ로 우울·자살 위험을 자가 선별하고 전문가 연결을 안내합니다."
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="stylesheet" href="/global.css" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="마음 체크" />
        <ScrollViewStyleReset />
        <script src="/bootstrap.js" defer />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        <a className="skip-link" href="#root">본문으로 건너뛰기</a>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
