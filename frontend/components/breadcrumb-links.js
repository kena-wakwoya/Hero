import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import React from 'react';

const _defaultGetDefaultTextGenerator= path => path

export default function BreadCrumbLinks({ getDefaultTextGenerator=_defaultGetDefaultTextGenerator }) {
  const router = useRouter();

  const breadcrumbs = React.useMemo(function generateBreadcrumbs() {
    const asPathWithoutQuery = router.asPath.split("?")[0];
    const asPathNestedRoutes = asPathWithoutQuery.split("/")
                                                 .filter(v => v.length > 0);
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      return { href, text: getDefaultTextGenerator(subpath, href) }; 
    })

    return [{ href: "/", text: "Hero" }, ...crumblist];
  }, [router.asPath, getDefaultTextGenerator]);

  return (
    <Breadcrumbs separator=">" aria-label="breadcrumb">
      {breadcrumbs.map((crumb, idx) => (
        <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
      ))}
    </Breadcrumbs>
  );
}

function Crumb({ text, href, last=false }) {
  if (last) {
    return <Typography color="text.primary">{text}</Typography>
  }

  return (
    <Link underline="hover" color="inherit" href={href}>
      {text}
    </Link>
  );
}