// components/NavLink.jsx
'use client';

import { useTransitionRouter } from '@/hooks/useTransitionRouter';

export default function NavLink({ href, children, className, ...props }) {
  const { navigate } = useTransitionRouter();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
