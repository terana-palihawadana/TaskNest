function TaskNestLogo({ size = 40, className = "", showBackground = true }) {
  const ink = showBackground ? "#003333" : "#99CC33";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showBackground && (
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#99CC33" />
      )}

      {/* Task list */}
      <path
        d="M13 13H24"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M13 17H21"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Completed task */}
      <path
        d="M14 23L18 27L28 17"
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nest cradling your work */}
      <path
        d="M8 26C8 32 32 32 32 26"
        stroke={ink}
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <path
        d="M10 28C14 31 26 31 30 28"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export default TaskNestLogo;
