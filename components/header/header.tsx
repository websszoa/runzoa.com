import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";

export default function Header() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 w-full border-b border-gray-400/20 bg-background"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </header>
  );
}
