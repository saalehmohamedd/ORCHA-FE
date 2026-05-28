"use client";

import { use, type ComponentType } from "react";
import { Builder } from "../../../../components/builder";

type CanvasPageProps = {
  params: Promise<{ id: string }>;
};

type BuilderWithFlowIdProps = {
  user: { id: string; email: string };
  onLogout: () => void;
  flowId: string;
};

const BuilderWithFlowId = Builder as unknown as ComponentType<BuilderWithFlowIdProps>;

export default function CanvasPage({ params }: CanvasPageProps) {
  const { id } = use(params);

  return <BuilderWithFlowId flowId={id} user={{ id: "", email: "" }} onLogout={() => undefined} />;
}
