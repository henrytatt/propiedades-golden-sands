import type { NextPageContext } from "next";
function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <main style={{maxWidth:720,margin:"40px auto",padding:16,fontFamily:"system-ui"}}>
      <h1 style={{fontSize:28,fontWeight:700}}>Algo salió mal</h1>
      <p>{statusCode ? `Error ${statusCode}` : "Error en el cliente"}</p>
      <a href="/" style={{textDecoration:"underline",color:"#d4af37"}}>Ir al inicio</a>
    </main>
  );
}
ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};
export default ErrorPage;

