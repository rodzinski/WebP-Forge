import Image from "next/image";

type BrandMarkProps = {
  size: number;
  priority?: boolean;
};

export function BrandMark({ size, priority = false }: BrandMarkProps) {
  return (
    <Image
      src="/favicon.svg"
      alt=""
      width={size}
      height={size}
      priority={priority}
      unoptimized
    />
  );
}
