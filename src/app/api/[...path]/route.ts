import { handleMockApi } from "@/server/mock/service";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    path?: string[];
  };
};

const handler = async (request: NextRequest, context: RouteContext) =>
  handleMockApi(request, context.params.path ?? []);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
