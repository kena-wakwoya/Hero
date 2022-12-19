import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

export { Link };

function Link({ href, children, ...props }) {
  return (
    <NextLink href={href}>
      <MuiLink color="#01041D" href={href} underline="always" {...props}>
        {children}
      </MuiLink>
    </NextLink>
  );
}
