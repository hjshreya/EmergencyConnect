import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
            { title: "EmergencyConnect" },
                  { name: "description", content: "Find nearby emergency services and raise requests when seconds matter." },
                  { property: "og:title", content: "EmergencyConnect" },
                  { property: "og:description", content: "Find nearby emergency services and raise requests when seconds matter." },
                ],
              }),
              component: Index,
            });
function Index() {
  useEffect(() => {
    window.location.replace("/app.html");
  }, []);
  return null;
}
