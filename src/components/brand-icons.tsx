import * as React from "react";
import { siGithub, siX } from "simple-icons";

type IconProps = React.SVGProps<SVGSVGElement>;

function BrandIcon({
  path,
  className,
  ...props
}: IconProps & { path: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return <BrandIcon path={siGithub.path} {...props} />;
}

export function XIcon(props: IconProps) {
  return <BrandIcon path={siX.path} {...props} />;
}

/**
 * LinkedIn was removed from `simple-icons` following a brand request.
 * This inline path is the standard 24×24 LinkedIn mark used across the web.
 */
export function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}