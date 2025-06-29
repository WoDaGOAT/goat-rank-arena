
import { ReactNode } from "react";

interface DebugRouteWrapperProps {
  children: ReactNode;
  routeName: string;
}

const DebugRouteWrapper = ({ children, routeName }: DebugRouteWrapperProps) => {
  console.log(`🔍 DebugRouteWrapper: ROUTE RENDER - ${routeName} is being rendered at:`, window.location.pathname);
  console.log(`🔍 DebugRouteWrapper: ROUTE RENDER - Current URL params:`, new URLSearchParams(window.location.search).toString());
  console.log(`🔍 DebugRouteWrapper: ROUTE RENDER - Full URL:`, window.location.href);
  console.log(`🔍 DebugRouteWrapper: ROUTE RENDER - Route name: ${routeName}`);
  return <>{children}</>;
};

export default DebugRouteWrapper;
