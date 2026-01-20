"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.94 2.5C4.93996 3.01457 4.73569 3.50797 4.37151 3.87175C4.00733 4.23552 3.5137 4.43923 2.99912 4.43863C2.48455 4.43803 1.99137 4.23318 1.62799 3.86854C1.26462 3.50391 1.06144 3.01006 1.0625 2.4955C1.06356 1.98094 1.26879 1.48797 1.6337 1.12496C1.99862 0.761938 2.49316 0.559946 3.00772 0.561136C3.52228 0.562326 4.01611 0.766447 4.37877 1.13108C4.74144 1.49571 4.94404 1.98543 4.94 2.5ZM5 5.83H1.125V18.125H5V5.83ZM10.84 5.83H6.98V18.125H10.8V11.6975C10.8 8.165 15.415 7.8475 15.415 11.6975V18.125H19.25V10.3925C19.25 4.5 12.3625 4.7275 10.8 7.615L10.84 5.83Z"
      fill="currentColor"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0C4.475 0 0 4.475 0 10C0 14.425 2.8625 18.1625 6.8375 19.4875C7.3375 19.575 7.525 19.275 7.525 19.0125C7.525 18.775 7.5125 17.9875 7.5125 17.15C5 17.6125 4.35 16.5375 4.15 15.975C4.0375 15.6875 3.55 14.8 3.125 14.5625C2.775 14.375 2.275 13.9125 3.1125 13.9C3.9 13.8875 4.4625 14.625 4.65 14.925C5.55 16.4375 6.9875 16.0125 7.5625 15.75C7.65 15.1 7.9125 14.6625 8.2 14.4125C5.975 14.1625 3.65 13.3 3.65 9.475C3.65 8.3875 4.0375 7.4875 4.675 6.7875C4.575 6.5375 4.225 5.5125 4.775 4.1375C4.775 4.1375 5.6125 3.875 7.525 5.1625C8.325 4.9375 9.175 4.825 10.025 4.825C10.875 4.825 11.725 4.9375 12.525 5.1625C14.4375 3.8625 15.275 4.1375 15.275 4.1375C15.825 5.5125 15.475 6.5375 15.375 6.7875C16.0125 7.4875 16.4 8.375 16.4 9.475C16.4 13.3125 14.0625 14.1625 11.8375 14.4125C12.2 14.725 12.5125 15.325 12.5125 16.2625C12.5125 17.6 12.5 18.675 12.5 19.0125C12.5 19.275 12.6875 19.5875 13.1875 19.4875C15.1727 18.8173 16.8977 17.5415 18.1198 15.8395C19.3419 14.1376 19.9995 12.0953 20 10C20 4.475 15.525 0 10 0Z"
      fill="currentColor"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.125 3.125H1.875C1.70924 3.125 1.55027 3.19085 1.43306 3.30806C1.31585 3.42527 1.25 3.58424 1.25 3.75V15.625C1.25 15.9565 1.3817 16.2745 1.61612 16.5089C1.85054 16.7433 2.16848 16.875 2.5 16.875H17.5C17.8315 16.875 18.1495 16.7433 18.3839 16.5089C18.6183 16.2745 18.75 15.9565 18.75 15.625V3.75C18.75 3.58424 18.6842 3.42527 18.5669 3.30806C18.4497 3.19085 18.2908 3.125 18.125 3.125ZM10 10.5781L3.16406 4.375H16.8359L10 10.5781ZM7.29297 10L2.5 14.3867V5.61328L7.29297 10ZM8.20703 10.8281L9.58203 12.0781C9.69736 12.1831 9.84595 12.2411 10 12.2411C10.154 12.2411 10.3026 12.1831 10.418 12.0781L11.793 10.8281L16.5742 15.625H3.42578L8.20703 10.8281ZM12.707 10L17.5 5.61328V14.3867L12.707 10Z"
      fill="currentColor"
    />
  </svg>
);

const ExternalArrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const links = [
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mckvr/",
    type: "link" as const,
  },
  {
    icon: GitHubIcon,
    label: "Github",
    href: "https://github.com/mckeever02",
    type: "link" as const,
  },
  {
    icon: EmailIcon,
    label: "Email me",
    email: "mckeever02@gmail.com",
    type: "copy" as const,
  },
];

const iconVariants = {
  rest: { rotate: 0 },
  hover: { rotate: -6 },
};

const appendedIconVariants = {
  rest: { scale: 0, opacity: 0 },
  hover: { scale: 1, opacity: 1 },
};

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export function SocialLinks() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <motion.div key={link.label} initial="rest" whileHover="hover" animate="rest">
          {link.type === "link" ? (
            <Link
              href={link.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-3/4 text-base text-[var(--foreground)] py-2 -ml-1 pl-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--foreground)] focus-visible:outline-offset-2"
            >
              <div className="flex items-center gap-2">
                <motion.div variants={iconVariants} transition={springTransition} aria-hidden="true">
                  <link.icon />
                </motion.div>
                <span>{link.label}</span>
              </div>
              <motion.div variants={appendedIconVariants} transition={springTransition}>
                <ExternalArrow />
              </motion.div>
            </Link>
          ) : (
            <button
              onClick={() => handleCopy(link.email!)}
              className="group flex items-center justify-between w-3/4 text-base text-[var(--foreground)] cursor-pointer py-2 -ml-1 pl-1"
            >
              <div className="flex items-center gap-2">
                <motion.div variants={iconVariants} transition={springTransition} aria-hidden="true">
                  <link.icon />
                </motion.div>
                <span>{copied ? "Copied!" : link.label}</span>
              </div>
              <motion.div variants={appendedIconVariants} transition={springTransition}>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={springTransition}
                    >
                      <CheckIcon />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={springTransition}
                    >
                      <CopyIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
