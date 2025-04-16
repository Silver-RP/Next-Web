import Head from "next/head";

interface HeadProps {
  title?: string;
}

export default function HeadComponent({ title = "Silver Shop" }: HeadProps) {
  return (
    <Head>
      <title>{title} | Silver Shop</title>

      <meta charSet="utf-8" />
      <meta name="author" content="themesflat.com" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

      {/* Favicon */}
      <link rel="shortcut icon" href="/assets/app/images/nar-eys1.jpeg" />
      <link rel="apple-touch-icon-precomposed" href="/assets/app/images/nar-eys1.jpeg" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"></link>
    </Head>
  );
}
