import { NextResponse } from "next/server";

export class Response {
  static serverError(
    e: unknown
  ) {
    if (e instanceof Error) {
      return NextResponse.json({
        error: e.message,
        reason: e.cause || "Unknown error"
      }, {
        status: 500
      });
    };

    return NextResponse.json({
      message: "Server error",
      reason: "Unknown error"
    }, {
      status: 500
    });
  };

  static badRequest() {
    return NextResponse.json({
      message: "Missing required fields",
      reason: "Bad request"
    }, {
      status: 400
    });
  };

  static unauthorized() {
    return NextResponse.json({
      message: "Unauthorized",
      reason: "Unauthorized"
    }, {
      status: 401
    });
  };

  static notFound() {
    return NextResponse.json({
      message: "Not found",
      reason: "Not found"
    }, {
      status: 404
    });
  };
}
