
interface TikTokIconProps {
  className?: string;
}

const TikTokIcon = ({ className = "h-8 w-8" }: TikTokIconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.996-1.302-2.301-1.302-3.751V0h-3.518v15.72c0 1.637-1.295 2.967-2.887 2.967-1.59 0-2.886-1.33-2.886-2.967 0-1.636 1.296-2.966 2.886-2.966.334 0 .655.058.952.164V9.35a6.485 6.485 0 0 0-.952-.071c-3.578 0-6.477 2.987-6.477 6.672 0 3.686 2.899 6.672 6.477 6.672 3.579 0 6.478-2.986 6.478-6.672V8.225a9.698 9.698 0 0 0 5.618 1.784V6.39c-1.04 0-2.02-.333-2.809-.828z"/>
    </svg>
  );
};

export default TikTokIcon;
