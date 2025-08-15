import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui";
import Link from "next/link";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Landing Page for sketcher</h1>
      <p className="text-lg">
        This is the landing page for sketcher.
      </p>
      <Button>
        <Link href="/sign-in">Login</Link>
      </Button>
    </div>
  );
}
