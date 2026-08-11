type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "brand-mark" }: BrandMarkProps) {
  return (
    <img
      aria-hidden="true"
      className={className}
      draggable="false"
      height="512"
      src="/brand/wyksofts-mark.png"
      width="408"
    />
  );
}
