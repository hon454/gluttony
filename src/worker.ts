// 글러트니 Worker 진입점.
// 0001에서는 상태 확인만 한다. 텔레그램 웹훅은 0002-capture에서 붙인다.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return new Response("ok");
    }
    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
