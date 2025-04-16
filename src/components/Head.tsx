import Head from "next/head";

interface HeadProps {
  title?: string;
}

const PageHead = ({ title = "Silver Shop" }: HeadProps) => {
  return (
    <Head>
      <title>{title} | Silver Shop</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
      <meta name="author" content="Silver Shop" />

      <link rel="shortcut icon" href="/assets/app/images/nar-eys1.jpeg" type="image/x-icon" />

      <link rel="preconnect" href="https://fonts.gstatic.com/" />
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet" />
    </Head>
  );
};

export default PageHead;
