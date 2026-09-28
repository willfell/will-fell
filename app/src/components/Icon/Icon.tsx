import { FC, memo } from "react";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  svgRef?: React.Ref<SVGSVGElement>;
}

const Icon: FC<IconProps> = memo(
  ({ children, className, svgRef, transform, ...props }) => (
    <svg
      className={className}
      fill="currentColor"
      ref={svgRef}
      transform={transform}
      viewBox="0 0 128 128"
      width="128"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  ),
);

Icon.displayName = "Icon";
export default Icon;
