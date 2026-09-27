export const dynamic = "force-dynamic";
export async function GET() { return Response.json({ status: "available", message: "Huff API đang được chuẩn hóa nguồn dữ liệu chính thức." }, { headers: { "Cache-Control": "no-store" } }); }
